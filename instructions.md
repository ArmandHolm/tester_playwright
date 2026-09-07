## SDET Framework Master Architecture

## Purpose
provide clear architecture and conventions for this Playwright + TypeScript automation framework (intended as a public portfolio showcasing Senior SDET practices).

Target application: https://automationintesting.online/

## Overview
- Central config: `src/config.ts` exposes `baseUrl`, `apiBaseUrl`, `uiBaseUrl`, `perfBaseUrl` and common runtime settings.
- API clients: `src/api-clients/*` encapsulate HTTP interactions and return typed responses. Use `src/api-clients/BaseApiClient.ts` for common behavior.
- Fixtures: `src/fixtures/*` provide shared setup. Import `test` from fixture modules (e.g. `src/fixtures/apiFixtures.ts`) instead of `@playwright/test` directly to get the correct per-type setup.
- Types: keep a single source of truth under `src/types/` (request/response). All responses and payloads must have TypeScript interfaces.
- Pages: UI tests must use `src/pages/*` Page Object classes. Keep locators and page logic encapsulated.

##  Where to look
- API guidance: `docs/skills/api-testing.md`
- UI guidance: `docs/skills/ui-testing.md`
- Perf & Accessibility guidance: `docs/skills/perf-a11y.md`


## General Rules & Quick reminders
- Strict TypeScript: avoid `any`. Define request/response interfaces for every API interaction.
- Use Playwright fixtures (not ad-hoc global setup) to ensure isolation and predictable lifecycle.
- Add and document environment variables in `.env` for local development; CI should set secrets/vars explicitly.
