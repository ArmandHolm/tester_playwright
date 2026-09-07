# tester_playwright
Playwright-based API & UI automation example project intended as a public portfolio to demonstrate Senior SDET practices.

# Quickstart
1. Install dependencies:
**bash** : npm ci

2. (Optional) Create a `.env` file in the repository root with overrides, e.g.:
BASE_URL=https://automationintesting.online
API_BASE_URL=https://automationintesting.online/api
UI_BASE_URL=https://automationintesting.online
RETRY_COUNT=2

3. Run tests:
**bash** : npx playwright test

4. Open the HTML report after a run:
**bash** : npx playwright show-report

Key files & concepts
- `src/config.ts`: central environment and per-type base URL resolution (`baseUrl`, `apiBaseUrl`, `uiBaseUrl`, `perfBaseUrl`).
- `src/fixtures/*`: custom fixtures. Import `test` from `src/fixtures/apiFixtures.ts` or `src/fixtures/uiFixtures.ts` to get proper per-type setup.
- `src/api-clients/*`: typed API clients built on `BaseApiClient.ts`.
- `src/types/*`: strict request/response typing; avoid `any`.
- `src/pages/*`: Page Objects for UI tests.

Environment variables
- `BASE_URL` or `PLAYWRIGHT_BASE_URL`: global fallback base URL.
- `API_BASE_URL`: optional API-specific base URL.
- `UI_BASE_URL`: optional UI-specific base URL.
- `PERF_BASE_URL`: optional perf-specific base URL.
- `RETRY_COUNT`: network retry attempts for API client wrappers.

Notes
- The repository enforces typed responses and uses fixtures to manage per-test lifecycles. See `docs/skills/*` for guidance on each domain.

