module Domains.PackageManager.ProjectKind

open System.IO
open Newtonsoft.Json.Linq

type ProjectKind =
    | NPM
    | Unknown

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
