module Utils.Terminal

open System
open System.Diagnostics

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

let runCommandAndStream (command: string) (args: string list) (workingDirectory: string option) : int =
    let psi = ProcessStartInfo()
    psi.FileName <- command
    psi.Arguments <- String.Join(" ", args)
    psi.UseShellExecute <- false
    psi.RedirectStandardOutput <- true
    psi.RedirectStandardError <- true

    workingDirectory |> Option.iter (fun dir -> psi.WorkingDirectory <- dir)

    use proc = new Process()
    proc.StartInfo <- psi

    proc.OutputDataReceived.Add(fun e ->
        if not (isNull e.Data) then
            printfn "%s" e.Data)

    proc.ErrorDataReceived.Add(fun e ->
        if not (isNull e.Data) then
            eprintfn "%s" e.Data)

    proc.Start() |> ignore
    proc.BeginOutputReadLine()
    proc.BeginErrorReadLine()

    proc.WaitForExit()
    proc.ExitCode

let checkCommand (command: string) =
    let isWindows = Environment.OSVersion.Platform = PlatformID.Win32NT
    let checkCommand = if isWindows then "where" else "which"

    let (_, exitCode, _, _) =
        runCommand checkCommand command (Environment.CurrentDirectory)
        |> Async.AwaitTask
        |> Async.RunSynchronously

    exitCode = 0
