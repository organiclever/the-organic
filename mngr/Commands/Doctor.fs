module Commands.Doctor

open Tools

let runDoctor (tools: Tool list) =
    printfn "🩺 Running doctor checks..."

    for tool in tools do
        if tool.Check() then
            printfn "✅ %s is installed" tool.Name
        else
            printfn "❌ %s is not installed" tool.Name

    printfn "🏁 Doctor checks completed"
