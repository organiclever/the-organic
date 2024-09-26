# Organic Lever Web

This is the Organic Lever web application, part of The Organic monorepo.

## Getting Started

1. Install dependencies:

   `npm run install:organic-lever-web`

2. Run the development server:
   `npm run dev:organic-lever-web`

## Available Scripts

- `dev:organic-lever-web`: Run the development server
- `build:organic-lever-web`: Build the application
- `start:organic-lever-web`: Start the production server
- `lint:organic-lever-web`: Lint the codebase
- `test:organic-lever-web`: Run tests
- `test:organic-lever-web:watch`: Run tests in watch mode
- `clean:organic-lever-web`: Clean build artifacts

## Testing

This project uses Vitest for testing. Here are the available test commands:

- `npm run test`: Run tests once
- `npm run test:watch`: Run tests in watch mode
- `npm run test:ui`: Run tests with UI
- `npm run coverage`: Run tests with coverage

To write tests, create files with the `.test.tsx` or `.test.ts` extension next to the files you want to test.

## Contributing

Please ensure to run tests and linting before submitting pull requests:

`npm run test:organic-lever-web`
`npm run lint:organic-lever-web`

For more information, see the main README in the root of the monorepo.
