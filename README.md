# The Organic

This monorepo contains multiple projects including ayokoding-web, organic-lever-web, and associated libraries.

## Project Structure

- `apps/`
  - `ayokoding-web/`: Ayokoding web application
  - `organic-lever-web/`: Organic Lever web application
  - `organic-lever-web-e2e/`: End-to-end tests for Organic Lever
- `libs/`
  - `hello/`: Shared library

## Getting Started

1. Install dependencies:

   `npm run install:all`

2. Run development servers:
   `npm run dev`

## Available Scripts

### Installation

- `install:all`: Install all dependencies
- `install:ayokoding-web`: Install ayokoding-web dependencies
- `install:organic-lever-web`: Install organic-lever-web dependencies
- `install:organic-lever-web-e2e`: Install e2e test dependencies
- `install:libs`: Install shared library dependencies
- `install:playwright`: Install Playwright for e2e tests

### Development

- `dev`: Run both ayokoding-web and organic-lever-web in development mode
- `dev:ayokoding-web`: Run ayokoding-web in development mode
- `dev:organic-lever-web`: Run organic-lever-web in development mode

### Building

- `build`: Build both web applications
- `build:all`: Build libraries and both web applications
- `build:ayokoding-web`: Build ayokoding-web
- `build:organic-lever-web`: Build organic-lever-web
- `build:libs`: Build shared libraries

### Testing

- `test`: Run tests for both web applications
- `test:unit`: Run unit tests for all projects
- `test:e2e`: Run end-to-end tests
- `test:e2e:ui`: Run e2e tests with UI
- `test:e2e:chrome`, `test:e2e:firefox`, `test:e2e:safari`: Run e2e tests in specific browsers

### Linting and Formatting

- `lint`: Lint both web applications
- `format`: Format all files using Prettier

### Cleaning

- `clean`: Clean build artifacts for both web applications
- `clean:all`: Remove all node_modules directories

### Updating

- `update:all`: Update all dependencies
- `reset:all`: Clean all dependencies and reinstall

## Contributing

Please ensure to run tests and linting before submitting pull requests:

`npm run test`
`npm run lint`
`npm run format`

## License

This project is licensed under the MIT License.
