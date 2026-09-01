# Skill: Accessibility (a11y) & Performance Testing

## Objective
Implement non-functional testing layers to validate web accessibility compliance and baseline frontend performance for the Conduit application.

## Accessibility Rules (A11y)
* **Tooling:** Utilize `@axe-core/playwright`.
* **File Location:** Store tests in `src/tests/accessibility/`.
* **Execution:** Inject Axe into the page under test and run analysis against WCAG guidelines.
* **Assertions:** Tests must assert that there are `0` violations for `critical` and `serious` impact levels. Allow filtering of known minor violations if necessary.

## Performance Rules (Frontend Profiling)
* **Tooling:** Use Playwright's native capabilities to evaluate browser performance APIs.
* **File Location:** Store tests in `src/tests/performance/`.
* **Execution:** Use `page.evaluate()` to access `window.performance.timing` or `PerformanceNavigationTiming`.
* **Assertions:** Capture and assert baseline metrics such as:
  * Time to First Byte (TTFB)
  * DomContentLoaded Event End
  * Total Page Load Time (e.g., `loadEventEnd - navigationStart < 2000ms`).