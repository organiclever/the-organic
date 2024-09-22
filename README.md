# The Organic Monorepo

This monorepo contains multiple projects including ayokoding-web, organic-lever-web, associated libraries, and an F# project called khadim.

## Project Structure

- `apps/`
  - `ayokoding-web/`: Ayokoding web application
  - `organic-lever-web/`: Organic Lever web application
  - `organic-lever-web-e2e/`: End-to-end tests for Organic Lever
- `libs/`
  - `hello/`: Shared library
- `the-khadim/`: F# project for repository management

## Getting Started

1. Ensure you have [Volta](https://volta.sh/), [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/), and [.NET SDK](https://dotnet.microsoft.com/download) installed.

2. Clone the repository:
   `git clone https://github.com/your-username/the-organic.git`

3. Navigate to the project root:
   `cd the-organic`

4. Run the initialization script:
   `./init.sh`

   This script will build and run the F# project, along with other initialization tasks.

## Repository Management

The `khadim` tool provides several commands to manage the monorepo. For more details, see the [khadim README](./the-khadim/README.md).

## F# Project: khadim

To run the F# project:

1. Navigate to the the-khadim directory:
   `cd the-khadim`

2. Build the project:
   `dotnet build`

3. Run the project:
   `dotnet run`

For more details about the `khadim` project, see its [README](./the-khadim/README.md).

## Available Scripts

Check the `scripts` section in the root `package.json` file for a full list of available commands.

## Contributing

Please ensure to run tests and linting before submitting pull requests. See the Contributing Guide for more details.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

# Repo Manager 🛠️

Repo Manager is a command-line tool for managing repositories and dependencies.

## Features

- Initialize project: Set up package.json and install dependencies 🚀
- Run doctor checks: Verify installation of volta, npm, and node 🩺
- Reset project: Clean and reinitialize the project 🔄
- Add dependencies: Easily add new packages to your project 📦

## Usage

`khadim [OPTIONS]`

Options:
`--init` Initialize package.json, run npm install, and install project dependencies
`--doctor` Check if volta, npm, and node are installed
`--reset` Reset the project: delete package.json and node_modules, then reinitialize
`--clean` Remove node_modules and package-lock.json files
`--help` Print help information
`--version` Print version information

## Examples

1. Initialize the project:
   `khadim --init`

2. Run doctor checks:
   `khadim --doctor`

3. Reset the project:
   `khadim --reset`

4. Clean the project:
   `khadim --clean`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
