module PackageManager.NPM

open System.IO
open System.Diagnostics
open System.Threading.Tasks
open Config

let private runCommand (command: string) (args: string) (dir: string) =
    task {
        let psi = ProcessStartInfo()
        psi.FileName <- command
        psi.Arguments <- args
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

let runScript (dir: string) (scriptName: string) =
    task {
        printfn "🚀 Running npm script '%s' in %s" scriptName (Path.GetFileName dir)
        let! (_, exitCode, _output, error) = runCommand "npm" ("run " + scriptName) dir

        if exitCode = 0 then
            printfn "✅ Finished running npm script '%s' in %s" scriptName (Path.GetFileName dir)
        else
            printfn "❌ npm script '%s' failed in %s" scriptName (Path.GetFileName dir)
            printfn "Error output:"
            printfn "%s" error

        return exitCode
    }

let install (dirs: string seq) =
    let config = readConfig ()
    let maxWorkers = config.MaxParallelism
    printfn "🚀 Using %d parallel workers for npm install" maxWorkers

    let installDir (dir: string) =
        task {
            printfn "📦 Starting npm install in %s" (Path.GetFileName dir)
            let! (_, exitCode, _, _) = runCommand "npm" "install" dir

            if exitCode = 0 then
                printfn "✅ Finished npm install in %s" (Path.GetFileName dir)
            else
                printfn "❌ npm install failed in %s" (Path.GetFileName dir)
        }

    dirs |> Seq.map installDir |> (fun tasks -> Task.WhenAll(tasks))

let deleteNodeModules (dirs: string seq) =
    let config = readConfig ()
    let maxWorkers = config.MaxParallelism
    printfn "🚀 Using %d parallel workers for deleting node_modules" maxWorkers

    let deleteNodeModulesDir (dir: string) =
        task {
            let nodeModulesPath = Path.Combine(dir, "node_modules")

            if Directory.Exists(nodeModulesPath) then
                printfn "🗑️  Starting deletion of node_modules in %s" (Path.GetFileName dir)

                try
                    Directory.Delete(nodeModulesPath, true)
                    printfn "✅ Finished deleting node_modules in %s" (Path.GetFileName dir)
                with ex ->
                    printfn "❌ Failed to delete node_modules in %s: %s" (Path.GetFileName dir) ex.Message
            else
                printfn "ℹ️  No node_modules found in %s" (Path.GetFileName dir)
        }

    dirs |> Seq.map deleteNodeModulesDir |> (fun tasks -> Task.WhenAll(tasks))
