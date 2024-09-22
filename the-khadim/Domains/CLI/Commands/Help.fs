module Domains.CLI.Commands.Help

/// <summary>
/// Prints the help message for the khadim command-line interface.
/// </summary>
/// <remarks>
/// This function prints the usage information for the khadim command-line interface,
/// including the available commands and their descriptions.
/// </remarks>
let printHelp () =
    printfn "Usage: khadim [command] [options]"
    printfn ""
    printfn "Commands:"
    printfn "  --init, -i     Initialize all apps in the monorepo"
    printfn "  --reset, -r    Delete all node_modules and reinitialize apps"
    printfn "  --clean, -c    Delete all node_modules in apps and libs"
    printfn "  --doctor, -d   Check if required tools are installed"
    printfn "  --help, -h     Show this help message"
    printfn ""
    printfn "Options:"
    printfn "  None currently available"
