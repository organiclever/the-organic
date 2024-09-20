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

// ... (keep the rest of the existing code)
