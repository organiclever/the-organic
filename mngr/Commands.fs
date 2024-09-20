module Commands

open System
open System.IO
open System.Diagnostics
open System.Threading
open System.Threading.Tasks
open Config
open Utils

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

let initializeProjects (dir: string) =
    if Directory.Exists(dir) then
        printfn $"📂 Found directory: %s{dir}"
        let projectDirs = Directory.GetDirectories(dir)
        let config = readConfig ()
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
    let config = readConfig ()
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
