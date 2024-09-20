open System
open System.IO
open System.Diagnostics
open System.Threading
open System.Threading.Tasks
open CommandLine
open System.Text.Json

// Define command-line options
type Options =
    { [<Option('i', "init", Required = false, HelpText = "Initialize all apps in the monorepo")>]
      Init: bool
      [<Option('r', "reset", Required = false, HelpText = "Delete all node_modules and reinitialize apps")>]
      Reset: bool }

type Config = { MaxParallelism: int }

let readConfig () =
    let configPath = Path.Combine(Directory.GetCurrentDirectory(), "config.json")
    let defaultConfig = { MaxParallelism = Math.Max(1, Environment.ProcessorCount - 1) }

    if File.Exists(configPath) then
        try
            let jsonString = File.ReadAllText(configPath)
            let config = JsonSerializer.Deserialize<Config>(jsonString)

            { config with
                MaxParallelism =
                    if config.MaxParallelism > 0 then
                        config.MaxParallelism
                    else
                        defaultConfig.MaxParallelism }
        with _ ->
            defaultConfig
    else
        defaultConfig

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

let initializeApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let appsDir = Path.Combine(repoRoot, "apps")

    if Directory.Exists(appsDir) then
        printfn "📂 Found apps directory: %s" appsDir
        let appDirs = Directory.GetDirectories(appsDir)
        let config = readConfig ()
        printfn "🖥️  Running with max parallelism: %d" config.MaxParallelism

        use semaphore = new SemaphoreSlim(config.MaxParallelism)

        appDirs
        |> Array.map (fun dir ->
            task {
                do! semaphore.WaitAsync()

                try
                    return! runNpmInstall dir
                finally
                    semaphore.Release() |> ignore
            })
        |> Task.WhenAll
        |> Async.AwaitTask
        |> Async.RunSynchronously
        |> Array.iter (fun (dir, exitCode, output, error) ->
            if exitCode = 0 then
                printfn "✅ Finished npm install in %s" dir
            else
                printfn "❌ npm install failed in %s with exit code %d" dir exitCode
                printfn "Error output: %s" error)

        printfn "🎉 All apps initialized successfully!"
    else
        printfn "❓ Apps directory not found: %s" appsDir

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
    let appsDir = Path.Combine(repoRoot, "apps")

    if Directory.Exists(appsDir) then
        printfn "📂 Found apps directory: %s" appsDir
        let appDirs = Directory.GetDirectories(appsDir)
        let config = readConfig ()
        printfn "🖥️  Running with max parallelism: %d" config.MaxParallelism

        use semaphore = new SemaphoreSlim(config.MaxParallelism)

        // Delete node_modules in parallel
        appDirs
        |> Array.map (fun dir ->
            task {
                do! semaphore.WaitAsync()

                try
                    do! deleteNodeModules dir
                finally
                    semaphore.Release() |> ignore
            })
        |> Task.WhenAll
        |> Async.AwaitTask
        |> Async.RunSynchronously
        |> ignore // Add this line to ignore the result

        printfn "🧹 All node_modules directories deleted"

        // Run npm install
        initializeApps ()
    else
        printfn "❓ Apps directory not found: %s" appsDir

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
