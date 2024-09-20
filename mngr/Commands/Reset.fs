module Commands.Reset

open System.IO
open System.Threading.Tasks
open Config
open Utils
open PackageManager
open Types

let resetApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let config = readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    let processDirectory (dirType: string) (dir: string) =
        printfn $"📂 Found {dirType} directory: %s{dir}"
        let subDirs = Directory.GetDirectories(dir)

        subDirs
        |> Array.iter (fun subDir ->
            match fst (Commands.Initialize.getProjectKind subDir) with
            | NPM -> printfn $"▶️ Processing {dirType}: %s{Path.GetFileName(subDir)}"
            | Unknown -> printfn $"⏭️ Skipping {dirType}: %s{Path.GetFileName(subDir)}")

        subDirs
        |> Array.filter (fun subDir -> fst (Commands.Initialize.getProjectKind subDir) = NPM)
        |> Array.map (fun subDir ->
            task {
                do! NPM.deleteNodeModules subDir
                printfn $"✅ Finished resetting {dirType}: %s{Path.GetFileName(subDir)}"
                return subDir
            })
        |> Task.WhenAll
        |> Async.AwaitTask
        |> Async.RunSynchronously
        |> ignore

        printfn $"🧹 Finished resetting {dirType}s"

    // Reset libs first
    if Directory.Exists(libsDir) then
        processDirectory "lib" libsDir

    // Then reset apps
    if Directory.Exists(appsDir) then
        processDirectory "app" appsDir

    // Run npm install
    Commands.Initialize.initializeApps ()
