module Commands.Clean

open System.IO
open Config
open Utils.Commons
open Domains.PackageManager

let cleanApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let config = readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Clean root
    printfn "📂 Cleaning root directory: %s" repoRoot

    NPM.deleteNodeModules [ repoRoot ]
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

    NPM.deleteNodeModules dirsToClean
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    printfn "🎉 All cleaning tasks completed"
