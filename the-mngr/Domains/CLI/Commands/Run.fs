module Domains.CLI.Commands.Run

open System
open System.IO
open Domains
open Domains.PackageManager

/// <summary>
/// Runs a specified script for a given project in the monorepo.
/// </summary>
/// <param name="scriptName">The name of the script to run.</param>
/// <param name="projectName">The name of the project to run the script for.</param>
/// <returns>
/// An integer representing the exit code of the script execution:
/// 0 if successful, 1 if there's an error finding the project or script,
/// or the actual exit code of the script if it fails during execution.
/// </returns>
/// <remarks>
/// This function performs the following steps:
/// 1. Locates the project directory in either the apps or libs folder.
/// 2. Checks for the existence of package.json in the project directory.
/// 3. Reads the package.json file to find the specified script.
/// 4. If the script is found, it executes it using npm.
/// 5. Prints appropriate success or error messages based on the execution result.
/// </remarks>
let runScript scriptName projectName =
    let projectPath =
        let appPath = GitRepo.findAppsDir ()
        let libPath = GitRepo.findLibsDir ()

        let appProjectPath = Path.Combine(appPath, projectName)
        let libProjectPath = Path.Combine(libPath, projectName)

        if Directory.Exists appProjectPath then appProjectPath
        elif Directory.Exists libProjectPath then libProjectPath
        else ""

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
