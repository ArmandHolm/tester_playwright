import { APIResponse } from '@playwright/test';
import { newApiContext, requestWithRetries } from './BaseApiClient';
import type { BrandingResponse } from '../types/response/BrandingResponse';

export class BrandingApiClient {
    static async getBranding(): Promise<{ status: number; body: BrandingResponse }> {
        const context = await newApiContext();
        try {
            const resp: APIResponse = await requestWithRetries(context, (c) => c.get('/api/branding'));
            const status = resp.status();
            const body: BrandingResponse = await resp.json();
            return { status, body };
        } finally {
            await context.dispose();
        }
    }
}

export default BrandingApiClient;