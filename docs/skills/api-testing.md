# Skill: API Testing & Integration

## Objective
Build robust, scalable API controllers and integration tests for the Restful Booker Platform API (`https://automationintesting.online/`).

## Architecture Rules
* **API Clients (`src/api-clients/`):** All API calls must be encapsulated in class-based controllers. Create `RoomApiClient.ts` and `BrandingApiClient.ts`. These must accept a Playwright `APIRequestContext`.
* **Types (`src/types/api.d.ts`):** Define strict TypeScript interfaces for request payloads and responses (e.g., `RoomResponse`, `BrandingResponse`).
* **Tests (`src/tests/api/`):** API specs must focus on HTTP status codes, schema validation, and response times.

## Endpoint Standards
* Branding: GET `/api/branding` returns hotel contact info, map coordinates, and descriptions.
* Rooms: GET `/api/room` returns a list of available rooms, prices, and features.