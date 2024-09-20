module Commands.Clean

open System.IO
open Config
open Utils
open PackageManager

let cleanApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let config = readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Clean libs
    if Directory.Exists(libsDir) then
        printfn "📂 Cleaning libs directory: %s" libsDir
        let libDirs = Directory.GetDirectories(libsDir)

        libDirs
        |> Array.iter (fun dir -> NPM.deleteNodeModules dir |> Async.AwaitTask |> Async.RunSynchronously)

        printfn "🧹 Finished cleaning libs"

    // Clean apps
    if Directory.Exists(appsDir) then
        printfn "📂 Cleaning apps directory: %s" appsDir
        let appDirs = Directory.GetDirectories(appsDir)

        appDirs
        |> Array.iter (fun dir -> NPM.deleteNodeModules dir |> Async.AwaitTask |> Async.RunSynchronously)

        printfn "🧹 Finished cleaning apps"

    printfn "🚀 Finished cleaning all node_modules"
