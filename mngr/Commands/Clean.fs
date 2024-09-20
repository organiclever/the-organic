module Commands.Clean

open System.IO
open Config
open Utils.Commons
open PackageManager

let cleanApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let config = readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Clean root
    printfn "📂 Cleaning root directory: %s" repoRoot
    NPM.deleteNodeModules repoRoot |> Async.AwaitTask |> Async.RunSynchronously
    printfn "🧹 Finished cleaning root"

    // Clean apps
    printfn "📂 Cleaning apps directory: %s" appsDir

    Directory.GetDirectories(appsDir)
    |> Array.iter (fun appDir ->
        printfn "  🗑️  Cleaning %s" (Path.GetFileName appDir)
        NPM.deleteNodeModules appDir |> Async.AwaitTask |> Async.RunSynchronously)

    printfn "🧹 Finished cleaning apps"

    // Clean libs
    printfn "📂 Cleaning libs directory: %s" libsDir

    Directory.GetDirectories(libsDir)
    |> Array.iter (fun libDir ->
        printfn "  🗑️  Cleaning %s" (Path.GetFileName libDir)
        NPM.deleteNodeModules libDir |> Async.AwaitTask |> Async.RunSynchronously)

    printfn "🧹 Finished cleaning libs"

// ... (keep the rest of the existing code)
