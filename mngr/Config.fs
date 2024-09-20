module Config

open System
open System.IO
open Newtonsoft.Json

type Config =
    { MaxParallelism: int
      LibsDir: string
      AppsDir: string }

let readConfig () =
    let configPath = Path.Combine(Directory.GetCurrentDirectory(), "config.json")

    let defaultConfig =
        { MaxParallelism = Math.Max(1, Environment.ProcessorCount - 1)
          LibsDir = "libs"
          AppsDir = "apps" }

    if File.Exists(configPath) then
        try
            let jsonString = File.ReadAllText(configPath)
            let config = JsonConvert.DeserializeObject<Config>(jsonString)

            { config with
                MaxParallelism =
                    if config.MaxParallelism > 0 then
                        config.MaxParallelism
                    else
                        defaultConfig.MaxParallelism
                LibsDir =
                    if String.IsNullOrWhiteSpace(config.LibsDir) then
                        defaultConfig.LibsDir
                    else
                        config.LibsDir
                AppsDir =
                    if String.IsNullOrWhiteSpace(config.AppsDir) then
                        defaultConfig.AppsDir
                    else
                        config.AppsDir }
        with _ ->
            defaultConfig
    else
        defaultConfig
