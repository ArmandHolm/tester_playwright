export interface BrandingResponse {
    name: string;
    address: {
        county: string;
        line1: string;
        line2: string;
        postCode: string;
        postTown: string;
    };
    contact: {
        name: string;
        phone: string;
        email: string;
    };
    description: string;
    directions: string;
    logoUrl: string;
    map: {
        latitude: number;
        longitude: number;
    },
}
