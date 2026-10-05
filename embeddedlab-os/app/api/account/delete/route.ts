/**
 * EmbeddedLab OS — app/api/account/delete/route.ts
 *
 * Secure server-side account deletion endpoint.
 * Requirements:
 *  1. Verifies authenticated identity server-side (via Supabase session cookies or Bearer token).
 *  2. Prevents any client from deleting another student's data.
 *  3. Purges all application records for the verified user (challenge_attempts, lab_progress, simulation_sessions).
 *  4. If SUPABASE_SERVICE_ROLE_KEY is configured in the server environment, permanently deletes the Supabase auth user.
 *  5. Signs out the user session and returns a truthful audit result.
 */
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSupabaseEnv } from "@/lib/supabase/config";

export async function POST(req: Request) {
  const { isConfigured, url } = getSupabaseEnv();
  if (!isConfigured) {
    return NextResponse.json(
      { success: false, error: "Cloud database is not configured in this environment." },
      { status: 400 }
    );
  }

  let user = null;
  const supabase = await createClient();

  // 1. Verify user identity via session cookies
  try {
    const {
      data: { user: cookieUser },
      error: cookieErr,
    } = await supabase.auth.getUser();
    if (!cookieErr && cookieUser) {
      user = cookieUser;
    }
  } catch {
    // Proceed to auth header check
  }

  // 2. Fallback: Verify identity via Bearer token in Authorization header
  if (!user) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      try {
        const {
          data: { user: tokenUser },
          error: tokenErr,
        } = await supabase.auth.getUser(token);
        if (!tokenErr && tokenUser) {
          user = tokenUser;
        }
      } catch {
        // Auth token invalid
      }
    }
  }

  // 3. Reject unauthenticated requests
  if (!user || !user.id || user.id === "demo-user-id") {
    return NextResponse.json(
      {
        success: false,
        error: "Authenticated user session required to perform cloud account deletion.",
      },
      { status: 401 }
    );
  }

  const userId = user.id;

  try {
    // 4. Delete user's application-level records (strictly scoping by server-verified userId)
    await supabase.from("challenge_attempts").delete().eq("user_id", userId);
    await supabase.from("lab_progress").delete().eq("user_id", userId);
    await supabase.from("simulation_sessions").delete().eq("user_id", userId);

    let authDeleted = false;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    // 5. If server-side admin key exists, delete the auth user permanently
    if (serviceRoleKey && serviceRoleKey.length > 10) {
      try {
        const { createClient: createSupabaseJsClient } = await import("@supabase/supabase-js");
        const adminClient = createSupabaseJsClient(url, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        });
        const { error: adminErr } = await adminClient.auth.admin.deleteUser(userId);
        if (!adminErr) {
          authDeleted = true;
        }
      } catch {
        // Admin deletion not available or threw; application records were purged
      }
    }

    // 6. Invalidate active session
    await supabase.auth.signOut();

    return NextResponse.json({
      success: true,
      authDeleted,
      message: authDeleted
        ? "Your account and all associated cloud data have been permanently deleted."
        : "All cloud learning progress, challenge attempts, and simulation records have been erased.",
    });
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Failed to erase cloud account records.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
