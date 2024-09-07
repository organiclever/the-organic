# The Organic

[![Build and Unit Tests](https://github.com/organiclever/the-organic/actions/workflows/build-and-unit-tests.yml/badge.svg)](https://github.com/organiclever/the-organic/actions/workflows/build-and-unit-tests.yml)
[![E2E Tests](https://github.com/organiclever/the-organic/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/organiclever/the-organic/actions/workflows/e2e-tests.yml)

This project contains multiple applications, including AyoKoding and E2E tests.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository
2. Install dependencies: `npm run install:all`
3. Start the AyoKoding development server: `npm run dev:ayokoding`
4. Open [http://localhost:3300](http://localhost:3300) with your browser to see the result.

## Available Scripts

### AyoKoding Scripts

- Start development server: `npm run dev:ayokoding`
- Build the application: `npm run build:ayokoding`
- Start the production server: `npm run start:ayokoding`
- Lint the code: `npm run lint:ayokoding`
- Run tests: `npm run test:ayokoding`
- Run tests in watch mode: `npm run test:ayokoding:watch`
- Clean build artifacts: `npm run clean:ayokoding`

### E2E Testing Scripts

- Run all E2E tests: `npm run test:e2e`
- Run E2E tests with UI: `npm run test:e2e:ui`
- Run E2E tests on Chrome: `npm run test:e2e:chrome`
- Run E2E tests on Firefox: `npm run test:e2e:firefox`
- Run E2E tests on Safari: `npm run test:e2e:safari`

### General Scripts

- Install all dependencies: `npm run install:all`
- Update all dependencies: `npm run update:all`
- Clean all node_modules: `npm run clean:all`
- Format code: `npm run format`
- Reset project (clean and reinstall): `npm run reset:all`
- Run all unit tests: `npm run test:unit`

## Project Structure

- `apps/ayokoding`: Main Next.js application
- `apps/e2e-web`: End-to-end tests using Playwright

## Testing

This project uses Jest for unit testing and Playwright for E2E testing.

To run all unit tests:
