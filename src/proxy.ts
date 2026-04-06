import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/auth-token";
import { adminCookieName } from "@/lib/constants";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsProtection =
    (pathname.startsWith("/admin") && pathname !== "/admin/login") || pathname.startsWith("/api/admin");

  if (!needsProtection) {
    return NextResponse.next();
  }

  const token = request.cookies.get(adminCookieName)?.value;
  if (!token) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const session = await verifyAdminToken(token);
  if (!session) {
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
