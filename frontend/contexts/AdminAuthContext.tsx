import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

type AdminAuthContextValue = {
  token: string | null;
  setToken: (value: string | null) => void;
  isReady: boolean;
};

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);
const STORAGE_KEY = 'ddhw_admin_token';

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setTokenState(stored);
    }
    setIsReady(true);
  }, []);

  const setToken = useCallback((value: string | null) => {
    setTokenState(value);
    if (typeof window === 'undefined') return;
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, value);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      token,
      setToken,
      isReady,
    }),
    [token, setToken, isReady]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return ctx;
};

