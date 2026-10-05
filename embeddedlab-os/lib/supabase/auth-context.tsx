/**
 * EmbeddedLab OS — lib/supabase/auth-context.tsx
 * React Context Provider managing Supabase Authentication and Demo Mode fallback.
 */
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { createClient } from "./client";
import { getSupabaseEnv } from "./config";
import { hydrateUserProgressFromSupabase } from "./db";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isConfigured: boolean;
  isAuthenticated: boolean;
  isDemoMode: boolean;
  enterDemoMode: () => void;
  signIn: (email: string, pass: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, pass: string, fullName?: string) => Promise<{ data?: { user: User | null; session: Session | null }; error: Error | null }>;
  signOut: () => Promise<void>;
}

const DEMO_USER: User = {
  id: "demo-user-id",
  app_metadata: {},
  user_metadata: { full_name: "Guest Student" },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  email: "",
} as User;

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isLoading: true,
  isConfigured: false,
  isAuthenticated: false,
  isDemoMode: true,
  enterDemoMode: () => {},
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isConfigured } = getSupabaseEnv();
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isConfigured);

  const supabase = createClient();

  useEffect(() => {
    if (!isConfigured || !supabase) {
      return;
    }

    // Get current session on initial render
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session);
      setUser(session?.user ?? DEMO_USER);
      setIsLoading(false);
      if (session?.user?.id) {
        hydrateUserProgressFromSupabase(session.user.id).catch(() => {});
      }
    });

    // Listen to Auth state changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(session);
      setUser(session?.user ?? DEMO_USER);
      setIsLoading(false);
      if (session?.user?.id) {
        hydrateUserProgressFromSupabase(session.user.id).catch(() => {});
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured, supabase]);

  const isAuthenticated = Boolean(session?.user && user && user.id !== "demo-user-id");
  const isDemoMode = !isAuthenticated;

  const enterDemoMode = () => {
    setUser(DEMO_USER);
    setSession(null);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("embeddedlab_demo_active", "true");
    }
  };

  const signIn = async (email: string, pass: string) => {
    if (!supabase || !isConfigured) {
      enterDemoMode();
      return { error: null };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    return { error };
  };

  const signUp = async (email: string, pass: string, fullName?: string) => {
    if (!supabase || !isConfigured) {
      enterDemoMode();
      return { data: { user: DEMO_USER, session: null }, error: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: { full_name: fullName || "Student Engineer" },
      },
    });
    return { data, error };
  };

  const signOut = async () => {
    if (supabase && isConfigured) {
      try {
        await supabase.auth.signOut();
      } catch {
        // Ignore network failure during sign-out
      }
    }
    enterDemoMode();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        isConfigured,
        isAuthenticated,
        isDemoMode,
        enterDemoMode,
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
