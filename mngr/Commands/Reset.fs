module Commands.Reset

open System.IO
open Config
open Domains.PackageManager
open Domains.GitRepo

let resetApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRoot currentDir
    let config = readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Reset root dependencies
    printfn "🔄 Resetting root dependencies"

    NPM.deleteNodeModules [ repoRoot ]
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    let dirsToReset =
        [| if Directory.Exists(libsDir) then
               yield!
                   Directory.GetDirectories(libsDir)
                   |> Array.filter (fun dir -> fst (Project.getKind dir) = Project.NPM)
           if Directory.Exists(appsDir) then
               yield!
                   Directory.GetDirectories(appsDir)
                   |> Array.filter (fun dir -> fst (Project.getKind dir) = Project.NPM) |]

    // Reset apps and libs
    printfn "🔄 Resetting apps and libs"

    NPM.deleteNodeModules dirsToReset
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    // Run npm install for the root
    printfn "📦 Installing dependencies at the root level"
    NPM.install [ repoRoot ] |> Async.AwaitTask |> Async.RunSynchronously |> ignore
    printfn "✅ Finished installing root dependencies"

    // Run npm install for libs and apps
    printfn "📦 Installing dependencies for apps and libs"
    NPM.install dirsToReset |> Async.AwaitTask |> Async.RunSynchronously |> ignore

    printfn "🚀 Finished resetting all apps and libs"
