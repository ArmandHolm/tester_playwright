# Skill: UI Testing & Page Object Model (POM)

## Objective
Build scalable, resilient End-to-End (E2E) web UI tests for the Restful Booker Platform (`https://automationintesting.online/`).

## Architecture Rules
* **Page Objects (`src/pages/`):** All UI interaction logic must live here. Create a `BasePage.ts` that initializes the Playwright `Page` object, and have all other pages (e.g., `HomePage.ts`) extend it.
* **Locators:** Encapsulate all locators as private or protected properties within the Page classes.
* **Custom Fixtures (`src/fixtures/`):** Extend Playwright's base test object to automatically instantiate Page Objects.

## Coding Standards
* **Auto-Retrying Assertions:** Always use Playwright's `await expect(locator).toBeVisible()` style assertions. Never use `page.waitForTimeout()`.
* **Actionability:** Rely on Playwright's native auto-waiting for elements to be actionable before clicking or filling.
* **Data Seeding:** Use API clients to verify backend state or setup data, keeping UI tests strictly focused on front-end user journeys.