// lib/auth.ts
import jwt, { JwtPayload } from "jsonwebtoken";

/* ======================
   Env helpers
====================== */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not defined`);
  }
  return value;
}

const ACCESS_SECRET = requireEnv("JWT_ACCESS_SECRET");
const REFRESH_SECRET = requireEnv("JWT_REFRESH_SECRET");

/* ======================
   Role Types
====================== */

export const ROLES = ["ADMIN", "USER"] as const;
export type AppRole = typeof ROLES[number];

export function assertRole(role: string): AppRole {
  if (ROLES.includes(role as AppRole)) {
    return role as AppRole;
  }
  throw new Error(`Invalid role: ${role}`);
}

/* ======================
   JWT Payload Types
====================== */

export interface AccessTokenPayload extends JwtPayload {
  sub: string;
  role: AppRole;
}

/* ======================
   Token creators
====================== */

export function signAccessToken(
  userId: number,
  role: AppRole
): string {
  return jwt.sign(
    { role },
    ACCESS_SECRET,
    {
      subject: userId.toString(),
      expiresIn: "15m",
    }
  );
}

export function signRefreshToken(userId: number): string {
  return jwt.sign(
    {},
    REFRESH_SECRET,
    {
      subject: userId.toString(),
      expiresIn: "7d",
    }
  );
}

/* ======================
   Token verifiers
====================== */

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded = jwt.verify(token, ACCESS_SECRET);

  if (
    typeof decoded !== "object" ||
    !decoded.sub ||
    typeof decoded.sub !== "string" ||
    !("role" in decoded) ||
    !ROLES.includes(decoded.role as AppRole)
  ) {
    throw new Error("Invalid access token");
  }

  return decoded as unknown as AccessTokenPayload;
}

export function verifyRefreshToken(
  token: string
): { sub: string } {
  const decoded = jwt.verify(token, REFRESH_SECRET);

  if (
    typeof decoded !== "object" ||
    !decoded.sub ||
    typeof decoded.sub !== "string"
  ) {
    throw new Error("Invalid refresh token");
  }

  return { sub: decoded.sub };
}
