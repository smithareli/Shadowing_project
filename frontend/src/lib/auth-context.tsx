import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { authClient } from '@/lib/neon-auth';

type AuthState = {
  isLoading: boolean;
  isSignedIn: boolean;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  isLoading: true,
  isSignedIn: false,
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const { data } = await authClient.getSession();
      setIsSignedIn(!!data?.user);
    } catch (e) {
      console.log('AUTH getSession failed', e instanceof Error ? e.stack : e);
      setIsSignedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AuthContext.Provider value={{ isLoading, isSignedIn, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);