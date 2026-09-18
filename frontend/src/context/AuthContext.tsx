import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { getToken, setToken, removeToken } from '../services/api';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = getToken();
      if (storedToken) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Session expirée ou invalide:', error);
          removeToken();
          setTokenState(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const response = await authService.login(email, pass);
    setToken(response.token);
    setTokenState(response.token);
    setUser(response.user);
  };

  const register = async (email: string, pass: string, fullName: string) => {
    const response = await authService.register(email, pass, fullName);
    setToken(response.token);
    setTokenState(response.token);
    setUser(response.user);
  };

  const logout = () => {
    removeToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé au sein d’un AuthProvider');
  }
  return context;
};
