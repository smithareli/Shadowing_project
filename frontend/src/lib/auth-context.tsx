import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { authClient } from '@/lib/auth';

type AuthState = {
  isLoading: boolean;
  isSignedIn: boolean;
  userId: string | null;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState>({
  isLoading: true,
  isSignedIn: false,
  userId: null,
  refresh: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userId, setUserId]= useState<string | null>(null)

  const refresh = useCallback(async () => {
    try {
      const { data } = await authClient.getSession();
      setIsSignedIn(!!data?.user);
      setUserId(data?.user?.id ?? null);
    } catch (e) {
      console.log('AUTH getSession failed', e instanceof Error ? e.stack : e);
      setIsSignedIn(false);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AuthContext.Provider value={{ isLoading, isSignedIn, userId, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);