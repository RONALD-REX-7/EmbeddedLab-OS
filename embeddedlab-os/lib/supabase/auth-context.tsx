/**
 * EmbeddedLab OS — lib/supabase/auth-context.tsx
 * React Context Provider managing Supabase Authentication and Demo Mode fallback.
 */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { createClient } from "./client";
import { getSupabaseEnv } from "./config";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  isDemoMode: boolean;
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, pass: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const DEMO_USER: User = {
  id: "demo-user-id",
  app_metadata: {},
  user_metadata: { full_name: "Student Engineer (Demo)" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "demo@embeddedlab.org",
} as User;

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isConfigured: false,
  isDemoMode: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isConfigured } = getSupabaseEnv();
  const [user, setUser] = useState<User | null>(!isConfigured ? DEMO_USER : null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isConfigured);

  const supabase = createClient();

  useEffect(() => {
    if (!isConfigured || !supabase) {
      return;
    }

    // Get current session on initial render
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen to Auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured, supabase]);

  const signIn = async (email: string, pass: string) => {
    if (!supabase || !isConfigured) {
      setUser(DEMO_USER);
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error };
  };

  const signUp = async (email: string, pass: string, fullName?: string) => {
    if (!supabase || !isConfigured) {
      setUser(DEMO_USER);
      return { error: null };
    }
    const { error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: fullName || "Student Engineer" },
      },
    });
    return { error };
  };

  const signOut = async () => {
    if (supabase && isConfigured) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured,
        isDemoMode: !isConfigured || user?.id === "demo-user-id",
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
