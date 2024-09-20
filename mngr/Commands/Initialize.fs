module Commands.Initialize

open System.IO
open System.Threading.Tasks
open Config
open Utils.Commons
open PackageManager
open PackageManager.ProjectKind
open Newtonsoft.Json.Linq
open Types

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
    NPM.install repoRoot |> Async.AwaitTask |> Async.RunSynchronously |> ignore
    printfn "✅ Finished installing root dependencies"

    let processDirectory (dirType: string) (dir: string) =
        printfn $"📂 Found {dirType} directory: %s{dir}"
        let subDirs = Directory.GetDirectories(dir)

        subDirs
        |> Array.iter (fun subDir ->
            match shouldInitialize subDir with
            | true -> printfn $"▶️ Processing {dirType}: %s{Path.GetFileName(subDir)}"
            | false -> printfn $"⏭️ Skipping {dirType}: %s{Path.GetFileName(subDir)}")

        subDirs
        |> Array.filter shouldInitialize
        |> Array.map (fun subDir ->
            task {
                let! result = NPM.install subDir
                printfn $"✅ Finished {dirType}: %s{Path.GetFileName(subDir)}"
                return (subDir, result)
            })
        |> Task.WhenAll
        |> Async.AwaitTask
        |> Async.RunSynchronously
        |> ignore

    if Directory.Exists(libsDir) then
        processDirectory "lib" libsDir

    if Directory.Exists(appsDir) then
        processDirectory "app" appsDir

    printfn "🚀 Finished initializing all apps"
