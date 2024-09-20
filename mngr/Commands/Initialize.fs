module Commands.Initialize

open System.IO
open Config
open Utils.Commons
open PackageManager
open PackageManager.ProjectKind
open Newtonsoft.Json.Linq
open System.Diagnostics

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

let ensureFantomasInstalled () =
    printfn "🔧 Ensuring Fantomas is installed..."
    let psi = ProcessStartInfo("dotnet", "tool restore")
    psi.RedirectStandardOutput <- true
    psi.RedirectStandardError <- true
    psi.UseShellExecute <- false
    psi.CreateNoWindow <- true

    use p = Process.Start(psi)
    p.WaitForExit()

    if p.ExitCode <> 0 then
        printfn "❌ Failed to restore dotnet tools. Please run 'dotnet tool restore' manually."
    else
        printfn "✅ Fantomas installation check completed successfully."

let initializeApps () =
    ensureFantomasInstalled ()
    let currentDir = Directory.GetCurrentDirectory()
    let repoRoot = findRepoRoot currentDir
    let config = readConfig ()
    let libsDir = Path.Combine(repoRoot, config.LibsDir)
    let appsDir = Path.Combine(repoRoot, config.AppsDir)

    // Install dependencies at the root level first
    printfn "📦 Installing dependencies at the root level"
    NPM.install [ repoRoot ] |> Async.AwaitTask |> Async.RunSynchronously |> ignore
    printfn "✅ Finished installing root dependencies"

    let libsDirsToInitialize =
        [| if Directory.Exists(libsDir) then
               yield! Directory.GetDirectories(libsDir) |> Array.filter shouldInitialize |]

    // Initialize apps and libs
    printfn "📦 Initializing apps and libs"

    NPM.install libsDirsToInitialize
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore

    let appsDirsToInitialize =
        [| if Directory.Exists(appsDir) then
               yield! Directory.GetDirectories(appsDir) |> Array.filter shouldInitialize |]

    // Initialize apps and libs
    printfn "📦 Initializing apps and libs"

    NPM.install appsDirsToInitialize
    |> Async.AwaitTask
    |> Async.RunSynchronously
    |> ignore


    printfn "🚀 Finished initializing all apps and libs"
