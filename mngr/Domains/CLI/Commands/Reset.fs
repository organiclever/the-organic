module Domains.CLI.Commands.Reset

open System.IO
open Config
open Domains

let resetApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = GitRepo.findRoot currentDir
    let config = read ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Reset root dependencies
    printfn "🔄 Resetting root dependencies"

    PackageManager.NPM.deleteNodeModules [ repoRoot ]
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    let dirsToReset =
        [| if Directory.Exists(libsDir) then
               yield!
                   Directory.GetDirectories(libsDir)
                   |> Array.filter (fun dir -> fst (PackageManager.Project.getKind dir) = PackageManager.Project.NPM)
           if Directory.Exists(appsDir) then
               yield!
                   Directory.GetDirectories(appsDir)
                   |> Array.filter (fun dir -> fst (PackageManager.Project.getKind dir) = PackageManager.Project.NPM) |]

    // Reset apps and libs
    printfn "🔄 Resetting apps and libs"

    PackageManager.NPM.deleteNodeModules dirsToReset
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    // Run npm install for the root
    printfn "📦 Installing dependencies at the root level"

    PackageManager.NPM.install [ repoRoot ]
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    printfn "✅ Finished installing root dependencies"

    // Run npm install for libs and apps
    printfn "📦 Installing dependencies for apps and libs"

    PackageManager.NPM.install dirsToReset
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    printfn "🚀 Finished resetting all apps and libs"
