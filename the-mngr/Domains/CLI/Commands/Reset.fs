module Domains.CLI.Commands.Reset


let resetApps () =
    // Reset root dependencies
    printfn "🔄 Resetting root dependencies"

    Clean.cleanApps ()
    Initialize.initializeApps ()

    printfn "🚀 Finished resetting all apps and libs"
