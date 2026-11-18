import {createAuthClient} from '@neon/neon-js/auth';

const url = process.env.EXPO_PUBLIC_NEON_AUTH_URL;
export const authClient =createAuthClient({url, 
    fetchOptions:{
        headers:{
            Origin:"https://onrender.com"
        }
    }
});