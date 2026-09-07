import { expect } from '@playwright/test';
import { test as apiTest } from '../../../fixtures/apiFixtures';
import type { Room, RoomResponse } from '../../../types/response/RoomResponse';

const expectedRoomKeys: Array<keyof Room> = ['accessible', 'description', 'features', 'image', 'roomName', 'roomPrice', 'roomid', 'type'];

const endpoint = '/api/room';

const expectRoomBody = (room: Room) => {
    for (const key of expectedRoomKeys) {
        expect(Object.prototype.hasOwnProperty.call(room, key)).toBeTruthy();
    }

    expect(typeof room.accessible).toBe('boolean');
    expect(typeof room.description).toBe('string');
    expect(room.description.length).toBeGreaterThan(20);
    expect(Array.isArray(room.features)).toBeTruthy();
    expect(room.features.length).toBeGreaterThan(0);
    for (const feature of room.features) {
        expect(typeof feature).toBe('string');
        expect(feature.trim().length).toBeGreaterThan(0);
    }
    expect(typeof room.image).toBe('string');
    expect(room.image.trim().length).toBeGreaterThan(0);
    expect(typeof room.roomName).toBe('string');
    expect(room.roomName.trim().length).toBeGreaterThan(0);
    expect(typeof room.type).toBe('string');
    expect(room.type.trim().length).toBeGreaterThan(0);
    expect(typeof room.roomPrice).toBe('number');
    expect(room.roomPrice).toBeGreaterThanOrEqual(0);

    const roomId = room.id ?? room.roomid;
    if (roomId !== undefined) {
        expect(typeof roomId).toBe('number');
        expect(Number.isInteger(roomId)).toBeTruthy();
        expect(roomId).toBeGreaterThan(0);
    }
};

apiTest.describe('Hotel API', () => {
    apiTest('get rooms returns 200 and response is JSON', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const contentType = resp.headers()['content-type'] || '';
        expect(contentType.toLowerCase()).toContain('application/json');
        const data = (await resp.json()) as RoomResponse;
        expect(Array.isArray(data.rooms)).toBeTruthy();
        expect(data.rooms.length).toBeGreaterThan(0);
    });

    apiTest('all required room keys exist and each room matches the expected schema', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as RoomResponse;
        expect(Array.isArray(data.rooms)).toBeTruthy();

        for (const room of data.rooms) {
            expectRoomBody(room);
        }
    });

    apiTest('room name and room type are present and non-empty strings', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as RoomResponse;

        for (const room of data.rooms) {
            expect(typeof room.roomName).toBe('string');
            expect(room.roomName.trim().length).toBeGreaterThan(0);
            expect(typeof room.type).toBe('string');
            expect(room.type.trim().length).toBeGreaterThan(0);
        }
    });

    apiTest('room prices are numeric and non-negative', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as RoomResponse;

        for (const room of data.rooms) {
            expect(typeof room.roomPrice).toBe('number');
            expect(Number.isFinite(room.roomPrice)).toBeTruthy();
            expect(room.roomPrice).toBeGreaterThanOrEqual(0);
        }
    });

    apiTest('accessible flag is boolean and description is meaningful', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as RoomResponse;

        for (const room of data.rooms) {
            expect(typeof room.accessible).toBe('boolean');
            expect(typeof room.description).toBe('string');
            expect(room.description.trim().length).toBeGreaterThan(20);
        }
    });

    apiTest('features array is valid and contains only non-empty strings', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as RoomResponse;

        for (const room of data.rooms) {
            expect(Array.isArray(room.features)).toBeTruthy();
            expect(room.features.length).toBeGreaterThan(0);
            for (const feature of room.features) {
                expect(typeof feature).toBe('string');
                expect(feature.trim().length).toBeGreaterThan(0);
            }
        }
    });

    apiTest('image URL values are non-empty strings', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as RoomResponse;

        for (const room of data.rooms) {
            expect(typeof room.image).toBe('string');
            expect(room.image.trim().length).toBeGreaterThan(0);
        }
    });

    apiTest('room id is present and valid when supplied by the API', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as RoomResponse;

        let idFound = false;
        for (const room of data.rooms) {
            const roomId = room.id ?? room.roomid;
            if (roomId !== undefined) {
                idFound = true;
                expect(typeof roomId).toBe('number');
                expect(Number.isInteger(roomId)).toBeTruthy();
                expect(roomId).toBeGreaterThan(0);
            }
        }

        if (data.rooms.length > 0) {
            expect(idFound).toBeTruthy();
        }
    });

    apiTest('room ids are unique across the returned collection', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as RoomResponse;

        const ids = new Set<number>();
        let uniqueIdsSeen = 0;

        for (const room of data.rooms) {
            const roomId = room.id ?? room.roomid;
            if (roomId !== undefined) {
                uniqueIdsSeen += 1;
                expect(ids.has(roomId)).toBeFalsy();
                ids.add(roomId);
            }
        }

        if (data.rooms.length > 0) {
            expect(uniqueIdsSeen).toBeGreaterThan(0);
        }
    });

    apiTest('response is stable across repeated requests', async ({ apiContext }) => {
        const r1 = await apiContext.get(endpoint);
        expect(r1.status()).toBe(200);
        const b1 = await r1.json();

        const r2 = await apiContext.get(endpoint);
        expect(r2.status()).toBe(200);
        const b2 = await r2.json();

        expect(JSON.stringify(b1)).toEqual(JSON.stringify(b2));
    });

    apiTest('GET with trailing slash and query params is equivalent to base endpoint', async ({ apiContext }) => {
        const r1 = await apiContext.get(endpoint);
        const b1 = await r1.json();

        const r2 = await apiContext.get(endpoint + '/');
        const b2 = await r2.json();
        expect(JSON.stringify(b1)).toEqual(JSON.stringify(b2));

        const r3 = await apiContext.get(endpoint + '?test=1');
        const b3 = await r3.json();
        expect(JSON.stringify(b1)).toEqual(JSON.stringify(b3));
    });

    apiTest('response contains no unexpected null values in required fields', async ({ apiContext }) => {
        const resp = await apiContext.get(endpoint);
        expect(resp.status()).toBe(200);
        const data = (await resp.json()) as RoomResponse;

        for (const room of data.rooms) {
            for (const key of expectedRoomKeys) {
                expect(room[key]).not.toBeNull();
            }
        }
    });

    apiTest('HEAD request is accepted or not disallowed', async ({ apiContext }) => {
        const resp = await apiContext.fetch(endpoint, { method: 'HEAD' });
        expect([200, 204, 405]).toContain(resp.status());
    });
});
