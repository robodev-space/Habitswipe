import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;
    const host = req.headers.get("host") || "";

    // ── SUBDOMAIN DETECTION ──────────────────────────────────────────────────
    // Extract subdomain (e.g., 'habitswipe' from 'habitswipe.100focus.com')
    // We also support 'habitswipe.localhost:3000' for local testing
    const chunks = host.split(".");
    const subdomain = chunks.length > 2 || (chunks.length === 2 && host.includes("localhost")) 
      ? chunks[0] 
      : null;

    const isHabitSwipeSubdomain = subdomain === "habitswipe";

    // ── SUBDOMAIN REWRITES ───────────────────────────────────────────────────
    // If on habitswipe subdomain and accessing root, show product landing page
    if (isHabitSwipeSubdomain && pathname === "/") {
      return NextResponse.rewrite(new URL("/(product)/habitswipe", req.url));
    }

    // ── AUTHENTICATED REDIRECTS ──────────────────────────────────────────────
    // If user is logged in, redirect away from public auth pages
    const isAuthPage = pathname === "/login" || pathname === "/register";
    const isLandingPage = pathname === "/";
    const isOnboardingPage = pathname === "/onboarding";

    if (token && (isAuthPage || isLandingPage)) {
      // If onboarding not complete, send to onboarding
      if (!token.onboardingComplete) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
      return NextResponse.redirect(new URL("/today", req.url));
    }

    // ── ONBOARDING GATE ──────────────────────────────────────────────────────
    // If user is logged in but hasn't completed onboarding, redirect to /onboarding
    if (token && !isOnboardingPage && !isAuthPage && !isLandingPage) {
      if (!token.onboardingComplete) {
        return NextResponse.redirect(new URL("/onboarding", req.url));
      }
    }

    // If user completed onboarding and tries to go back to /onboarding, redirect to /today
    if (token && isOnboardingPage && token.onboardingComplete) {
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
        const publicRoutes = ["/", "/login", "/register", "/(product)/habitswipe"];
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
