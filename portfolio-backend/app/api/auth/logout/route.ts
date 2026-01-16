// app/api/auth/logout/route.ts

/* ======================
   REQUIRED for Prisma
   WHY: Prisma does NOT run in Edge runtime
====================== */
export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  /* ======================
       1️⃣ Read refresh token SAFELY
       CHANGE: replaced manual regex parsing
       WHY: cookies() handles encoding, ordering, multiple cookies
    ====================== */
    
  // const refreshToken = req.headers
  //   .get("cookie")
  //   ?.match(/refreshToken=([^;]+)/)?.[1];

  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;


  /* ======================
       2️⃣ Revoke refresh token in DB
       WHY: Prevent reuse of stolen token
       NOTE: deleteMany is safe even if token does not exist
    ====================== */

  if (refreshToken) {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  /* ======================
     3️⃣ Clear cookie in browser
     WHY: Client must lose refresh capability
  ====================== */
  const res = NextResponse.json({ success: true });
  res.cookies.delete("refreshToken");

  return res;
}
