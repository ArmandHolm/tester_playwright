# Skill: UI Testing & Page Object Model (POM)

## Objective
Build scalable, resilient End-to-End (E2E) web UI tests for the Conduit application (`https://demo.realworld.io`).

## Architecture Rules
* **Page Objects (`src/pages/`):** All UI interaction logic must live here. Create a `BasePage.ts` that initializes the Playwright `Page` object, and have all other pages (e.g., `HomePage.ts`, `LoginPage.ts`) extend it.
* **Locators:** Encapsulate all locators as private or protected properties within the Page classes. Never expose raw string selectors in the test files.
* **Custom Fixtures (`src/fixtures/`):** Extend Playwright's base test object to automatically instantiate Page Objects (e.g., `homePage`, `loginPage`) so tests do not contain repetitive initialization code.

## Coding Standards
* **User-Facing Locators:** Strictly prioritize `getByRole`, `getByText`, `getByLabel`, and `getByTestId`. Avoid brittle XPath or CSS selectors.
* **Auto-Retrying Assertions:** Always use Playwright's `await expect(locator).toBeVisible()` style assertions. Never use `page.waitForTimeout()`.
* **Actionability:** Rely on Playwright's native auto-waiting for elements to be actionable before clicking or filling.

## State Management Standard (SDET Level)
* **Bypass UI Login:** For tests that do not specifically test the login flow, do not log in via the UI.
* Use a custom Playwright fixture (e.g., `authenticatedPage`) that calls the `AuthApiClient` (API skill) to get a JWT, injects it into the browser's `localStorage` via `page.addInitScript()`, and yields a pre-authenticated page.