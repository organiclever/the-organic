module Commands.Help

let printHelp () =
    printfn "Usage: mngr [command] [options]"
    printfn ""
    printfn "Commands:"
    printfn "  --init         Initialize all apps in the monorepo"
    printfn "  --reset        Delete all node_modules and reinitialize apps"
    printfn "  --help, -h     Show this help message"
    printfn ""
    printfn "Options:"
    printfn "  None currently available"
