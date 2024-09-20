# The Organic Monorepo

This monorepo contains multiple projects including ayokoding-web, organic-lever-web, and associated libraries.

## Project Structure

- `apps/`
  - `ayokoding-web/`: Ayokoding web application
  - `organic-lever-web/`: Organic Lever web application
  - `organic-lever-web-e2e/`: End-to-end tests for Organic Lever
- `libs/`
  - `hello/`: Shared library
- `mngr-rs/`: Rust-based repository management tool

## Getting Started

1. Ensure you have [Volta](https://volta.sh/), [Node.js](https://nodejs.org/), and [npm](https://www.npmjs.com/) installed.

2. Clone the repository:
   `git clone https://github.com/your-username/the-organic.git`

3. Navigate to the project root:
   `cd the-organic`

4. Run the initialization script:
   `./init.sh`

   This script will check if required tools are installed, initialize the project, and install dependencies for all sub-projects.

## Repository Management

The `mngr-rs` tool provides several commands to manage the monorepo:

- `cargo run -- --doctor`: Check if required tools are installed
- `cargo run -- --init`: Initialize the project and install dependencies
- `cargo run -- --reset`: Reset the project (delete node_modules, recreate package.json, reinstall dependencies)
- `cargo run -- --deps <package-name>`: Add dependencies to root package.json and package-tmpl.json
- `cargo run -- --deps-dev <package-name>`: Add dev dependencies to root package.json and package-tmpl.json

## Available Scripts

Check the `scripts` section in the root `package.json` file for a full list of available commands. Some key scripts include:

- `npm run ayokoding-web:dev`: Start the AyoKoding web development server
- `npm run organic-lever-web:dev`: Start the Organic Lever web development server
- `npm run organic-lever-web-e2e:test`: Run end-to-end tests for Organic Lever web
- `npm run libs:build`: Build the shared libraries

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
