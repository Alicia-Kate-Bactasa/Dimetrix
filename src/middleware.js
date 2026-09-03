import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Edge-safe middleware (no Prisma / bcrypt imports — those crash the Edge
// runtime on Vercel). Reads the Auth.js v5 JWT session cookie directly with
// the same secret the [...nextauth] handler signs with.
//
// Cookie/secret notes:
// - v5 cookie is `authjs.session-token` (`__Secure-` prefixed over https).
// - The signing secret may live in AUTH_SECRET (v5) or NEXTAUTH_SECRET
//   (legacy). We try both so a project with either one set still verifies.
// - secureCookie is tried as true then false, so local http and Vercel https
//   both work. A legacy `next-auth.session-token` name is tried as fallback.
async function getSessionToken(req) {
  const secrets = [process.env.AUTH_SECRET, process.env.NEXTAUTH_SECRET].filter(Boolean);
  const secretList = secrets.length > 0 ? secrets : [undefined];

  for (const secureCookie of [true, false]) {
    for (const secret of secretList) {
      try {
        const token = await getToken({ req, secret, secureCookie });
        if (token) return token;
      } catch {
        // try next combination
      }
    }
    // Legacy v4 cookie-name fallback (harmless if no such cookie exists)
    for (const secret of secretList) {
      try {
        const token = await getToken({
          req,
          secret,
          secureCookie,
          cookieName: `${secureCookie ? "__Secure-" : ""}next-auth.session-token`,
        });
        if (token) return token;
      } catch {
        // try next combination
      }
    }
  }
  return null;
}

export async function middleware(req) {
  const { nextUrl } = req;

  let token = null;
  try {
    token = await getSessionToken(req);
  } catch {
    token = null;
  }
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
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
