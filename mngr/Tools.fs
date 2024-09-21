module Tools

open System.Runtime.InteropServices
open Utils.Commons

type Tool =
    { Command: string
      Name: string
      Check: unit -> bool }

let checkCommand (command: string) =
    let isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
    let checkCommand = if isWindows then "where" else "which"

    let (_, exitCode, _, _) =
        runCommand checkCommand command (System.Environment.CurrentDirectory)
        |> Async.AwaitTask
        |> Async.RunSynchronously

    exitCode = 0

let checkFantomas () =
    let (_, exitCode, output, error) =
        runCommand "dotnet" "tool list -g" (System.Environment.CurrentDirectory)
        |> Async.AwaitTask
        |> Async.RunSynchronously

    if exitCode = 0 then
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
