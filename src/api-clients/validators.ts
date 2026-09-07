import { expect } from '@playwright/test';
import type { BrandingResponse } from '../types/response/BrandingResponse';
import type { RoomResponse } from '../types/response/RoomResponse';

const expectNonEmptyString = (value: unknown, fieldName: string) => {
    expect(typeof value).toBe('string');
    expect((value as string).trim().length).toBeGreaterThan(0);
    expect(fieldName.length).toBeGreaterThan(0);
};

const expectEmail = (value: unknown) => {
    expect(typeof value).toBe('string');
    expect(/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value as string)).toBeTruthy();
};

const expectPhone = (value: unknown) => {
    expect(typeof value).toBe('string');
    expect(/^[0-9 \-+()]+$/.test(value as string)).toBeTruthy();
    expect((value as string).replace(/[^0-9]/g, '').length).toBeGreaterThanOrEqual(8);
};

const expectPostCode = (value: unknown) => {
    expect(typeof value).toBe('string');
    expect(/^[A-Z0-9 \-]+$/i.test(value as string)).toBeTruthy();
};

export function expectBrandingResponse(data: BrandingResponse): void {
    expectNonEmptyString(data.name, 'name');
    expectNonEmptyString(data.description, 'description');
    expectNonEmptyString(data.directions, 'directions');
    expectNonEmptyString(data.logoUrl, 'logoUrl');
    expect(typeof data.map).toBe('object');
    expect(typeof data.map.latitude).toBe('number');
    expect(typeof data.map.longitude).toBe('number');
    expect(data.map.latitude).toBeGreaterThanOrEqual(-90);
    expect(data.map.latitude).toBeLessThanOrEqual(90);
    expect(data.map.longitude).toBeGreaterThanOrEqual(-180);
    expect(data.map.longitude).toBeLessThanOrEqual(180);

    expect(typeof data.contact).toBe('object');
    expectNonEmptyString(data.contact.name, 'contact.name');
    expectEmail(data.contact.email);
    expectPhone(data.contact.phone);

    expect(typeof data.address).toBe('object');
    expectNonEmptyString(data.address.line1, 'address.line1');
    expectNonEmptyString(data.address.line2, 'address.line2');
    expectNonEmptyString(data.address.postTown, 'address.postTown');
    expectNonEmptyString(data.address.county, 'address.county');
    expectPostCode(data.address.postCode);
}

export function expectRoomResponse(data: RoomResponse): void {
    expect(Array.isArray(data.rooms)).toBeTruthy();
    expect(data.rooms.length).toBeGreaterThan(0);

    for (const room of data.rooms) {
        expect(typeof room).toBe('object');
        expect(typeof room.accessible).toBe('boolean');
        expectNonEmptyString(room.description, 'room.description');
        expect(room.description.length).toBeGreaterThan(20);
        expect(Array.isArray(room.features)).toBeTruthy();
        expect(room.features.length).toBeGreaterThan(0);
        for (const feature of room.features) {
            expectNonEmptyString(feature, 'room.feature');
        }
        expectNonEmptyString(room.image, 'room.image');
        expectNonEmptyString(room.roomName, 'room.roomName');
        expectNonEmptyString(room.type, 'room.type');
        expect(typeof room.roomPrice).toBe('number');
        expect(room.roomPrice).toBeGreaterThanOrEqual(0);

        const roomId = room.id ?? room.roomid;
        if (roomId !== undefined) {
            expect(typeof roomId).toBe('number');
            expect(Number.isInteger(roomId)).toBeTruthy();
            expect(roomId).toBeGreaterThan(0);
        }
    }
}
