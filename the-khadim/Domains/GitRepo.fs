module Domains.GitRepo

open System

/// <summary>
/// Finds the root directory of a Git repository.
/// </summary>
/// <param name="startDir">The starting directory to begin the search.</param>
/// <returns>The full path of the Git repository root directory.</returns>
/// <exception cref="System.Exception">Thrown when the repository root is not found.</exception>
let findRoot (startDir: string) =
    let rec findRoot (dir: string) =
        if IO.Directory.Exists(IO.Path.Combine(dir, ".git")) then
            dir
        else
            let parent = IO.Directory.GetParent(dir)

            if parent = null then
                failwith "Repository root not found 😕"
            else
                findRoot parent.FullName

    findRoot startDir

/// <summary>
/// Finds the directory containing the applications in the Git repository.
/// </summary>
/// <returns>The full path of the applications directory.</returns>
let findAppsDir () =
    let config = Config.read ()
    let root = findRoot (IO.Directory.GetCurrentDirectory())
    IO.Path.Combine(root, config.AppsDir)

/// <summary>
/// Finds the directory containing the libraries in the Git repository.
/// </summary>
/// <returns>The full path of the libraries directory.</returns>
let findLibsDir () =
    let config = Config.read ()
    let root = findRoot (IO.Directory.GetCurrentDirectory())
    IO.Path.Combine(root, config.LibsDir)
