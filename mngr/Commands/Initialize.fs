module Commands.Initialize

open System.IO
open System.Threading.Tasks
open Config
open Utils.Commons
open PackageManager
open PackageManager.ProjectKind
open Newtonsoft.Json.Linq

let getProjectKind (dir: string) : ProjectKind * string =
    let packageJsonPath = Path.Combine(dir, "package.json")

    if File.Exists(packageJsonPath) then
        let jsonContent = File.ReadAllText(packageJsonPath)
        let json = JObject.Parse(jsonContent)

        match json.SelectToken("project.kind") with
        | null -> Unknown, "null"
        | token ->
            let value = token.Value<string>()

            match value.ToLower() with
            | "npm" -> NPM, value
            | _ -> Unknown, value
    else
        Unknown, "package.json not found"

let shouldInitialize (dir: string) =
    match getProjectKind dir with
    | NPM, _ -> true
    | Unknown, value ->
        printfn "⚠️  Unknown project type in directory: %s" dir
        printfn "   project.kind value: %s" value
        false

let initializeApps () =
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let config = readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Install dependencies at the root level first
    printfn "📦 Installing dependencies at the root level"
    NPM.install [ repoRoot ] |> Async.AwaitTask |> Async.RunSynchronously |> ignore
    printfn "✅ Finished installing root dependencies"

    let dirsToInitialize =
        [| if Directory.Exists(libsDir) then
               yield! Directory.GetDirectories(libsDir) |> Array.filter shouldInitialize
           if Directory.Exists(appsDir) then
               yield! Directory.GetDirectories(appsDir) |> Array.filter shouldInitialize |]

    // Initialize apps and libs
    printfn "📦 Initializing apps and libs"

    NPM.install dirsToInitialize
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    printfn "🚀 Finished initializing all apps and libs"
