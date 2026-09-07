# Skill: Accessibility (a11y) & Performance Testing

## Objective
Implement non-functional testing layers for accessibility (WCAG) and frontend performance baselines.

## Accessibility (A11y)
- Tooling: use `@axe-core/playwright` to run automated checks in UI smoke tests.
- Location: `src/tests/accessibility/` or include as smoke checks in `src/tests/ui/`.
- Execution: inject Axe into the page under test and assert impact levels; fail on `critical` or `serious` violations unless an accepted exception exists and is documented.

Example:
```ts
const results = await new AxeBuilder({ page }).analyze();
expect(results.violations.filter(v => v.impact === 'critical' || v.impact === 'serious').length).toBe(0);
```

## Performance
- Tooling: Playwright `page.evaluate()` + browser performance APIs. For advanced profiling, integrate Lighthouse or browser performance logs.
- Location: `src/tests/performance/`.
- Metrics to capture: TTFB, DOMContentLoaded, First Contentful Paint (FCP), Total Load Time.
- Thresholds: document acceptable thresholds in test metadata or config (example: `loadEventEnd - navigationStart < 2000ms`).

## Running locally
- Run performance and a11y checks as part of smoke: `npx playwright test src/tests/ui/ --grep @a11y` or run dedicated suites.
