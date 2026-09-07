import { expect, test as apiTest } from '@playwright/test';
import BrandingApiClient from '../../../api-clients/BrandingApiClient';
import { expectBrandingResponse } from '../../../api-clients/validators';

apiTest.describe('Branding API service client', () => {
    apiTest('BrandingApiClient.getBranding returns 200 and the expected payload', async () => {
        const result = await BrandingApiClient.getBranding();

        expect(result.status).toBe(200);
        expectBrandingResponse(result.body);
        expect(result.body.name).toBe('Shady Meadows B&B');
    });

    apiTest('BrandingApiClient.getBranding is stable across repeated calls', async () => {
        const first = await BrandingApiClient.getBranding();
        const second = await BrandingApiClient.getBranding();

        expect(first.status).toBe(200);
        expect(second.status).toBe(200);
        expectBrandingResponse(first.body);
        expectBrandingResponse(second.body);
        expect(JSON.stringify(first.body)).toEqual(JSON.stringify(second.body));
    });
});
