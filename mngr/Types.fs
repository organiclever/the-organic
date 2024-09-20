module Types

open CommandLine

type ProjectKind =
    | NPM
    | Unknown

type Options =
    { [<Option('i', "init", Required = false, HelpText = "Initialize all apps in the monorepo")>]
      Init: bool
      [<Option('r', "reset", Required = false, HelpText = "Delete all node_modules and reinitialize apps")>]
      Reset: bool
      [<Option('c', "clean", Required = false, HelpText = "Delete all node_modules in apps and libs")>]
      Clean: bool }
