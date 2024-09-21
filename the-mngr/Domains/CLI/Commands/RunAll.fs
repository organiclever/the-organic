module Domains.CLI.Commands.RunAll

open System.IO
open Domains
open Domains.PackageManager

let runInProjects scriptName =
    let appsDir = GitRepo.findAppsDir ()
    let libsDir = GitRepo.findLibsDir ()

    let runProjectsInDir dir =
        if Directory.Exists dir then
            Directory.GetDirectories dir
            |> Array.map (fun projectPath ->
                let packageJsonPath = Path.Combine(projectPath, "package.json")

                if File.Exists packageJsonPath then
                    let project = NPM.readPackageJson packageJsonPath

                    if Map.containsKey scriptName project.Scripts then
                        Some(Path.GetFileName projectPath)
                    else
                        None
                else
                    None)
            |> Array.choose id
        else
            [||]

    let appsWithScript = runProjectsInDir appsDir
    let libsWithScript = runProjectsInDir libsDir

    let allProjects = Array.append appsWithScript libsWithScript

    if Array.isEmpty allProjects then
        eprintfn "❌ Error: No projects found with script '%s'." scriptName
        1
    else
        printfn "🚀 Running script '%s' for all applicable projects concurrently..." scriptName

        let results =
            allProjects
            |> Array.map (fun projectName ->
                async {
                    printfn "\n▶️ Starting for project: %s" projectName

                    let! result = async { return Run.runScript scriptName projectName }

                    return projectName, result
                })
            |> Async.Parallel
            |> Async.RunSynchronously

        let successfulProjects = ResizeArray<string>()
        let failedProjects = ResizeArray<string * int>()

        for projectName, result in results do
            if result = 0 then
                successfulProjects.Add(projectName)
            else
                failedProjects.Add((projectName, result))

        printfn "\n📊 Execution Summary:"
        printfn "==================="

        if successfulProjects.Count > 0 then
            printfn "\n✅ Successful projects:"

            for project in successfulProjects do
                printfn "- %s" project

        if failedProjects.Count > 0 then
            printfn "\n❌ Failed projects:"

            for project, exitCode in failedProjects do
                printfn "- %s (Exit code: %d)" project exitCode

        if failedProjects.Count > 0 then
            eprintfn "\n❌ Script '%s' failed for one or more projects." scriptName
            1
        else
            printfn "\n🎉 Script '%s' completed successfully for all projects." scriptName
            0
