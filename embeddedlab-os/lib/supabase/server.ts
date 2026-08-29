/**
 * EmbeddedLab OS — lib/supabase/server.ts
 * Server-side Supabase client for use in Server Components, Route Handlers,
 * and Server Actions. Uses cookies for session management and getSupabaseEnv().
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./config";

export async function createClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = getSupabaseEnv();

  return createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // setAll may be called from a Server Component where cookies are read-only.
            // This is safe to ignore when middleware is handling session refresh.
          }
        },
      },
    }
  );
}
