module Commands.Help

let printHelp () =
    printfn "Usage: mngr [command] [options]"
    printfn ""
    printfn "Commands:"
    printfn "  --init, -i     Initialize all apps in the monorepo"
    printfn "  --reset, -r    Delete all node_modules and reinitialize apps"
    printfn "  --clean, -c    Delete all node_modules in apps and libs"
    printfn "  --help, -h     Show this help message"
    printfn ""
    printfn "Options:"
    printfn "  None currently available"
