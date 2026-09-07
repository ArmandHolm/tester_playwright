import * as path from 'path';
import * as fs from 'fs';

const envPath = path.resolve(process.cwd(), '.env');
let envLoaded = false;

export function loadDotEnvFile(filePath: string = envPath): boolean {
    if (envLoaded && filePath === envPath) {
        return true;
    }

    try {
        if (!process.env.CI && fs.existsSync(filePath)) {
            const env = fs.readFileSync(filePath, 'utf8');
            env.split(/\r?\n/).forEach((line) => {
                const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
                if (!match) return;

                const key = match[1];
                let value = match[2] ?? '';

                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }

                if (typeof process.env[key] === 'undefined') {
                    process.env[key] = value;
                }
            });
        }
    } catch (e) {
        return false;
    }

    envLoaded = true;
    return true;
}

function resolveEnvValue(...keys: string[]): string | undefined {
    loadDotEnvFile();
    for (const key of keys) {
        const value = process.env[key];
        if (typeof value === 'string' && value.trim().length > 0) {
            return value.trim();
        }
    }
    return undefined;
}

function asDefaultUrl(value: string | undefined, fallback: string): string {
    return value ?? fallback;
}

function stripTrailingApiPath(url: string | undefined): string {
    if (!url) return url ?? '';
    return url.replace(/\/api\/?$/i, '').replace(/\/+$/, '');
}

loadDotEnvFile();

export const config = {
    get baseUrl(): string {
        return asDefaultUrl(resolveEnvValue('PLAYWRIGHT_BASE_URL', 'BASE_URL'), 'http://localhost:3000');
    },
    get apiBaseUrl(): string {
        const value = resolveEnvValue('API_BASE_URL', 'PLAYWRIGHT_BASE_URL', 'BASE_URL');
        return stripTrailingApiPath(asDefaultUrl(value, 'http://localhost:3000')) || 'http://localhost:3000';
    },
    get uiBaseUrl(): string {
        return asDefaultUrl(resolveEnvValue('UI_BASE_URL', 'PLAYWRIGHT_BASE_URL', 'BASE_URL'), 'http://localhost:3000');
    },
    get perfBaseUrl(): string {
        return asDefaultUrl(resolveEnvValue('PERF_BASE_URL', 'PLAYWRIGHT_BASE_URL', 'BASE_URL'), 'http://localhost:3000');
    },
    get retryCount(): number {
        return Number(process.env.RETRY_COUNT ?? 2) || 0;
    },
    get nodeEnv(): string {
        return process.env.NODE_ENV ?? 'development';
    },
    get isCI(): boolean {
        return Boolean(process.env.CI);
    },
};

export function getBaseUrl(): string {
    return config.baseUrl;
}

export function getApiBaseUrl(): string {
    return config.apiBaseUrl;
}

export function getUiBaseUrl(): string {
    return config.uiBaseUrl;
}

export function getPerfBaseUrl(): string {
    return config.perfBaseUrl;
}

export function validateConfig(required: { baseUrl?: boolean; api?: boolean; ui?: boolean; perf?: boolean } = { baseUrl: true }) {
    if (required.baseUrl && !config.baseUrl) {
        throw new Error('PLAYWRIGHT_BASE_URL or BASE_URL is not defined. Set PLAYWRIGHT_BASE_URL or BASE_URL.');
    }
    if (required.api && !config.apiBaseUrl) {
        throw new Error('API_BASE_URL is not defined. Set API_BASE_URL or PLAYWRIGHT_BASE_URL/BASE_URL.');
    }
    if (required.ui && !config.uiBaseUrl) {
        throw new Error('UI_BASE_URL is not defined. Set UI_BASE_URL or PLAYWRIGHT_BASE_URL/BASE_URL.');
    }
    if (required.perf && !config.perfBaseUrl) {
        throw new Error('PERF_BASE_URL is not defined. Set PERF_BASE_URL or PLAYWRIGHT_BASE_URL/BASE_URL.');
    }
}

export default config;