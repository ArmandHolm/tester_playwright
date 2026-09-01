# Skill: API Testing & Integration

## Objective
Build robust, scalable API controllers and integration tests for the Conduit API (`https://api.realworld.io/api`).

## Architecture Rules
* **API Clients (`src/api-clients/`):** All API calls must be encapsulated in class-based controllers (e.g., `AuthApiClient.ts`, `ArticleApiClient.ts`). These classes must accept a Playwright `APIRequestContext` in their constructor.
* **Types (`src/types/api.d.ts`):** Define strict TypeScript interfaces for all request payloads and responses.
* **Tests (`src/tests/api/`):** API specs must focus on HTTP status codes, schema validation, and response time assertions.

## State Management Standard
* For authentication, the `AuthApiClient` must handle generating JWT tokens via the `/users/login` endpoint.
* Tests requiring authentication must pass this generated token in the `Authorization: Token <jwt>` header.

## Playwright Specifics
* Use `await request.post()`, `await request.get()`.
* Assertions should look like: `expect(response.status()).toBe(200);`