# Repo Manager 🛠️

Repo Manager is a command-line tool for managing repositories and dependencies within The Organic Monorepo.

## Features

- Initialize project: Set up package.json and install dependencies 🚀
- Run doctor checks: Verify installation of volta, npm, and node 🩺
- Reset project: Clean and reinitialize the project 🔄
- Add dependencies: Easily add new packages to your project 📦

## Installation

1. Ensure you have Rust and Cargo installed on your system.
2. Navigate to the `mngr-rs` directory:
   `cd mngr-rs`
3. Build the project:
   `cargo build --release`
4. The binary will be available in `target/release/mngr-rs`

## Usage

`mngr-rs [OPTIONS]`

Options:
`--init` Initialize package.json, run npm install, and install project dependencies
`--doctor` Check if volta, npm, and node are installed
`--reset` Reset the project: delete package.json and node_modules, then reinitialize
`--deps` Add dependencies to root package.json and package-tmpl.json
`--deps-dev` Add dev dependencies to root package.json and package-tmpl.json
`--help` Print help information
`--version` Print version information

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

## Project Structure

The project uses the following directory structure:

- `apps`: Contains all application projects
- `libs`: Contains all library projects

These directory names are configurable in the `config.rs` file.

## Configuration

Key file names and directory structures are defined as constants in `src/config.rs`:

- `PACKAGE_JSON`: Name of the main package configuration file (default: "package.json")
- `PACKAGE_TMPL_JSON`: Name of the template package configuration file (default: "package-tmpl.json")
- `APPS_DIR`: Name of the directory containing application projects (default: "apps")
- `LIBS_DIR`: Name of the directory containing library projects (default: "libs")

## Development

To run the project in development mode:

`cargo run -- [OPTIONS]`

For example:
`cargo run -- --doctor`

## Testing

To run the tests:

`cargo test`

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License. See the LICENSE file in the root directory for details.
