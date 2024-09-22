module Domains.PackageManager.Project

open System.IO
open Newtonsoft.Json.Linq

type ProjectKind =
    | NPM
    | Unknown

/// <summary>
/// Determines the kind of project based on the package.json file in the specified directory.
/// </summary>
/// <param name="dir">The directory containing the package.json file.</param>
/// <returns>A tuple containing the project kind and any error message.</returns>
let getKind (dir: string) : ProjectKind * string =
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
