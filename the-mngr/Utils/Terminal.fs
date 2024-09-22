module Utils.Terminal

open System

/// <summary>
/// Runs a command asynchronously in a specified directory.
/// </summary>
/// <param name="command">The command to run.</param>
/// <param name="args">The arguments for the command.</param>
/// <param name="dir">The directory in which to run the command.</param>
/// <returns>
/// A task that represents the asynchronous operation. The task result contains a tuple with:
/// - The directory where the command was run
/// - The exit code of the process
/// - The standard output of the process
/// - The standard error output of the process
/// </returns>
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

/// <summary>
/// Runs a command and streams the output to the console.
/// </summary>
/// <param name="command">The command to run.</param>
/// <param name="args">The arguments for the command.</param>
/// <param name="workingDirectory">The directory in which to run the command.</param>
/// <returns>The exit code of the process.</returns>
let runCommandAndStream (command: string) (args: string list) (workingDirectory: string option) : int =
    let psi = Diagnostics.ProcessStartInfo()
    psi.FileName <- command
    psi.Arguments <- String.Join(" ", args)
    psi.UseShellExecute <- false
    psi.RedirectStandardOutput <- true
    psi.RedirectStandardError <- true

    workingDirectory |> Option.iter (fun dir -> psi.WorkingDirectory <- dir)

    use proc = new Diagnostics.Process()
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

/// <summary>
/// Checks if a command is available in the system's PATH.
/// </summary>
/// <param name="command">The command to check.</param>
/// <returns>True if the command is available, false otherwise.</returns>
let checkCommand (command: string) =
    let isWindows = Environment.OSVersion.Platform = PlatformID.Win32NT
    let checkCommand = if isWindows then "where" else "which"

    let (_, exitCode, _, _) =
        runCommand checkCommand command (Environment.CurrentDirectory)
        |> Async.AwaitTask
        |> Async.RunSynchronously

    exitCode = 0
