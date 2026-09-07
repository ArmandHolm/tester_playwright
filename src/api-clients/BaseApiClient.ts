import { APIRequestContext, request } from '@playwright/test';
import config, { getApiBaseUrl } from '../config';

export async function newApiContext(): Promise<APIRequestContext> {
    return request.newContext({
        baseURL: getApiBaseUrl(),
        extraHTTPHeaders: {
            accept: 'application/json',
        },
    });
}

export async function requestWithRetries<T>(
    context: APIRequestContext,
    call: (context: APIRequestContext) => Promise<T>,
    retries = config.retryCount
): Promise<T> {
    let attempt = 0;
    while (true) {
        try {
            return await call(context);
        } catch (err) {
            if (attempt >= retries) throw err;
            const backoff = 200 * Math.pow(2, attempt);
            await new Promise((res) => setTimeout(res, backoff));
            attempt += 1;
        }
    }
}

export default {
    newApiContext,
    requestWithRetries,
};
