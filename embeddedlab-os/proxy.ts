import { NextResponse } from "next/server";

/**
 * EmbeddedLab OS — proxy.ts
 * Passthrough server proxy stub (Next.js 16+ convention).
 * Authentication protection and session checks will be implemented in Phase 10.
 */
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
