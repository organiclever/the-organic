module Domains.Tooling

open Domains

type Tool =
    { Command: string
      Name: string
      Check: unit -> bool }


let checkFantomas () =
    let (_, exitCode, output, error) =
        Terminal.runCommand "dotnet" "tool list -g" (System.Environment.CurrentDirectory)
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
        Check = fun () -> Terminal.checkCommand "dotnet" }
      { Command = "volta"
        Name = "Volta"
        Check = fun () -> Terminal.checkCommand "volta" }
      { Command = "npm"
        Name = "NPM"
        Check = fun () -> Terminal.checkCommand "npm" }
      { Command = "node"
        Name = "Node"
        Check = fun () -> Terminal.checkCommand "node" }
      { Command = "cargo"
        Name = "Cargo"
        Check = fun () -> Terminal.checkCommand "cargo" }
      { Command = "fantomas"
        Name = "Fantomas"
        Check = checkFantomas } ]
