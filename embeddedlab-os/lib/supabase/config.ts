/**
 * EmbeddedLab OS — lib/supabase/config.ts
 * Environment variable checking and safety helpers for Supabase integration.
 */

export interface SupabaseEnvConfig {
  url: string;
  anonKey: string;
  isConfigured: boolean;
}

export function getSupabaseEnv(): SupabaseEnvConfig {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  // Valid configuration requires non-empty strings and a URL prefix
  const isConfigured =
    Boolean(url) &&
    Boolean(anonKey) &&
    url.startsWith("http") &&
    !url.includes("your-supabase-url");

  return {
    url,
    anonKey,
    isConfigured,
  };
}
