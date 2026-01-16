//portfolio-backend/app/api/auth/login/route.ts

export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import {
  signAccessToken,
  signRefreshToken,
  assertRole,
} from "@/lib/auth";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    /* ======================
       1️⃣ Parse request body
       WHY: Avoid undefined values early
    ====================== */
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    /* ======================
       2️⃣ Find user + role
       WHY: Role is required for token claims
    ====================== */
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true },
    });

    if (!user) {
      // ❗ Do NOT reveal which field was wrong
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    /* ======================
       3️⃣ Verify password
       WHY: bcrypt.compare is timing-safe
    ====================== */
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    /* ======================
       4️⃣ Validate role SAFELY
       WHY: assertRole throws on bad data
       FIX: prevent server crash
    ====================== */
    let role;
    try {
      role = assertRole(user.role?.name);
    } catch {
      return NextResponse.json(
        { error: "Invalid user role" },
        { status: 403 }
      );
    }

    /* ======================
       5️⃣ Issue tokens
       WHY: Access = short lived
            Refresh = httpOnly cookie
    ====================== */
    const accessToken = signAccessToken(user.id, role);
    const refreshToken = signRefreshToken(user.id);

    /* ======================
       6️⃣ Rotate refresh tokens (SAFE)
       WHY: Prevent token reuse attacks
       FIX: interactive transaction
    ====================== */
    await prisma.$transaction(async (tx) => {
      await tx.refreshToken.deleteMany({
        where: { userId: user.id },
      });

      await tx.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ),
        },
      });
    });

    /* ======================
       7️⃣ Send response + cookie
       WHY: Refresh token must be httpOnly
    ====================== */
    const res = NextResponse.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        role,
      },
    });

    res.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return res;

  } catch (err) {
    // ❗ Catch-all protection — should never leak internals
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
