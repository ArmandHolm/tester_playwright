# Skill: UI Testing & Page Object Model (POM)

## Objective
Build scalable, maintainable UI E2E tests following Page Object Model and accessibility best-practices.

## Architecture Rules
- Page Objects (`src/pages/`): encapsulate interaction logic and locators. Create `BasePage.ts` to accept a Playwright `Page` and expose common helpers. Specific pages (e.g., `HomePage.ts`) must extend `BasePage`.
- Fixtures (`src/fixtures/`): provide page and per-test setup via fixtures (e.g., `uiFixtures.ts`). Import `test` from `src/fixtures/uiFixtures.ts` to ensure the correct UI base URL and authenticated state when needed.
- Data setup: prefer API clients for seeding/verification — keep UI tests focused on user flows.

## Locator & Selector Guidelines
- Prefer dedicated attributes: `data-test`, `data-testid`, or `data-qa` for stability.
- Prefer CSS selectors scoped to components; avoid brittle descendant selectors and long XPaths.
- Encapsulate locators within page objects as private/protected.

## Accessibility & WCAG
- Include accessibility checks in UI smoke tests using `@axe-core/playwright`.
- Fail the build on `critical` or `serious` violations unless a documented exception exists.

## Coding Standards
- Use Playwright's auto-waiting assertions (e.g., `await expect(locator).toBeVisible()`), avoid `waitForTimeout()`.
- Keep page object methods focused and return other page objects for flows (fluent transitions).
- No `any` in test or page code — define types for page data and component props used in assertions.

## Example (Page Object snippet)
```ts
// src/pages/BasePage.ts (excerpt)
import { Page, Locator } from '@playwright/test';
export class BasePage {
	readonly page: Page;
	constructor(page: Page) { this.page = page; }
	protected locator(selector: string): Locator { return this.page.locator(selector); }
}
```
