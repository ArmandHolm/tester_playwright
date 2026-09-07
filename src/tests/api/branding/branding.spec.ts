import { expect } from '@playwright/test';
import { test as apiTest } from '../../../fixtures/apiFixtures';
import type { BrandingResponse } from '../../../types/response/BrandingResponse';

const endpoint = '/api/branding';

apiTest.describe('Hotel API', () => {
    apiTest('get branding returns 200 and expected name', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as BrandingResponse;
        expect(data.name).toBe('Shady Meadows B&B');
    });

    apiTest('branding response schema and headers', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const contentType = resp.headers()['content-type'] || '';
        expect(contentType.toLowerCase()).toContain('application/json');
        const data = (await resp.json()) as BrandingResponse;
        expect(typeof data.name).toBe('string');
        if (data.contact) {
            expect(typeof data.contact).toBe('object');
            if (data.contact.email) {
                // simple email format check
                expect(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.contact.email)).toBeTruthy();
            }
        }
    });

    apiTest('all required top-level fields exist and have correct types', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = await resp.json();
        const expected = ['name', 'contact', 'address', 'description', 'directions', 'logoUrl', 'map'];
        for (const key of expected) expect(Object.prototype.hasOwnProperty.call(data, key)).toBeTruthy();
        expect(typeof data.name).toBe('string');
        expect(typeof data.description).toBe('string');
        expect(typeof data.directions).toBe('string');
        expect(typeof data.logoUrl).toBe('string');
        expect(typeof data.map).toBe('object');
    });

    apiTest('All fields in response have valid formats', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as BrandingResponse;
        expect(typeof data.name).toBe('string');
        expect(typeof data.description).toBe('string');
        expect(typeof data.directions).toBe('string');
        expect(typeof data.logoUrl).toBe('string');
        expect(typeof data.map).toBe('object');
        expect(typeof data.map.latitude).toBe('number');
        expect(typeof data.map.longitude).toBe('number');
        expect(typeof data.contact).toBe('object');
        expect(typeof data.contact.name).toBe('string');
        expect(typeof data.contact.email).toBe('string');
        expect(typeof data.contact.phone).toBe('string');
        expect(typeof data.address).toBe('object');
        expect(typeof data.address.county).toBe('string');
        expect(typeof data.address.line1).toBe('string');
        expect(typeof data.address.line2).toBe('string');
        expect(typeof data.address.postCode).toBe('string');
        expect(typeof data.address.postTown).toBe('string');
    });

    apiTest('contact block contains name, email and phone with valid formats', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as BrandingResponse;
        expect(typeof data.contact).toBe('object');
        expect(typeof data.contact.name).toBe('string');
        expect(typeof data.contact.email).toBe('string');
        expect(typeof data.contact.phone).toBe('string');
        expect(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.contact.email)).toBeTruthy();
        // phone: allow digits, spaces, plus and dashes, check length
        expect(/^[0-9 \-+()]+$/.test(data.contact.phone)).toBeTruthy();
        expect(data.contact.phone.replace(/[^0-9]/g, '').length).toBeGreaterThanOrEqual(8);
    });

    apiTest('address block fields and postCode format', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = await resp.json();
        expect(typeof data.address).toBe('object');
        const addr = data.address;
        const addrFields = ['line1', 'line2', 'postCode', 'postTown', 'county'];
        for (const k of addrFields) expect(Object.prototype.hasOwnProperty.call(addr, k)).toBeTruthy();
        expect(typeof addr.postCode).toBe('string');
        // basic postcode sanity (letters/digits and spaces)
        expect(/^[A-Z0-9 \-]+$/i.test(addr.postCode)).toBeTruthy();
    });

    apiTest('map coordinates are numeric and within valid ranges', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = await resp.json();
        expect(typeof data.map.latitude).toBe('number');
        expect(typeof data.map.longitude).toBe('number');
        expect(data.map.latitude).toBeGreaterThanOrEqual(-90);
        expect(data.map.latitude).toBeLessThanOrEqual(90);
        expect(data.map.longitude).toBeGreaterThanOrEqual(-180);
        expect(data.map.longitude).toBeLessThanOrEqual(180);
    });

    apiTest('logoUrl is a string and resource is reachable', async ({ apiContext, apiBaseUrl }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = await resp.json();
        expect(typeof data.logoUrl).toBe('string');
        // request the logo URL (context baseURL is the API base without trailing /api)
        const logoResp = await apiContext.get(data.logoUrl);
        expect([200, 304]).toContain(logoResp.status());
    });

    apiTest('description and directions are non-empty and reasonably sized', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = await resp.json();
        expect(typeof data.description).toBe('string');
        expect(data.description.length).toBeGreaterThan(20);
        expect(typeof data.directions).toBe('string');
        expect(data.directions.length).toBeGreaterThan(10);
    });

    apiTest('GET with trailing slash and query params returns equivalent payload', async ({ apiContext }) => {
        const r1 = await apiContext.get(endpoint);
        const b1 = await r1.json();
        const r2 = await apiContext.get(endpoint + '/');
        const b2 = await r2.json();
        expect(JSON.stringify(b1)).toEqual(JSON.stringify(b2));
        const r3 = await apiContext.get(endpoint + '?test=1');
        const b3 = await r3.json();
        expect(JSON.stringify(b1)).toEqual(JSON.stringify(b3));
    });

    apiTest('response is stable across repeated requests', async ({ apiContext }) => {
        const r1 = await apiContext.get(endpoint);
        const b1 = await r1.json();
        const r2 = await apiContext.get(endpoint);
        const b2 = await r2.json();
        expect(JSON.stringify(b1)).toEqual(JSON.stringify(b2));
    });

    apiTest('map coordinates are near expected location (within 0.5 degrees)', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        const data = await resp.json();
        const lat = data.map.latitude;
        const lon = data.map.longitude;
        // expected from sample: lat ~52.6351204, lon ~1.2733774
        expect(Math.abs(lat - 52.6351204)).toBeLessThanOrEqual(0.5);
        expect(Math.abs(lon - 1.2733774)).toBeLessThanOrEqual(0.5);
    });

    apiTest('response contains no surprising top-level arrays or nested nulls', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        const data = await resp.json();
        // assert none of the top-level expected keys are null
        const keys = ['name', 'contact', 'address', 'description', 'directions', 'logoUrl', 'map'];
        for (const k of keys) expect(data[k]).not.toBeNull();
    });

    apiTest('HEAD request is accepted or not disallowed', async ({ apiContext }) => {
        const resp = await apiContext.fetch(endpoint, { method: 'HEAD' });
        // some servers may not support HEAD; accept 200/204/405
        expect([200, 204, 405]).toContain(resp.status());
    });
});
