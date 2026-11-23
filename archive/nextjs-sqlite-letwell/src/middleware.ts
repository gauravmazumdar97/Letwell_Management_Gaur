import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const portalPrefixes = ["/tenant", "/landlord", "/admin"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isPortal = portalPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (!isPortal) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    const signIn = new URL("/sign-in", request.url);
    signIn.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signIn);
  }

  const status = token.status as string | undefined;
  if (status === "PENDING") {
    return NextResponse.redirect(new URL("/account/pending", request.url));
  }
  if (status === "REJECTED") {
    return NextResponse.redirect(new URL("/account/rejected", request.url));
  }
  if (status === "SUSPENDED") {
    return NextResponse.redirect(new URL("/account/suspended", request.url));
  }
  if (status !== "APPROVED") {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  const role = token.role as string | undefined;
  if (pathname.startsWith("/tenant") && role !== "TENANT") {
    return NextResponse.redirect(new URL(roleHome(role), request.url));
  }
  if (pathname.startsWith("/landlord") && role !== "LANDLORD") {
    return NextResponse.redirect(new URL(roleHome(role), request.url));
  }
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(roleHome(role), request.url));
  }

  return NextResponse.next();
}

function roleHome(role: string | undefined): string {
  if (role === "ADMIN") return "/admin";
  if (role === "LANDLORD") return "/landlord";
  if (role === "TENANT") return "/tenant";
  return "/";
}

export const config = {
  matcher: ["/tenant/:path*", "/landlord/:path*", "/admin/:path*"],
};
