module Mngr.Program

open CommandLine
open Types
open Commands.Initialize
open Commands.Reset
open Commands.Clean
open Commands.Help
open Commands.Doctor
open System.Diagnostics

let ensureFantomasInstalled () =
    let psi = ProcessStartInfo("dotnet", "tool restore")
    psi.RedirectStandardOutput <- true
    psi.RedirectStandardError <- true
    psi.UseShellExecute <- false
    psi.CreateNoWindow <- true

    use p = Process.Start(psi)
    p.WaitForExit()

    if p.ExitCode <> 0 then
        printfn "Failed to restore dotnet tools. Please run 'dotnet tool restore' manually."

// test

[<EntryPoint>]
let main argv =
    printfn "🚀 mngr - The Organic Monorepo Manager"

    ensureFantomasInstalled ()

    let result = Parser.Default.ParseArguments<Options>(argv)

    match result with
    | :? Parsed<Options> as parsed ->
        let opts = parsed.Value

        if opts.Reset then
            printfn "🔄 Resetting apps..."
            resetApps ()
            0
        elif opts.Clean then
            printfn "🧹 Cleaning node_modules..."
            cleanApps ()
            0
        elif opts.Init then
            printfn "🏗️ Initializing apps..."
            initializeApps ()
            0
        elif opts.Doctor then
            runDoctor ()
            0
        else
            printHelp ()
            0
    | :? NotParsed<Options> as notParsed ->
        printfn "Error: %A" (notParsed.Errors |> Seq.map (fun e -> e.Tag.ToString()))
        1
    | _ ->
        printfn "Unexpected error occurred"
        1
