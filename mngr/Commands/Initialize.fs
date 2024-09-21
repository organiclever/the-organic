module Commands.Initialize

open System.IO
open Config
open Domains


let shouldInitialize (dir: string) =
    match PackageManager.Project.getKind dir with
    | PackageManager.Project.NPM, _ -> true
    | PackageManager.Project.Unknown, value ->
        printfn "⚠️  Unknown project type in directory: %s" dir
        printfn "   project.kind value: %s" value
        false

let ensureFantomasInstalled () =
    printfn "🔧 Ensuring Fantomas is installed..."

    let (_, exitCode, _, error) =
        Terminal.runCommand "dotnet" "tool restore" (Directory.GetCurrentDirectory())
        |> Async.AwaitTask
        |> Async.RunSynchronously

    if exitCode <> 0 then
        printfn "❌ Failed to restore dotnet tools. Please run 'dotnet tool restore' manually."
        printfn "Error output:"
        printfn "%s" error
    else
        printfn "✅ Fantomas installation check completed successfully."

let initializeApps () =
    ensureFantomasInstalled ()
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = GitRepo.findRoot currentDir
    let config = readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Install dependencies at the root level first
    printfn "📦 Installing dependencies at the root level"

    PackageManager.NPM.install [ repoRoot ]
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    printfn "✅ Finished installing root dependencies"

    let libsDirsToInitialize =
        [| if Directory.Exists(libsDir) then
               yield! Directory.GetDirectories(libsDir) |> Array.filter shouldInitialize |]

    // Initialize apps and libs
    printfn "📦 Initializing apps and libs"

    PackageManager.NPM.install libsDirsToInitialize
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    let appsDirsToInitialize =
        [| if Directory.Exists(appsDir) then
               yield! Directory.GetDirectories(appsDir) |> Array.filter shouldInitialize |]

    // Initialize apps and libs
    printfn "📦 Initializing apps and libs"

    PackageManager.NPM.install appsDirsToInitialize
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore


    printfn "🚀 Finished initializing all apps and libs"

    // Add the build:mngr step
    printfn "🛠️  Building mngr..."

    let buildResult =
        PackageManager.NPM.runScript repoRoot "build:mngr"
        |> Async.AwaitTask
        |> Async.RunSynchronously

    match buildResult with
    | 0 -> printfn "✅ mngr built successfully"
    | _ -> printfn "❌ Failed to build mngr. Please check the output and try again."
