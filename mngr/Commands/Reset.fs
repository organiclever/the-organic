module Commands.Reset

open System.IO
open System.Threading.Tasks
open Config
open Utils
open PackageManager

let resetApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let config = readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Reset libs first
    if Directory.Exists(libsDir) then
        printfn "📂 Found libs directory: %s" libsDir
        let libDirs = Directory.GetDirectories(libsDir)

        libDirs
        |> Array.map (fun dir ->
            task {
                do! NPM.deleteNodeModules dir
                return dir
            })
        |> Task.WhenAll
        |> Async.AwaitTask
        |> Async.RunSynchronously
        |> ignore

        printfn "🧹 Finished resetting libs"

    // Then reset apps
    if Directory.Exists(appsDir) then
        printfn "📂 Found apps directory: %s" appsDir
        let appDirs = Directory.GetDirectories(appsDir)

        appDirs
        |> Array.map (fun dir ->
            task {
                do! NPM.deleteNodeModules dir
                return dir
            })
        |> Task.WhenAll
        |> Async.AwaitTask
        |> Async.RunSynchronously
        |> ignore

        printfn "🧹 Finished resetting apps"

    // Run npm install
    Commands.Initialize.initializeApps ()
