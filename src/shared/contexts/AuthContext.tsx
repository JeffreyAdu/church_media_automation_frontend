import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, metadata?: { organization_name?: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: Sleep utility for backoff
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Determine if error is retryable
function isRetryableError(error: any): boolean {
  // Network errors, temporary failures, timeouts
  const message = error?.message?.toLowerCase() || '';
  return (
    message.includes('network') ||
    message.includes('timeout') ||
    message.includes('temporarily unavailable') ||
    message.includes('service unavailable') ||
    error?.status === 503 ||
    error?.status === 504
  );
}

// Helper: Categorize auth errors for user-friendly messages
function categorizeAuthError(error: any): string {
  const message = error?.message?.toLowerCase() || '';
  
  // Rate limiting
  if (message.includes('rate') || message.includes('limit') || error?.status === 429) {
    return 'Too many attempts. Please wait a few minutes and try again.';
  }
  
  // Email already exists
  if (message.includes('already registered') || message.includes('already exists') || message.includes('duplicate')) {
    return 'This email is already registered. Please sign in instead.';
  }
  
  // Invalid credentials
  if (message.includes('invalid') && (message.includes('credentials') || message.includes('password') || message.includes('email'))) {
    return 'Invalid email or password. Please check your credentials.';
  }
  
  // Email not confirmed
  if (message.includes('email not confirmed') || message.includes('not verified')) {
    return 'Please confirm your email address before signing in. Check your inbox for the confirmation link.';
  }
  
  // Weak password
  if (message.includes('password') && (message.includes('weak') || message.includes('short') || message.includes('strength'))) {
    return 'Password is too weak. Please use a stronger password with at least 8 characters.';
  }
  
  // Network/connectivity issues
  if (message.includes('network') || message.includes('fetch') || message.includes('connection')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Default fallback
  return error?.message || 'An unexpected error occurred. Please try again.';
}

// Helper: Retry function with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Don't retry on last attempt or if error is not retryable
      if (attempt === maxRetries - 1 || !isRetryableError(error)) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const backoffMs = Math.pow(2, attempt) * 1000;
      console.log(`Retryable error, backing off ${backoffMs}ms before retry ${attempt + 1}/${maxRetries - 1}`);
      await sleep(backoffMs);
    }
  }
  
  throw new Error('Max retries exceeded');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, metadata?: { organization_name?: string }) => {
    try {
      await retryWithBackoff(async () => {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata,
          },
        });
        if (error) throw error;
      });
    } catch (error) {
      // Throw user-friendly error message
      throw new Error(categorizeAuthError(error));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      await retryWithBackoff(async () => {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      });
    } catch (error) {
      throw new Error(categorizeAuthError(error));
    }
  };

  const signOut = async () => {
    try {
      // Sign out shouldn't need retries, but include basic error handling
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw new Error(categorizeAuthError(error));
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
