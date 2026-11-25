import {createAuthClient} from '@neon/neon-js/auth';

export const authClient = createAuthClient(
  process.env.EXPO_PUBLIC_NEON_AUTH_URL || '',
  {
    fetchOptions: {
      headers: {
        Origin: 'https://shadowing-project.onrender.com', 
      },
    },
  }
);