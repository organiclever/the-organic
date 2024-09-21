module Tools

open System.Diagnostics
open System.Runtime.InteropServices

type Tool =
    { Command: string
      Name: string
      Check: unit -> bool }

let checkCommand (command: string) =
    let isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
    let processInfo = ProcessStartInfo()

    processInfo.FileName <- if isWindows then "where" else "which"
    processInfo.Arguments <- command
    processInfo.RedirectStandardOutput <- true
    processInfo.UseShellExecute <- false
    processInfo.CreateNoWindow <- true

    use proc = Process.Start(processInfo)
    let _output = proc.StandardOutput.ReadToEnd()
    proc.WaitForExit()

    proc.ExitCode = 0

let checkFantomas () =
    let processInfo = ProcessStartInfo()
    processInfo.FileName <- "dotnet"
    processInfo.Arguments <- "tool list -g"
    processInfo.RedirectStandardOutput <- true
    processInfo.RedirectStandardError <- true
    processInfo.UseShellExecute <- false
    processInfo.CreateNoWindow <- true

    use proc = Process.Start(processInfo)
    let output = proc.StandardOutput.ReadToEnd()
    let error = proc.StandardError.ReadToEnd()
    proc.WaitForExit()

    if proc.ExitCode = 0 then
        if output.Contains("fantomas") then
            printfn "✅ Fantomas is installed"
            true
        else
            printfn "❌ Fantomas is not found in the global .NET tools list"
            printfn "Global .NET tools list:"
            printfn "%s" output
            false
    else
        printfn "❌ Failed to check Fantomas installation"
        printfn "Error output:"
        printfn "%s" error
        false

let tools =
    [ { Command = "dotnet"
        Name = ".NET SDK"
        Check = fun () -> checkCommand "dotnet" }
      { Command = "volta"
        Name = "Volta"
        Check = fun () -> checkCommand "volta" }
      { Command = "npm"
        Name = "NPM"
        Check = fun () -> checkCommand "npm" }
      { Command = "node"
        Name = "Node"
        Check = fun () -> checkCommand "node" }
      { Command = "cargo"
        Name = "Cargo"
        Check = fun () -> checkCommand "cargo" }
      { Command = "fantomas"
        Name = "Fantomas"
        Check = checkFantomas } ]
