module Domains.CLI.Menu

open CommandLine

type Options =
    { [<Option('i', "init", Required = false, HelpText = "Initialize all apps in the monorepo")>]
      Init: bool
      [<Option("reset", Required = false, HelpText = "Delete all node_modules and reinitialize apps")>]
      Reset: bool
      [<Option('c', "clean", Required = false, HelpText = "Delete all node_modules in apps and libs")>]
      Clean: bool
      [<Option('d', "doctor", Required = false, HelpText = "Check if required tools are installed")>]
      Doctor: bool
      [<Option('v', "version", Required = false, HelpText = "Display the version information.")>]
      Version: bool
      [<Option('r', "run", Required = false, HelpText = "Script to run")>]
      Run: string
      [<Option('p', "project", Required = false, HelpText = "Project to run the script for")>]
      Project: string
      [<Option("run-all", Required = false, HelpText = "Run the specified script for all applicable projects")>]
      RunAll: string }
