//import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  //console.log(pathname);

  const publicRoutes = [
    "/login",
    "/register",
    "/api/auth",
    "/favicon.ico",
    "_next",
  ];
  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }
  //const token = await getToken({ req, secret: process.env.AUTH_SECRET });
  // upto next-auth 4.0 we use getToken but in new version 5.0 we use session from auth
  const session = await auth();
  //  return NextResponse.next();

  //if (!token) {
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const role = session.user?.role; // token.role;
  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/unauthorised", req.url));
  }

  if (pathname.startsWith("/delivery") && role !== "deliveryman") {
    return NextResponse.redirect(new URL("/unauthorised", req.url));
  }
  if (pathname.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorised", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internals)
     * - .*\\..* (static files like favicon.ico, .png, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
