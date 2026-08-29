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
  let url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim().replace(/\/+$/, "");
  // If user pasted /rest/v1 at the end of the project URL, strip it to maintain standard base URL
  url = url.replace(/\/rest\/v1\/?$/, "");

  const anonKey = (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    ""
  ).trim();

  // Valid configuration requires non-empty strings, http(s) protocol, and non-placeholder values
  const isConfigured =
    Boolean(url) &&
    Boolean(anonKey) &&
    url.startsWith("http") &&
    !url.includes("your-supabase-url") &&
    !url.includes("your-project.supabase.co") &&
    anonKey.length > 10;

  return {
    url,
    anonKey,
    isConfigured,
  };
}
