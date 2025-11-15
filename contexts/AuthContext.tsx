"use client";

import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';

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
  const hasCheckedAuthRef = useRef(false);
  const justLoggedInRef = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      // Get token from localStorage as fallback
      const localToken = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
      
      // Prepare headers with token if available
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      // Add token to Authorization header if we have it (fallback for when cookies fail)
      if (localToken) {
        headers['Authorization'] = `Bearer ${localToken}`;
      }
      
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include', // Critical: include cookies in the request
        headers,
        cache: 'no-store', // Don't cache auth checks
      });
      
      if (!response.ok) {
        // If auth fails and we have a local token, clear it
        if (localToken && typeof window !== 'undefined') {
          localStorage.removeItem('auth-token');
        }
        console.error('Auth check failed:', response.status, response.statusText);
        setUser(null);
        return;
      }
      
      const data = await response.json();
      console.log('Auth check result:', data.user ? 'User found' : 'No user');
      
      // If we got a user, ensure token is stored
      if (data.user && localToken && typeof window !== 'undefined') {
        localStorage.setItem('auth-token', localToken);
      }
      
      // Always update user state based on API response
      setUser(data.user || null);
    } catch (error: any) {
      console.error('Auth check error:', error.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Always check auth on mount - this is critical for persistence
    // Reset the flag on mount to ensure we always check after refresh
    hasCheckedAuthRef.current = false;
    
    // Check auth immediately on mount
    checkAuth();
    hasCheckedAuthRef.current = true;
    
    // If we just logged in, verify auth after a short delay
    if (justLoggedInRef.current) {
      setLoading(false);
      const timer = setTimeout(() => {
        justLoggedInRef.current = false;
        // Verify auth after cookie/token is set
        setTimeout(() => {
          checkAuth();
        }, 500);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    // Check auth when app comes back into focus (important for PWAs)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && !justLoggedInRef.current) {
        // Re-check auth when app becomes visible again
        checkAuth();
      }
    };
    
    // Check auth on page focus (when user switches back to tab/app)
    const handleFocus = () => {
      if (!justLoggedInRef.current) {
        checkAuth();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAuth]);

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

      // Store token in localStorage as fallback
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('auth-token', data.token);
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

      // Store token in localStorage as fallback (in case cookies don't work)
      if (data.token && typeof window !== 'undefined') {
        localStorage.setItem('auth-token', data.token);
      }

      // Set user immediately from the response
      // Mark that we just logged in to prevent checkAuth from clearing the user
      justLoggedInRef.current = true;
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
      
      // Clear localStorage token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('lastLoginEmail');
      }
      
      setUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear localStorage even on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('lastLoginEmail');
      }
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
