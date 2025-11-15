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
        method: 'GET',
        credentials: 'include', // Critical: include cookies in the request
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Don't cache auth checks
      });
      
      if (!response.ok) {
        console.error('Auth check failed:', response.status, response.statusText);
        setUser(null);
        return;
      }
      
      const data = await response.json();
      console.log('Auth check result:', data.user ? 'User found' : 'No user');
      setUser(data.user || null);
    } catch (error: any) {
      console.error('Auth check error:', error.message);
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
        credentials: 'include', // Critical: include cookies in the request
        cache: 'no-store', // Don't cache login requests
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to sign in', errorType: data.errorType };
      }

      // Set user immediately
      setUser(data.user);
      
      // Verify cookie was set by checking auth immediately
      setTimeout(() => {
        checkAuth();
      }, 100);
      
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
