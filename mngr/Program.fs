﻿module Program

open CommandLine
open Domains
open System.Reflection

let getVersion () =
    let assembly = Assembly.GetExecutingAssembly()
    let version = assembly.GetName().Version
    let attribute = assembly.GetCustomAttribute<AssemblyInformationalVersionAttribute>()

    let gitHash =
        if attribute <> null then
            attribute.InformationalVersion
        else
            null

    match gitHash with
    | null -> sprintf "mngr %d.%d.%d" version.Major version.Minor version.Build
    | _ ->
        let hashParts = gitHash.Split('+')

        if hashParts.Length > 1 then
            sprintf "mngr %d.%d.%d+%s" version.Major version.Minor version.Build hashParts.[1]
        else
            sprintf "mngr %d.%d.%d" version.Major version.Minor version.Build

[<EntryPoint>]
let main argv =
    printfn "🚀 mngr - The Organic Monorepo Manager"

    let result = Parser.Default.ParseArguments<CLI.Menu.Options>(argv)

    match result with
    | :? Parsed<CLI.Menu.Options> as parsed ->
        let opts = parsed.Value

        if opts.Version then
            printfn "%s" (getVersion ())
            0
        elif opts.Reset then
            printfn "🔄 Resetting apps..."
            CLI.Commands.Reset.resetApps ()
            0
        elif opts.Clean then
            printfn "🧹 Cleaning node_modules..."
            CLI.Commands.Clean.cleanApps ()
            0
        elif opts.Init then
            printfn "🏗️ Initializing apps..."
            CLI.Commands.Initialize.initializeApps ()
            0
        elif opts.Doctor then
            CLI.Commands.Doctor.runDoctor (Config.read().Tools)
            0
        else
            CLI.Commands.Help.printHelp ()
            0
    | :? NotParsed<CLI.Menu.Options> as notParsed ->
        match notParsed.Errors |> Seq.tryHead with
        | Some error when error.Tag = ErrorType.VersionRequestedError ->
            printfn "%s" (getVersion ())
            0
        | _ ->
            printfn "Error: %A" (notParsed.Errors |> Seq.map (fun e -> e.Tag.ToString()))
            1
    | _ ->
        printfn "Unexpected error occurred"
        1
