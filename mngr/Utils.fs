odule Utils

open System.IO

let findRepoRoot (startDir: string) =
    let rec findRoot (dir: string) =
        if Directory.Exists(Path.Combine(dir, ".git")) then
            dir
        else
            let parent = Directory.GetParent(dir)

            if parent = null then
                failwith "Repository root not found 😕"
            else
                findRoot parent.FullName

    findRoot startDir

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