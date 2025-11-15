"use client";

import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  _id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; errorType?: string | null }>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Important: include cookies in the request
      });
      
      if (!response.ok) {
        throw new Error('Auth check failed');
      }
      
      const data = await response.json();
      setUser(data.user || null);
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
        credentials: 'include', // Important: include cookies in the request
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to sign up' };
      }

      setUser(data.user);
      return { error: null };
    } catch (error) {
      return { error: 'Failed to sign up' };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important: include cookies in the request
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to sign in', errorType: data.errorType };
      }

      setUser(data.user);
      return { error: null, errorType: null };
    } catch (error) {
      return { error: 'Failed to sign in', errorType: null };
    }
  };

  const signOut = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important: include cookies in the request
      });
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
