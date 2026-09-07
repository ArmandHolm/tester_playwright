# Skill: API Testing & Integration

## Objective
Build robust, strongly-typed API clients and integration tests for the Restful Booker Platform API (`https://automationintesting.online/`).

## Architecture Rules (practical guidance)
- API Clients (`src/api-clients/`): encapsulate HTTP calls in class-based controllers. Prefer using the shared helpers in `BaseApiClient.ts` for creating an `APIRequestContext`, adding common headers, timeout handling, and retries.
- Fixtures: use `src/fixtures/apiFixtures.ts` to obtain an `apiContext` for tests — this ensures per-test isolation and consistent base URL resolution.
- Types (`src/types/*`): define request and response interfaces for every endpoint. Keep types modular under `src/types/request` and `src/types/response`, and provide a single re-export barrel `src/types/api.d.ts` for convenience.
- Tests (`src/tests/api/`): focus on HTTP status codes, response schema validation, and behavior (not implementation). Prefer asserting typed properties rather than JSON shape casts.

## Coding Guidelines
- No `any`: every API method should return a typed result (e.g., `Promise<{ status:number; body: RoomResponse }>`).
- Use `requestWithRetries()` for network resilience. Configure `RETRY_COUNT` in environment.
- Keep client methods small and single-purpose (GET `/api/room` => `getRooms()`).
- Dispose Playwright contexts in `finally` blocks or let fixtures manage lifecycle.

## Endpoint Standards (examples)
- Branding: GET `/api/branding` -> returns `BrandingResponse` (see `src/types/response/BrandingResponse.d.ts`).
- Rooms: GET `/api/room` -> returns `RoomResponse` (see `src/types/response/RoomResponse.d.ts`).

## Example (using fixture-provided `apiContext`)
```ts
// src/tests/api/hotel.spec.ts (excerpt)
test('get rooms returns 200', async ({ apiContext }) => {
	const resp = await apiContext.get('/api/room');
	expect(resp.status()).toBe(200);
	const body = await resp.json() as RoomResponse;
	expect(Array.isArray(body.rooms)).toBeTruthy();
});
```

## Where to add new clients
- Add a new file under `src/api-clients/` with a single class and static methods. Add types under `src/types/request` and `src/types/response` and update the barrel `src/types/api.d.ts`.
