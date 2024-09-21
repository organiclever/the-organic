module Domains.CLI.Menu

open CommandLine

type Options =
    { [<Option('i', "init", Required = false, HelpText = "Initialize all apps in the monorepo")>]
      Init: bool
      [<Option('r', "reset", Required = false, HelpText = "Delete all node_modules and reinitialize apps")>]
      Reset: bool
      [<Option('c', "clean", Required = false, HelpText = "Delete all node_modules in apps and libs")>]
      Clean: bool
      [<Option('d', "doctor", Required = false, HelpText = "Check if required tools are installed")>]
      Doctor: bool
      [<Option('v', "version", Required = false, HelpText = "Display the version information.")>]
      Version: bool }
