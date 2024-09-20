open CommandLine
open Types
open Commands

[<EntryPoint>]
let main argv =
    printfn "🚀 mngr - The Organic Monorepo Manager"

    let result = Parser.Default.ParseArguments<Options>(argv)

    match result with
    | :? Parsed<Options> as parsed ->
        let opts = parsed.Value

        if opts.Init then
            printfn "🏗️  Initializing apps..."
            initializeApps ()
            0
        elif opts.Reset then
            printfn "🔄 Resetting apps..."
            resetApps ()
            0
        else
            printfn "No action specified. Use --help to see available options."
            0
    | :? NotParsed<Options> as notParsed ->
        printfn "Error: %A" (notParsed.Errors |> Seq.map (fun e -> e.Tag.ToString()))
        1
    | _ -> 1
