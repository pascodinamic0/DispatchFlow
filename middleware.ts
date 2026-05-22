import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PREFIXES = [
  "/",
  "/login",
  "/signup",
  "/auth",
  "/onboarding",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
] as const;

function isPublicPath(pathname: string) {
  return PUBLIC_PREFIXES.some(
    (prefix) =>
      pathname === prefix ||
      (prefix !== "/" && pathname.startsWith(`${prefix}/`)),
  );
}

/** Supabase SSR stores session chunks as sb-<ref>-auth-token(.N)? */
function hasSupabaseSession(request: NextRequest) {
  return request.cookies.getAll().some(
    ({ name }) => name.startsWith("sb-") && name.includes("auth-token"),
  );
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasSession = hasSupabaseSession(request);

  if (!hasSession && !isPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (
    hasSession &&
    (pathname === "/login" || pathname === "/signup" || pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api(?:/|$)|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
