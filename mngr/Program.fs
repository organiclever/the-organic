open System
open System.IO
open System.Diagnostics
open System.Threading
open System.Threading.Tasks
open CommandLine
// Remove the System.Text.Json import as it's no longer needed here

// Define command-line options
type Options =
    { [<Option('i', "init", Required = false, HelpText = "Initialize all apps in the monorepo")>]
      Init: bool
      [<Option('r', "reset", Required = false, HelpText = "Delete all node_modules and reinitialize apps")>]
      Reset: bool }

// Remove the Config type and readConfig function from here

let runNpmInstall (dir: string) =
    task {
        let psi = ProcessStartInfo()
        psi.FileName <- "npm"
        psi.Arguments <- "install"
        psi.WorkingDirectory <- dir
        psi.RedirectStandardOutput <- true
        psi.RedirectStandardError <- true
        psi.UseShellExecute <- false
        psi.CreateNoWindow <- true

        use p = new Process()
        p.StartInfo <- psi
        p.Start() |> ignore

        let! output = p.StandardOutput.ReadToEndAsync()
        let! error = p.StandardError.ReadToEndAsync()
        do! p.WaitForExitAsync()

        return (dir, p.ExitCode, output, error)
    }

let findRepoRoot (startDir: string) =
    let rec findRoot (dir: string) =
        if Directory.Exists(Path.Combine(dir, ".git")) then
            dir
        else
            let parent = Directory.GetParent(dir)

            if parent = null then
                failwith "Repository root not found 😕"
            else
                findRoot parent.FullName

    findRoot startDir

let initializeProjects (dir: string) =
    if Directory.Exists(dir) then
        printfn $"📂 Found directory: %s{dir}"
        let projectDirs = Directory.GetDirectories(dir)
        let config = Config.readConfig ()
        printfn $"🖥️  Running with max parallelism: %d{config.MaxParallelism}"

        use semaphore = new SemaphoreSlim(config.MaxParallelism)

        projectDirs
        |> Array.map (fun projectDir ->
            task {
                do! semaphore.WaitAsync()

                try
                    return! runNpmInstall projectDir
                finally
                    semaphore.Release() |> ignore
            })
        |> Task.WhenAll
        |> Async.AwaitTask
        |> Async.RunSynchronously
        |> Array.iter (fun (dir, exitCode, output, error) ->
            if exitCode = 0 then
                printfn $"✅ Finished npm install in %s{dir}"
            else
                printfn $"❌ npm install failed in %s{dir} with exit code %d{exitCode}"
                printfn $"Error output: %s{error}")

        printfn $"🎉 All projects in %s{dir} initialized successfully!"
    else
        printfn $"❓ Directory not found: %s{dir}"

let initializeApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let config = Config.readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Initialize libs first
    initializeProjects libsDir

    // Then initialize apps
    initializeProjects appsDir

let deleteNodeModules (dir: string) =
    task {
        let nodeModulesPath = Path.Combine(dir, "node_modules")

        if Directory.Exists(nodeModulesPath) then
            Directory.Delete(nodeModulesPath, true)
            printfn "🗑️  Deleted node_modules in %s" dir
        else
            printfn "ℹ️  No node_modules found in %s" dir
    }

let resetApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let config = Config.readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Reset libs first
    if Directory.Exists(libsDir) then
        printfn "📂 Found libs directory: %s" libsDir
        let libDirs = Directory.GetDirectories(libsDir)

        libDirs
        |> Array.map (fun dir ->
            task {
                do! deleteNodeModules dir
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
                do! deleteNodeModules dir
                return dir
            })
        |> Task.WhenAll
        |> Async.AwaitTask
        |> Async.RunSynchronously
        |> ignore

        printfn "🧹 Finished resetting apps"

    // Run npm install
    initializeApps ()

let printHelp () =
    printfn "Usage: mngr [command] [options]"
    printfn ""
    printfn "Commands:"
    printfn "  --init         Initialize all apps in the monorepo"
    printfn "  --reset        Delete all node_modules and reinitialize apps"
    printfn "  --help, -h     Show this help message"
    printfn ""
    printfn "Options:"
    printfn "  None currently available"

[<EntryPoint>]
let main argv =
    printfn "🚀 mngr - The Organic Monorepo Manager"

    let result = Parser.Default.ParseArguments<Options>(argv)

    match result with
    | :? Parsed<Options> as parsed ->
        let opts = parsed.Value

        if opts.Init then
            printfn "🏗️  Initializing apps..."
            initializeApps ()
            0
        elif opts.Reset then
            printfn "🔄 Resetting apps..."
            resetApps ()
            0
        else
            printfn "No action specified. Use --help to see available options."
            0
    | :? NotParsed<Options> as notParsed ->
        printfn "Error: %A" (notParsed.Errors |> Seq.map (fun e -> e.Tag.ToString()))
        1
    | _ -> 1
