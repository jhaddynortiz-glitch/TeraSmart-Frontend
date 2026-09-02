import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, UserProfile, AuthResponse } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  role: 'CLIENTE' | 'VENDEDOR' | 'SUPERADMIN' | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<AuthResponse>;
  register: (name: string, email: string, password?: string, role?: string) => Promise<AuthResponse>;
  loginDevToken: (email?: string, role?: string) => Promise<AuthResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('terasmart-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('terasmart-access-token');
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token && !user) {
      authService
        .getProfile()
        .then((profile) => {
          setUser(profile);
          localStorage.setItem('terasmart-user', JSON.stringify(profile));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.accessToken);
    localStorage.setItem('terasmart-access-token', data.accessToken);
    localStorage.setItem('terasmart-refresh-token', data.refreshToken);
    localStorage.setItem('terasmart-user', JSON.stringify(data.user));
    return data;
  };

  const login = async (email: string, password?: string) => {
    const res = await authService.login(email, password);
    return handleAuthSuccess(res);
  };

  const register = async (name: string, email: string, password?: string, role: string = 'CLIENTE') => {
    const res = await authService.register(name, email, password, role);
    return handleAuthSuccess(res);
  };

  const loginDevToken = async (email?: string, role: string = 'SUPERADMIN') => {
    const res = await authService.devToken(email, role);
    return handleAuthSuccess(res);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('terasmart-access-token');
    localStorage.removeItem('terasmart-refresh-token');
    localStorage.removeItem('terasmart-user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        role: user?.role || null,
        loading,
        login,
        register,
        loginDevToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
