module Commands.Initialize

open System.IO
open System.Threading.Tasks
open Config
open Utils
open PackageManager

let initializeApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let config = readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    if Directory.Exists(libsDir) then
        printfn "📂 Found libs directory: %s" libsDir
        let libDirs = Directory.GetDirectories(libsDir)

        libDirs
        |> Array.map (fun dir ->
            task {
                let! result = NPM.install dir
                return (dir, result)
            })
        |> Task.WhenAll
        |> Async.AwaitTask
        |> Async.RunSynchronously
        |> ignore

    if Directory.Exists(appsDir) then
        printfn "📂 Found apps directory: %s" appsDir
        let appDirs = Directory.GetDirectories(appsDir)

        appDirs
        |> Array.map (fun dir ->
            task {
                let! result = NPM.install dir
                return (dir, result)
            })
        |> Task.WhenAll
        |> Async.AwaitTask
        |> Async.RunSynchronously
        |> ignore

    printfn "🚀 Finished initializing all apps"
