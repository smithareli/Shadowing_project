import { createAuthClient } from '@neon/neon-js/auth';

const authUrl = process.env.EXPO_PUBLIC_NEON_AUTH_URL;

if (!authUrl) {
    throw new Error('EXPO_PUBLIC_NEON_AUTH_URL must be configured to use authentication.');
}

export const authClient = createAuthClient(authUrl);
