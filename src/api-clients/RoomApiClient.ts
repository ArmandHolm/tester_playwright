import { APIResponse } from '@playwright/test';
import { newApiContext, requestWithRetries } from './BaseApiClient';
import type { RoomResponse } from '../types/response/RoomResponse';

export class RoomApiClient {
    static async getRooms(): Promise<{ status: number; body: RoomResponse }> {
        const context = await newApiContext();
        try {
            const resp: APIResponse = await requestWithRetries(context, (c) => c.get('/api/room'));
            const status = resp.status();
            const body: RoomResponse = await resp.json();
            return { status, body };
        } finally {
            await context.dispose();
        }
    }
}

export default RoomApiClient;
