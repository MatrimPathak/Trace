import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";

const PROTECTED_PREFIXES = ["/home", "/tasks", "/search", "/settings", "/mcp"];
const PUBLIC_ONLY = ["/login"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isPublicOnly = PUBLIC_ONLY.includes(pathname);

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (isProtected && !session) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isPublicOnly && session) {
    const url = request.nextUrl.clone();
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/home/:path*",
    "/tasks/:path*",
    "/search/:path*",
    "/settings/:path*",
    "/mcp/:path*",
    "/login",
  ],
};
