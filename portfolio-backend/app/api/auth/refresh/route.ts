// app/api/auth/refresh/route.ts

export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import {
  signAccessToken,
  verifyRefreshToken,
  assertRole,
} from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {

  /* ======================
     1️⃣ Read refresh token SAFELY
     CHANGE: replaced regex cookie parsing
     WHY: cookies() is reliable and Next.js-native
  ====================== */
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json(
      { error: "No refresh token" },
      { status: 401 }
    );
  }

  /* ======================
     2️⃣ Verify refresh token cryptographically
     WHY: Ensure token signature + expiry
  ====================== */
  try {
    verifyRefreshToken(refreshToken);
  } catch {
    return NextResponse.json(
      { error: "Invalid refresh token" },
      { status: 401 }
    );
  }

  /* ======================
     3️⃣ Validate refresh token in database
     WHY: Prevent replay attacks
  ====================== */
  const stored = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: {
      user: {
        include: { role: true },
      },
    },
  });

  if (!stored || stored.expiresAt < new Date()) {
    return NextResponse.json(
      { error: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }

  /* ======================
     4️⃣ Validate role SAFELY
     CHANGE: wrapped assertRole in try/catch
     WHY: Prevent server crash on bad data
  ====================== */
  let role;
  try {
    role = assertRole(stored.user.role?.name);
  } catch {
    return NextResponse.json(
      { error: "Invalid user role" },
      { status: 403 }
    );
  }

  /* ======================
     5️⃣ Issue new access token
     WHY: Refresh token stays same
  ====================== */
  const accessToken = signAccessToken(
    stored.user.id,
    role
  );

  return NextResponse.json({ accessToken });
}
