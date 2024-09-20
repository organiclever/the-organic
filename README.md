# The Organic Monorepo

This monorepo contains multiple projects including ayokoding-web, organic-lever-web, associated libraries, and a new F# project called mngr.

## Project Structure

- `apps/`
  - `ayokoding-web/`: Ayokoding web application
  - `organic-lever-web/`: Organic Lever web application
  - `organic-lever-web-e2e/`: End-to-end tests for Organic Lever
- `libs/`
  - `hello/`: Shared library
- `mngr-rs/`: Rust-based repository management tool
- `mngr/`: F# project for repository management

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

The `mngr-rs` tool provides several commands to manage the monorepo. Additionally, the new F# project `mngr` has been added for future management tasks.

## F# Project: mngr

To run the F# project:

1. Navigate to the mngr directory:
   `cd mngr`

2. Build the project:
   `dotnet build`

3. Run the project:
   `dotnet run`

For more details about the `mngr` project, see its [README](./mngr/README.md).

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

`mngr-rs [OPTIONS]`

Options:
--init Initialize package.json, run npm install, and install project dependencies
--doctor Check if volta, npm, and node are installed
--reset Reset the project: delete package.json and node_modules, then reinitialize
--deps Add dependencies to root package.json and package-tmpl.json
--deps-dev Add dev dependencies to root package.json and package-tmpl.json
--help Print help information
--version Print version information

## Examples

1. Initialize the project:
   `mngr-rs --init`

2. Run doctor checks:
   `mngr-rs --doctor`

3. Reset the project:
   `mngr-rs --reset`

4. Add a dependency:
   `mngr-rs --deps lodash`

5. Add a dev dependency:
   `mngr-rs --deps-dev jest`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
