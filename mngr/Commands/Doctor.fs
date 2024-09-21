module Commands.Doctor

open System.Diagnostics
open System.Runtime.InteropServices

let checkCommand (command: string) =
    let isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows)
    let processInfo = ProcessStartInfo()

    processInfo.FileName <- if isWindows then "where" else "which"
    processInfo.Arguments <- command
    processInfo.RedirectStandardOutput <- true
    processInfo.UseShellExecute <- false
    processInfo.CreateNoWindow <- true

    use proc = Process.Start(processInfo)
    let _output = proc.StandardOutput.ReadToEnd()
    proc.WaitForExit()

    proc.ExitCode = 0

let checkFantomas () =
    let processInfo = ProcessStartInfo()
    processInfo.FileName <- "dotnet"
    processInfo.Arguments <- "tool list -g"
    processInfo.RedirectStandardOutput <- true
    processInfo.RedirectStandardError <- true
    processInfo.UseShellExecute <- false
    processInfo.CreateNoWindow <- true

    use proc = Process.Start(processInfo)
    let output = proc.StandardOutput.ReadToEnd()
    let error = proc.StandardError.ReadToEnd()
    proc.WaitForExit()

    if proc.ExitCode = 0 then
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

let runDoctor () =
    let tools =
        [ ("dotnet", ".NET SDK")
          ("volta", "Volta")
          ("npm", "NPM")
          ("node", "Node")
          ("cargo", "Cargo") ]

    printfn "🩺 Running doctor checks..."

    for (command, name) in tools do
        if checkCommand command then
            printfn "✅ %s is installed" name
        else
            printfn "❌ %s is not installed" name

    // Check Fantomas separately
    if not (checkFantomas ()) then
        printfn "   To install Fantomas, run: dotnet tool install -g fantomas"

    printfn "🏁 Doctor checks completed"
