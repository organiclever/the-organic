module Domains.CLI.Commands.Reset


/// <summary>
/// Resets all apps and libraries in the monorepo by cleaning and reinitializing them.
/// </summary>
/// <remarks>
/// This function performs the following steps:
/// 1. Cleans all node_modules directories using the Clean.cleanApps() function.
/// 2. Reinitializes all apps and libraries using the Initialize.initializeApps() function.
/// </remarks>
let resetApps () =
    // Reset root dependencies
    printfn "🔄 Resetting root dependencies"

    Clean.cleanApps ()
    Initialize.initializeApps ()

    printfn "🚀 Finished resetting all apps and libs"
