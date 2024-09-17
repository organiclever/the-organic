# Organic Lever Web E2E Tests

This project contains end-to-end tests for the Organic Lever web application, part of The Organic monorepo. It uses Playwright for browser automation and testing.

## Getting Started

1. Install dependencies:
   `npm run install:organic-lever-web-e2e`

2. Install Playwright browsers:
   `npm run install:playwright`

## Available Scripts

- `test:e2e`: Run all end-to-end tests headlessly
- `test:e2e:ui`: Run end-to-end tests with Playwright's UI mode
- `test:e2e:chrome`: Run tests specifically in Chrome
- `test:e2e:firefox`: Run tests specifically in Firefox
- `test:e2e:safari`: Run tests specifically in Safari
- `test:e2e:ci`: Run tests in CI environment (starts both ayokoding-web and organic-lever-web servers)

## Running Tests

To run all tests headlessly:
`npm run test:e2e`

To run tests with Playwright's UI mode:
`npm run test:e2e:ui`

To run tests in a specific browser:
`npm run test:e2e:chrome`
`npm run test:e2e:firefox`
`npm run test:e2e:safari`

## CI/CD Integration

For continuous integration, use:
`npm run test:e2e:ci`

This command will start both the ayokoding-web and organic-lever-web servers before running the tests.

## Test Structure

Tests are located in the `tests/` directory. Each test file should focus on a specific feature or user flow.

## Debugging Tests

1. Use `test:e2e:ui` to run tests with Playwright's UI mode for easier debugging.
2. Add `await page.pause();` in your test code to pause execution and inspect the browser state.

## Contributing

1. Write meaningful test descriptions using `test()` and `describe()`.
2. Use page object models (located in `pages/` directory) to encapsulate page interactions.
3. Keep tests independent and avoid dependencies between test cases.
4. Run tests locally before submitting pull requests.

For more information on Playwright and E2E testing best practices, refer to the [Playwright documentation](https://playwright.dev/docs/intro).

For overall project guidelines, see the main README in the root of the monorepo.
