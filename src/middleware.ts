import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";

const PUBLIC_PATHS = ["/login", "/register"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  const isApiPath = pathname.startsWith("/api/");
  const isApiAuth = pathname.startsWith("/api/auth/");

  // Allow public auth API routes always
  if (isApiAuth) return NextResponse.next();

  const session = await getSessionFromRequest(req);

  // Redirect authenticated users away from login/register
  if (isPublicPath && session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Redirect unauthenticated users to login (except public paths and API)
  if (!isPublicPath && !isApiPath && !session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect API routes (return 401 instead of redirect)
  if (isApiPath && !session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};