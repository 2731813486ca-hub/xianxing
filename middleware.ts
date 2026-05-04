import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth-edge";

const protectedRoutes = ["/upload", "/settings", "/profile/me", "/admin"];
const authRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("session")?.value;
  let userId: string | null = null;
  if (token) {
    const payload = await verifyToken(token);
    userId = payload?.userId ?? null;
  }

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuth = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuth && userId) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/upload/:path*",
    "/settings/:path*",
    "/profile/me/:path*",
    "/admin/:path*",
    "/login",
    "/register",
  ],
};
