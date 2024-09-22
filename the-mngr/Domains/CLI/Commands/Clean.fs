module Domains.CLI.Commands.Clean

open System.IO
open Domains

/// <summary>
/// Cleans the node_modules directories in the root, apps, and libs folders of the repository.
/// </summary>
/// <remarks>
/// This function performs the following steps:
/// 1. Finds the root directory of the Git repository.
/// 2. Reads the configuration to get the paths for libs and apps directories.
/// 3. Cleans the root directory by deleting its node_modules folder.
/// 4. Identifies all subdirectories in the libs and apps folders.
/// 5. Cleans all identified subdirectories by deleting their node_modules folders.
/// </remarks>
let cleanApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = GitRepo.findRoot currentDir
    let config = Config.read ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Clean root
    printfn "📂 Cleaning root directory: %s" repoRoot

    PackageManager.NPM.deleteNodeModules [ repoRoot ]
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    printfn "🧹 Finished cleaning root"

    let dirsToClean =
        [| if Directory.Exists(libsDir) then
               yield! Directory.GetDirectories(libsDir)
           if Directory.Exists(appsDir) then
               yield! Directory.GetDirectories(appsDir) |]

    // Clean apps and libs
    printfn "📂 Cleaning apps and libs directories"

    PackageManager.NPM.deleteNodeModules dirsToClean
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    printfn "🎉 All cleaning tasks completed"
