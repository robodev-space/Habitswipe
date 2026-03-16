import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    debugger
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // ── AUTHENTICATED REDIRECTS ──────────────────────────────────────────────
    // If user is logged in, redirect away from public auth pages
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isLandingPage = pathname === "/";

    if (token && (isAuthPage || isLandingPage)) {
      return NextResponse.redirect(new URL("/today", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // ── PUBLIC ROUTES ───────────────────────────────────────────────────
        // These can be accessed without a session
        const publicRoutes = ["/", "/login", "/register"];
        if (publicRoutes.includes(pathname)) return true;

        // ── PROTECTED ROUTES ────────────────────────────────────────────────
        // Require a valid session token
        return !!token;
      },
    },
  }
);

// Matcher controls which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
