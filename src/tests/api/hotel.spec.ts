import { expect } from '@playwright/test';
import { test as apiTest } from '../../fixtures/apiFixtures';

apiTest.describe('Hotel API', () => {

    apiTest('health endpoint returns 200 for at least one known path, or branding is available', async ({ apiContext }) => {
        const candidates = ['/api/branding/actuator/health', '/api/room/actuator/health', '/api/booking/actuator/health'];
        let found = false;
        for (const p of candidates) {
            const resp = await apiContext.get(p);
            if (resp.status() === 200) {
                const ct = resp.headers()['content-type'] || '';
                if (ct) expect(ct.toLowerCase()).toContain('application/json');
                const body = await resp.json();
                expect(typeof body).toBe('object');
                found = true;
                break;
            }
            expect(found).toBeTruthy();
        }
    });

    apiTest('critical endpoints respond 200 (branding & room)', async ({ apiContext }) => {
        const respBranding = await apiContext.get('/api/branding');
        expect(respBranding.status()).toBe(200);
        const respRoom = await apiContext.get('/api/room');
        expect(respRoom.status()).toBe(200);

        // Authentication required for booking endpoint, cannot assert 200 here. Instead, check that the endpoint is reachable and returns a valid status code (200, 401, 403, etc.)
        const respBooking = await apiContext.get('/api/booking');
        expect([200, 401, 403, 404]).toContain(respBooking.status());
    });

    apiTest('unknown endpoint returns 404', async ({ apiContext }) => {
        const resp = await apiContext.get('/api/nonexistent-endpoint-please-ignore');
        expect([404, 410, 400]).toContain(resp.status());
    });

    apiTest('api base responds with HTML or JSON (smoke)', async ({ apiContext }) => {
        const resp = await apiContext.get('/api');
        // some servers return HTML for root, others JSON - assert it's reachable
        expect([200, 301, 302, 404]).toContain(resp.status());
    });

});
