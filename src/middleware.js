import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const { nextUrl } = req;

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isLoggedIn = !!token;

  const publicPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isPublicPath = publicPaths.some((p) => nextUrl.pathname.startsWith(p));
  const isApiAuth = nextUrl.pathname.startsWith("/api/auth");
  const isApiRegister = nextUrl.pathname === "/api/register";
  const isApiIncidentsGet = nextUrl.pathname.startsWith("/api/incidents") && req.method === "GET";
  const isApi = nextUrl.pathname.startsWith("/api");

  // Always allow auth API routes and registration
  if (isApiAuth || isApiRegister) return NextResponse.next();

  // Allow GET requests to incidents API without auth (public data)
  if (isApiIncidentsGet) return NextResponse.next();

  // Protect other API routes
  if (isApi && !isLoggedIn) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Redirect authenticated users away from auth pages
  if (isPublicPath && isLoggedIn) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // Redirect unauthenticated users to login
  if (!isPublicPath && !isApi && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
