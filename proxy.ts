import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("pulse_session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    console.error("AUTH_SECRET is not configured.");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const secretKey = new TextEncoder().encode(secret);

    await jwtVerify(token, secretKey);

    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    "/",
    "/analytics/:path*",
    "/transactions/:path*",
    "/customers/:path*",
    "/settings/:path*",
  ],
};
