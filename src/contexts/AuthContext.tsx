import React, { createContext, useContext, useState, useCallback } from 'react';
import { AppUser, Role } from '@/types';
import { mockUsers, LOGIN_CREDENTIALS } from '@/data/mock';

interface AuthContextType {
  user: AppUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);

  const login = useCallback((username: string, password: string): boolean => {
    const cred = LOGIN_CREDENTIALS[username];
    if (cred && cred.password === password) {
      const found = mockUsers.find(u => u.username === username);
      if (found) {
        setUser({ ...found, last_login_at: new Date().toISOString() });
        return true;
      }
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
