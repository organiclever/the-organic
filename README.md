# The Organic Monorepo

This monorepo contains multiple projects including ayokoding-web, organic-lever-web, and associated libraries.

## Project Structure

- `apps/`
  - `ayokoding-web/`: Ayokoding web application
  - `organic-lever-web/`: Organic Lever web application
  - `organic-lever-web-e2e/`: End-to-end tests for Organic Lever
- `libs/`
  - `hello/`: Shared library
- `repo-manager/`: Rust-based repository management tool

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

The `repo-manager` tool provides several commands to manage the monorepo:

- `cargo run -- --doctor`: Check if required tools are installed
- `cargo run -- --init`: Initialize the project and install dependencies
- `cargo run -- --reset`: Reset the project (delete node_modules, recreate package.json, reinstall dependencies)

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
