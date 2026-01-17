// app/api/certifications/route.ts

export const runtime = "nodejs";
console.log("✅ /api/certifications route loaded");

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";

/* =========================
   CREATE CERTIFICATION (ADMIN)
========================= */
export async function POST(req: Request) {
  console.log("🔥 POST /api/certifications HIT");

  /* ======================
     1️⃣ Admin authorization
  ====================== */
  const denied = await adminGuard(req);
  if (denied) return denied;

  /* ======================
     2️⃣ Parse JSON body SAFELY
  ====================== */
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const {
    title,
    issuer,
    date,
    credentialUrl,
    imageUrl,
  } = body;

  /* ======================
     3️⃣ Validate required fields
  ====================== */
  if (!title || !issuer || !date) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  /* ======================
     4️⃣ Create certification
  ====================== */
  const certification = await prisma.certification.create({
    data: {
      title,
      issuer,
      date,
      credentialUrl,
      imageUrl,
    },
  });

  return NextResponse.json(certification, { status: 201 });
}

/* =========================
   LIST CERTIFICATIONS (PUBLIC)
========================= */
export async function GET() {
  /* ======================
     5️⃣ Fetch certifications
  ====================== */
  const certifications = await prisma.certification.findMany({
    orderBy: [
      { orderIndex: "asc" },
      { createdAt: "desc" },
    ],
  });

  /* ======================
     6️⃣ Return clean response
  ====================== */
  return NextResponse.json({
    data: certifications.map((c) => ({
      id: c.id,
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      credential_url: c.credentialUrl,
      image_url: c.imageUrl,
      created_at: c.createdAt,
    })),
  });
}
