module Domains.Terminal

open System

let runCommand (command: string) (args: string) (dir: string) =
    task {
        let psi = Diagnostics.ProcessStartInfo()
        psi.FileName <- command
        psi.Arguments <- args
        psi.WorkingDirectory <- dir
        psi.RedirectStandardOutput <- true
        psi.RedirectStandardError <- true
        psi.UseShellExecute <- false
        psi.CreateNoWindow <- true

        use p = new Diagnostics.Process()
        p.StartInfo <- psi
        p.Start() |> ignore

        let! output = p.StandardOutput.ReadToEndAsync()
        let! error = p.StandardError.ReadToEndAsync()
        do! p.WaitForExitAsync()

        return (dir, p.ExitCode, output, error)
    }

let checkCommand (command: string) =
    let isWindows = Environment.OSVersion.Platform = PlatformID.Win32NT
    let checkCommand = if isWindows then "where" else "which"

    let (_, exitCode, _, _) =
        runCommand checkCommand command (Environment.CurrentDirectory)
        |> Async.AwaitTask
        |> Async.RunSynchronously

    exitCode = 0
