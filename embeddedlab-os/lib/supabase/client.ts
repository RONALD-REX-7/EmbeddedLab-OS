/**
 * EmbeddedLab OS — lib/supabase/client.ts
 * Browser Supabase client singleton instantiation. Safe fallback if missing credentials.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./config";

let browserClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient | null {
  const { url, anonKey, isConfigured } = getSupabaseEnv();

  if (!isConfigured) {
    return null;
  }

  if (typeof window === "undefined") {
    return createBrowserClient(url, anonKey);
  }

  if (!browserClient) {
    browserClient = createBrowserClient(url, anonKey);
  }

  return browserClient;
}
