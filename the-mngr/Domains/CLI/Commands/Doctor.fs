module Domains.CLI.Commands.Doctor


let runDoctor (tools: Utils.Tooling.Tool list) =
    printfn "🩺 Running doctor checks..."

    for tool in tools do
        if tool.Check() then
            printfn "✅ %s is installed" tool.Name
        else
            printfn "❌ %s is not installed" tool.Name

    printfn "🏁 Doctor checks completed"
