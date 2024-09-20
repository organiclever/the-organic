module Commands.Reset

open System.IO
open System.Threading.Tasks
open Config
open Utils.Commons
open PackageManager
open PackageManager.ProjectKind

let resetApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let config = readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Reset root dependencies
    printfn "🔄 Resetting root dependencies"
    NPM.deleteNodeModules repoRoot |> Async.AwaitTask |> Async.RunSynchronously

    let processDirectory (dirType: string) (dir: string) =
        printfn $"📂 Found {dirType} directory: %s{dir}"
        let subDirs = Directory.GetDirectories(dir)

        subDirs
        |> Array.iter (fun subDir ->
            match fst (Initialize.getProjectKind subDir) with
            | NPM -> printfn $"▶️ Processing {dirType}: %s{Path.GetFileName(subDir)}"
            | Unknown -> printfn $"⏭️ Skipping {dirType}: %s{Path.GetFileName(subDir)}")

        subDirs
        |> Array.filter (fun subDir -> fst (Initialize.getProjectKind subDir) = NPM)
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

    // Run npm install for the root
    printfn "📦 Installing dependencies at the root level"
    NPM.install repoRoot |> Async.AwaitTask |> Async.RunSynchronously |> ignore
    printfn "✅ Finished installing root dependencies"

    // Run npm install for libs and apps
    Initialize.initializeApps ()
