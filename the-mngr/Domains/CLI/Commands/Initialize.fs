module Domains.CLI.Commands.Initialize

open System.IO
open Config
open Domains


/// <summary>
/// Determines whether a project in the given directory should be initialized.
/// </summary>
/// <param name="dir">The directory path of the project to check.</param>
/// <returns>
/// Returns true if the project is an NPM project and should be initialized,
/// false otherwise.
/// </returns>
/// <remarks>
/// This function checks the project type using PackageManager.Project.getKind.
/// If the project is of type NPM, it returns true.
/// If the project type is unknown, it prints a warning message and returns false.
/// </remarks>
let shouldInitialize (dir: string) =
    match PackageManager.Project.getKind dir with
    | PackageManager.Project.NPM, _ -> true
    | PackageManager.Project.Unknown, value ->
        printfn "⚠️  Unknown project type in directory: %s" dir
        printfn "   project.kind value: %s" value
        false

/// <summary>
/// Ensures that Fantomas is installed by running 'dotnet tool restore'.
/// </summary>
/// <remarks>
/// This function performs the following steps:
/// 1. Prints a message indicating that it's checking for Fantomas installation.
/// 2. Runs the 'dotnet tool restore' command in the current directory.
/// 3. Checks the exit code of the command:
///    - If the exit code is 0, it prints a success message.
///    - If the exit code is non-zero, it prints an error message and the error output.
/// </remarks>
let ensureFantomasInstalled () =
    printfn "🔧 Ensuring Fantomas is installed..."

    let (_, exitCode, _, error) =
        Utils.Terminal.runCommand "dotnet" "tool restore" (Directory.GetCurrentDirectory())
        |> Async.AwaitTask
        |> Async.RunSynchronously

    if exitCode <> 0 then
        printfn "❌ Failed to restore dotnet tools. Please run 'dotnet tool restore' manually."
        printfn "Error output:"
        printfn "%s" error
    else
        printfn "✅ Fantomas installation check completed successfully."

/// <summary>
/// Initializes the apps and libs in the monorepo.
/// </summary>
/// <remarks>
/// This function performs the following steps:
/// 1. Ensures Fantomas is installed.
/// 2. Finds the repository root and reads the configuration.
/// 3. Installs dependencies at the root level.
/// 4. Initializes libraries and applications by installing their dependencies.
/// 5. Builds the tmngr tool.
/// </remarks>
let initializeApps () =
    ensureFantomasInstalled ()
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = GitRepo.findRoot currentDir
    let config = read ()
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

    // Build libs
    printfn "📦 Building libs"

    PackageManager.NPM.runScripts libsDirsToInitialize "build"
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    // Add the tmngr:build step
    printfn "🛠️  Building tmngr..."

    let buildResult =
        PackageManager.NPM.runScript repoRoot "tmngr:build"
        |> Async.AwaitTask
        |> Async.RunSynchronously

    match buildResult with
    | 0 -> printfn "✅ tmngr built successfully"
    | _ -> printfn "❌ Failed to build tmngr. Please check the output and try again."
