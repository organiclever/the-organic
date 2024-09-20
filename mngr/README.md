# mngr

A CLI tool for managing the monorepo, written in F#.

## Prerequisites

- .NET SDK 8.0 or later
- Node.js and npm

## Building the Project

To build the project, run the following command in the `mngr` directory:

'''
dotnet build
'''

## Running the Project

To see all available commands, use:

'''
dotnet run -- --help
'''

or

'''
dotnet run -- -h
'''

To initialize all apps in the monorepo, use:

'''
dotnet run -- --init
'''

This will run `npm install` in parallel for each subdirectory in the `./apps` folder.

To reset all apps (delete node_modules and reinstall dependencies), use:

'''
dotnet run -- --reset
'''

This will delete all `node_modules` directories in the projects under the `apps` folder and then run `npm install` for each project.

## Development

The main program logic is located in `Program.fs`. To make changes to the project, edit this file and rebuild the project.

## Adding Dependencies

To add new dependencies to the project, modify the `mngr.fsproj` file and run `dotnet restore`.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file in the root directory for details.
