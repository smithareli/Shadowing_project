import {createAuthClient} from '@neon/neon-js/auth';

export const authClient = createAuthClient(
  process.env.EXPO_PUBLIC_NEON_AUTH_URL || '',
  {
    fetchOptions: {
      headers: {
        Origin: 'https://your-backend.onrender.com', 
      },
    },
  }
);