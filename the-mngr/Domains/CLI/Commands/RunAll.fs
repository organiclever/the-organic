module Domains.CLI.Commands.RunAll

open System.IO
open Domains
open Domains.PackageManager

let runInProjects scriptName =
    let appsDir = GitRepo.findAppsDir ()
    let libsDir = GitRepo.findLibsDir ()

    let runProjectsInDir dir isApp =
        if Directory.Exists dir then
            Directory.GetDirectories dir
            |> Array.map (fun projectPath ->
                let packageJsonPath = Path.Combine(projectPath, "package.json")

                if File.Exists packageJsonPath then
                    let project = NPM.readPackageJson packageJsonPath

                    if Map.containsKey scriptName project.Scripts then
                        Some(Path.GetFileName projectPath, isApp)
                    else
                        None
                else
                    None)
            |> Array.choose id
        else
            [||]

    let appsWithScript = runProjectsInDir appsDir true
    let libsWithScript = runProjectsInDir libsDir false

    let allProjects = Array.append appsWithScript libsWithScript

    if Array.isEmpty allProjects then
        eprintfn "❌ Error: No projects found with script '%s'." scriptName
        1
    else
        printfn "🚀 Running script '%s' for all applicable projects concurrently..." scriptName

        let results =
            allProjects
            |> Array.map (fun (projectName, isApp) ->
                async {
                    printfn "\n▶️ Starting for %s: %s" (if isApp then "app" else "lib") projectName

                    let! result = async { return Run.runScript scriptName projectName }

                    return projectName, isApp, result
                })
            |> Async.Parallel
            |> Async.RunSynchronously

        let successfulProjects = ResizeArray<string * bool>()
        let failedProjects = ResizeArray<string * bool * int>()

        for projectName, isApp, result in results do
            if result = 0 then
                successfulProjects.Add((projectName, isApp))
            else
                failedProjects.Add((projectName, isApp, result))

        printfn "\n📊 Execution Summary:"
        printfn "==================="
        printfn "Running '%s' in:" scriptName
        printfn "- Apps directory: %s" appsDir
        printfn "- Libs directory: %s" libsDir

        if successfulProjects.Count > 0 then
            printfn "\n✅ Successful runs on projects:"

            for project, isApp in successfulProjects do
                printfn "- %s (%s)" project (if isApp then "app" else "lib")

        if failedProjects.Count > 0 then
            printfn "\n❌ Failed runs on projects:"

            for project, isApp, exitCode in failedProjects do
                printfn "- %s (%s) (Exit code: %d)" project (if isApp then "app" else "lib") exitCode

        if failedProjects.Count > 0 then
            eprintfn "\n❌ Script '%s' failed for one or more projects." scriptName
            1
        else
            printfn "\n🎉 Script '%s' completed successfully for all projects." scriptName
            0
