import { test as base, expect } from '@playwright/test';
import config from '../config';

type BaseFixtures = {
    config: typeof config;
    logger: { info: (msg: string) => void; warn: (msg: string) => void; error: (msg: string) => void };
};

export const test = base.extend<BaseFixtures>({
    config: async ({ }, use) => {
        // Ensure config is available to all tests
        await use(config);
    },

    logger: async ({ }, use) => {
        const logger = {
            info: (msg: string) => console.log('[info]', msg),
            warn: (msg: string) => console.warn('[warn]', msg),
            error: (msg: string) => console.error('[error]', msg),
        };
        await use(logger);
    },
});

export { expect };
