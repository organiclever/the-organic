open System
open System.IO
open System.Diagnostics
open System.Threading
open System.Threading.Tasks

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
        let maxParallelism = Math.Max(1, Environment.ProcessorCount - 1)
        printfn "🖥️  Running with max parallelism: %d" maxParallelism

        use semaphore = new SemaphoreSlim(maxParallelism)

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
        let maxParallelism = Math.Max(1, Environment.ProcessorCount - 1)
        printfn "🖥️  Running with max parallelism: %d" maxParallelism

        use semaphore = new SemaphoreSlim(maxParallelism)

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

    match argv with
    | [| "--init" |] ->
        printfn "🏗️  Initializing apps..."
        initializeApps ()
        0
    | [| "--reset" |] ->
        printfn "🔄 Resetting apps..."
        resetApps ()
        0
    | [| "--help" |]
    | [| "-h" |] ->
        printHelp ()
        0
    | _ ->
        printfn "❓ Unknown command or option"
        printHelp ()
        1
