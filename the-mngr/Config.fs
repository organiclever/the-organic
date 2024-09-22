module Config

open System
open System.IO
open Newtonsoft.Json
open Utils

type Config =
    { MaxParallelism: int
      LibsDir: string
      AppsDir: string
      Tools: Tooling.Tool list }

/// <summary>
/// Reads the configuration from the config.json file or returns a default configuration if the file doesn't exist or is invalid.
/// </summary>
/// <returns>A Config object containing the application configuration.</returns>
let read () =
    let configPath = Path.Combine(Directory.GetCurrentDirectory(), "config.json")

    /// <summary>
    /// Default configuration used when the config file is missing or invalid.
    /// </summary>
    let defaultConfig =
        { MaxParallelism = Math.Max(1, Environment.ProcessorCount - 1)
          LibsDir = "libs"
          AppsDir = "apps"
          Tools = Tooling.tools }

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
                        config.AppsDir
                Tools = Tooling.tools }
        with _ ->
            // If any exception occurs during reading or parsing, return the default config
            defaultConfig
    else
        // If the config file doesn't exist, return the default config
        defaultConfig
