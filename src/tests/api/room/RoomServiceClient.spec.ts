import { expect, test as apiTest } from '@playwright/test';
import RoomApiClient from '../../../api-clients/RoomApiClient';
import { expectRoomResponse } from '../../../api-clients/validators';

apiTest.describe('Room API service client', () => {
    apiTest('RoomApiClient.getRooms returns 200 and a valid room collection', async () => {
        const result = await RoomApiClient.getRooms();

        expect(result.status).toBe(200);
        expectRoomResponse(result.body);
        expect(Array.isArray(result.body.rooms)).toBeTruthy();
        expect(result.body.rooms.length).toBeGreaterThan(0);
    });

    apiTest('RoomApiClient.getRooms provides unique ids and valid schema across calls', async () => {
        const first = await RoomApiClient.getRooms();
        const second = await RoomApiClient.getRooms();

        expect(first.status).toBe(200);
        expect(second.status).toBe(200);
        expectRoomResponse(first.body);
        expectRoomResponse(second.body);

        const firstIds = first.body.rooms
            .map((room) => room.id ?? room.roomid)
            .filter((value): value is number => typeof value === 'number');
        const uniqueIds = new Set(firstIds);

        expect(firstIds.length).toBe(uniqueIds.size);
        expect(JSON.stringify(first.body)).toEqual(JSON.stringify(second.body));
    });
});
