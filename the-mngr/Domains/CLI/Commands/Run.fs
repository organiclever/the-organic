module Domains.CLI.Commands.Run

open System
open System.IO
open Domains
open Domains.PackageManager


let runScript scriptName projectName =
    let projectPath =
        let appPath = GitRepo.findAppsDir ()
        let libPath = GitRepo.findLibsDir ()

        if Directory.Exists appPath then
            Path.Combine(appPath, projectName)
        elif Directory.Exists libPath then
            Path.Combine(libPath, projectName)
        else
            ""

    if String.IsNullOrEmpty projectPath then
        eprintfn "Error: Project '%s' not found in apps or libs directory." projectName
        1
    else
        let packageJsonPath = Path.Combine(projectPath, "package.json")

        if not (File.Exists packageJsonPath) then
            eprintfn "Error: package.json not found for project '%s'." projectName
            1
        else
            let project = NPM.readPackageJson packageJsonPath

            match Map.tryFind scriptName project.Scripts with
            | Some _scriptCommand ->
                printfn "Running script '%s' for project '%s'..." scriptName projectName

                let result =
                    Utils.Terminal.runCommandAndStream "npm" [ "run"; scriptName ] (Some projectPath)

                match result with
                | 0 ->
                    printfn "Script '%s' completed successfully." scriptName
                    0
                | _ ->
                    eprintfn "Script '%s' failed with exit code %d" scriptName result
                    result
            | None ->
                eprintfn "Error: Script '%s' not found in package.json for project '%s'." scriptName projectName
                1
