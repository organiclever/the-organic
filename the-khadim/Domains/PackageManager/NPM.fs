module Domains.PackageManager.NPM

open System.IO
open System.Threading.Tasks
open Config
open Newtonsoft.Json.Linq

/// <summary>
/// Represents the scripts object from the package.json file.
/// </summary>
type PackageJson = { Scripts: Map<string, string> }

/// <summary>
/// Reads the package.json file from the specified path and returns a PackageJson object.
/// </summary>
/// <param name="path">The path to the package.json file.</param>
/// <returns>A PackageJson object containing the scripts map.</returns>
let readPackageJson (path: string) : PackageJson =
    let json = File.ReadAllText(path)
    let packageObj = JObject.Parse(json)

    let scripts =
        packageObj.["scripts"]
        |> Option.ofObj
        |> Option.map (fun s -> s.ToObject<Map<string, string>>())
        |> Option.defaultValue Map.empty

    { Scripts = scripts }

/// <summary>
/// Runs the specified npm script in the given directory.
/// </summary>
/// <param name="dir">The directory where the npm script should be run.</param>
/// <param name="scriptName">The name of the npm script to run.</param>
/// <returns>The exit code of the npm script.</returns>
let runScript (dir: string) (scriptName: string) =
    task {
        printfn "🚀 Running npm script '%s' in %s" scriptName (Path.GetFileName dir)
        let! (_, exitCode, _output, error) = Utils.Terminal.runCommand "npm" ("run " + scriptName) dir

        if exitCode = 0 then
            printfn "✅ Finished running npm script '%s' in %s" scriptName (Path.GetFileName dir)
        else
            printfn "❌ npm script '%s' failed in %s" scriptName (Path.GetFileName dir)
            printfn "Error output:"
            printfn "%s" error

        return exitCode
    }

/// <summary>
/// Runs the specified npm script in multiple directories concurrently.
/// </summary>
/// <param name="dirs">A sequence of directory paths where the script should be run.</param>
/// <param name="scriptName">The name of the npm script to run in each directory.</param>
/// <returns>A task that completes when all script executions are finished.</returns>
/// <remarks>
/// This function uses parallel processing to run the scripts concurrently.
/// The number of parallel workers is set to one less than the number of processor cores.
/// </remarks>
let runScripts (dirs: string seq) (scriptName: string) =
    let config = read ()
    let maxWorkers = config.MaxParallelism
    printfn "🚀 Using %d parallel workers for running scripts" maxWorkers

    dirs
    |> Seq.map (fun dir -> async { return! runScript dir scriptName |> Async.AwaitTask })
    |> fun tasks -> Async.Parallel(tasks, maxWorkers)
    |> Async.StartAsTask

/// <summary>
/// Installs npm dependencies in the specified directories.
/// </summary>
/// <param name="dirs">The directories where npm install should be performed.</param>
/// <returns>A task that completes when all npm installs are finished.</returns>
let install (dirs: string seq) =
    let config = read ()
    let maxWorkers = config.MaxParallelism
    printfn "🚀 Using %d parallel workers for npm install" maxWorkers

    let installDir (dir: string) =
        task {
            printfn "📦 Starting npm install in %s" (Path.GetFileName dir)
            let! (_, exitCode, _, _) = Utils.Terminal.runCommand "npm" "install" dir

            if exitCode = 0 then
                printfn "✅ Finished npm install in %s" (Path.GetFileName dir)
            else
                printfn "❌ npm install failed in %s" (Path.GetFileName dir)
        }

    dirs |> Seq.map installDir |> (fun tasks -> Task.WhenAll(tasks))

/// <summary>
/// Deletes the node_modules directory in the specified directories.
/// </summary>
/// <param name="dirs">The directories where the node_modules directory should be deleted.</param>
/// <returns>A task that completes when all node_modules deletions are finished.</returns>
let deleteNodeModules (dirs: string seq) =
    let config = read ()
    let maxWorkers = config.MaxParallelism
    printfn "🚀 Using %d parallel workers for deleting node_modules" maxWorkers

    let deleteNodeModulesDir (dir: string) =
        task {
            let nodeModulesPath = Path.Combine(dir, "node_modules")

            if Directory.Exists(nodeModulesPath) then
                printfn "🗑️  Starting deletion of node_modules in %s" (Path.GetFileName dir)

                try
                    Directory.Delete(nodeModulesPath, true)
                    printfn "✅ Finished deleting node_modules in %s" (Path.GetFileName dir)
                with ex ->
                    printfn "❌ Failed to delete node_modules in %s: %s" (Path.GetFileName dir) ex.Message
            else
                printfn "ℹ️  No node_modules found in %s" (Path.GetFileName dir)
        }

    dirs |> Seq.map deleteNodeModulesDir |> (fun tasks -> Task.WhenAll(tasks))
