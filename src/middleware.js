import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Lightweight Edge-safe auth instance: only authConfig (secret + JWT
// callbacks), no Prisma adapter. Importing "@/lib/auth" here would pull
// PrismaClient into the Edge runtime and crash the middleware on Vercel.
const { auth } = NextAuth(authConfig);

// Auth.js v5 middleware. Uses the same secret + JWT handling as the
// [...nextauth] route handler, so a session created at login is correctly
// recognized here.
//
// The previous implementation used `getToken` from `next-auth/jwt` with an
// explicit `NEXTAUTH_SECRET`. In v5 the session cookie is `authjs.session-token`
// (secure-prefixed in production) and the secret env is `AUTH_SECRET` —
// `getToken` with old defaults never found the token, so `isLoggedIn` was
// always false in production and /dashboard bounced straight back to /login
// after a successful sign-in.
export default auth((req) => {
  const { nextUrl } = req;

  const token = req.auth;
  const isLoggedIn = !!token;
  const isAdmin = isLoggedIn && token.role === "admin";

  // Public page routes (accessible without auth)
  const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isPublicPath = publicPaths.some((p) => nextUrl.pathname.startsWith(p));

  // Landing page is public too
  const isLanding = nextUrl.pathname === "/";

  const isApiAuth = nextUrl.pathname.startsWith("/api/auth");
  const isApiRegister = nextUrl.pathname === "/api/register";
  const isApiIncidentsGet = nextUrl.pathname.startsWith("/api/incidents") && req.method === "GET";
  const isApi = nextUrl.pathname.startsWith("/api");

  // Admin-only page routes
  const protectedPages = ["/dashboard", "/admin", "/analytics", "/report"];
  const isProtectedPage = protectedPages.some((p) => nextUrl.pathname.startsWith(p));

  // Always allow auth API routes and registration
  if (isApiAuth || isApiRegister) return NextResponse.next();

  // Allow GET requests to incidents API without auth (public data)
  if (isApiIncidentsGet) return NextResponse.next();

  // Protect other API routes
  if (isApi && !isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Admin-only pages: require admin role (redirect logged-in non-admins to dashboard)
  if ((nextUrl.pathname.startsWith("/admin") || nextUrl.pathname.startsWith("/analytics")) && isLoggedIn && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect authenticated users away from auth pages and the landing page
  if ((isPublicPath || isLanding) && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  // Redirect unauthenticated users to login (preserve destination)
  if (isProtectedPage && !isLoggedIn) {
    const loginUrl = new URL("/login", nextUrl);
    if (nextUrl.pathname !== "/login") {
      loginUrl.searchParams.set("returnTo", nextUrl.pathname + nextUrl.search);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
