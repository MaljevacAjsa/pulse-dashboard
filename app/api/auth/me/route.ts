import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1. Read the session cookie
    const token = request.cookies.get("pulse_session")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated." },
        { status: 401 },
      );
    }

    // 2. Get the secret key
    const secret = process.env.AUTH_SECRET;

    if (!secret) {
      throw new Error("AUTH_SECRET is not configured.");
    }

    const secretKey = new TextEncoder().encode(secret);

    // 3. Verify the JWT
    const { payload } = await jwtVerify(token, secretKey);

    const userId = payload.sub;

    if (!userId) {
      return NextResponse.json({ error: "Invalid session." }, { status: 401 });
    }

    // 4. Find the user in the database
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 401 });
    }

    // 5. Return authenticated user
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Authentication error:", error);

    return NextResponse.json(
      { error: "Invalid or expired session." },
      { status: 401 },
    );
  }
}
