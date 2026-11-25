import './crypto-polyfill';
import { createAuthClient } from '@neon/neon-js/auth';
import { BetterAuthReactAdapter } from '@neon/neon-js/auth/react/adapters';

const url = process.env.EXPO_PUBLIC_NEON_AUTH_URL;
if (!url) throw new Error('EXPO_PUBLIC_NEON_AUTH_URL is not set');

export const neon = createAuthClient(url, {
  adapter: BetterAuthReactAdapter(),
});