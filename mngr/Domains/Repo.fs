module Domains.Repo

open System

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
