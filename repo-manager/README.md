# Repo Manager 🛠️

Repo Manager is a command-line tool for managing repositories and dependencies within The Organic Monorepo.

## Features

- Initialize project: Set up package.json and install dependencies 🚀
- Run doctor checks: Verify installation of volta, npm, and node 🩺
- Reset project: Clean and reinitialize the project 🔄
- Add dependencies: Easily add new packages to your project 📦

## Installation

1. Ensure you have Rust and Cargo installed on your system.
2. Navigate to the `repo-manager` directory:
   `cd repo-manager`
3. Build the project:
   `cargo build --release`
4. The binary will be available in `target/release/repo-manager`

## Usage

`repo-manager [OPTIONS]`

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
   `repo-manager --init`

2. Run doctor checks:
   `repo-manager --doctor`

3. Reset the project:
   `repo-manager --reset`

4. Add a dependency:
   `repo-manager --deps lodash`

5. Add a dev dependency:
   `repo-manager --deps-dev jest`

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
