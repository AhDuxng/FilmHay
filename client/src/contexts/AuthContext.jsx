import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({
      user,
      loading: false,
      isAuthenticated: Boolean(user),
      login: async () => ({
        success: false,
        error: 'Login is currently disabled',
      }),
      logout: async () => {
        setUser(null);
      },
      refreshUser: async () => null,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
