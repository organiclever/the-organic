module PackageManager.NPM

open System.IO
open System.Diagnostics

let install (dir: string) =
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

let deleteNodeModules (dir: string) =
    task {
        let nodeModulesPath = Path.Combine(dir, "node_modules")

        if Directory.Exists(nodeModulesPath) then
            Directory.Delete(nodeModulesPath, true)
            printfn "🗑️  Deleted node_modules in %s" dir
        else
            printfn "ℹ️  No node_modules found in %s" dir
    }
