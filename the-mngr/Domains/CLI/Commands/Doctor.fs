module Domains.CLI.Commands.Doctor


/// <summary>
/// Runs doctor checks to verify the installation status of required tools.
/// </summary>
/// <param name="tools">A list of tools to check for installation.</param>
/// <remarks>
/// This function performs the following steps:
/// 1. Prints a message indicating that doctor checks are starting.
/// 2. Iterates through the list of tools, checking each one for installation.
/// 3. Prints a success message for each installed tool.
/// 4. Prints a failure message for each tool that is not installed.
/// 5. Prints a completion message when all checks are finished.
/// </remarks>
let runDoctor (tools: Utils.Tooling.Tool list) =
    printfn "🩺 Running doctor checks..."

    for tool in tools do
        if tool.Check() then
            printfn "✅ %s is installed" tool.Name
        else
            printfn "❌ %s is not installed" tool.Name

    printfn "🏁 Doctor checks completed"
