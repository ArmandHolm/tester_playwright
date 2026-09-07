import { request } from '@playwright/test';
import { test as base, expect } from './baseTest';
import type { APIRequestContext } from '@playwright/test';
import { getApiBaseUrl } from '../config';

type ApiFixtures = {
    apiBaseUrl: string;
    apiContext: APIRequestContext;
};

export const test = base.extend<ApiFixtures>({
    apiBaseUrl: async ({ }: {}, use: (v: string) => Promise<void>) => {
        const apiBase: string = getApiBaseUrl().trim();
        await use(apiBase);
    },

    apiContext: async ({ apiBaseUrl }: { apiBaseUrl: string }, use: (context: APIRequestContext) => Promise<void>) => {
        const context = await request.newContext({ baseURL: apiBaseUrl, extraHTTPHeaders: { Accept: 'application/json' } });
        try {
            await use(context as APIRequestContext);
        } finally {
            await context.dispose();
        }
    },
});

export { expect };
