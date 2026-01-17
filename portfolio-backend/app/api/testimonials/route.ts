// app/api/testimonials/route.ts

export const runtime = "nodejs";
console.log("✅ /api/testimonials route loaded");

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";

/* =========================
   CREATE TESTIMONIAL (ADMIN)
========================= */
export async function POST(req: Request) {
  console.log("🔥 POST /api/testimonials HIT");

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
    name,
    role,
    company,
    content,
    avatarUrl,
    rating,
    featured,
  } = body;

  /* ======================
     3️⃣ Validate required fields
  ====================== */
  if (!name || !role || !company || !content) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  /* ======================
     4️⃣ Create testimonial
  ====================== */
  const testimonial = await prisma.testimonial.create({
    data: {
      name,
      role,
      company,
      content,
      avatarUrl,
      rating: rating ?? 5,
      featured: featured ?? false,
    },
  });

  return NextResponse.json(testimonial, { status: 201 });
}

/* =========================
   LIST TESTIMONIALS (PUBLIC)
========================= */
export async function GET(req: Request) {
  /* ======================
     5️⃣ Parse query params
  ====================== */
  const { searchParams } = new URL(req.url);
  const featured = searchParams.get("featured") === "true";

  /* ======================
     6️⃣ Build where clause
  ====================== */
  const where: any = {};
  if (featured) where.featured = true;

  /* ======================
     7️⃣ Fetch testimonials
  ====================== */
  const testimonials = await prisma.testimonial.findMany({
    where,
    orderBy: [
      { orderIndex: "asc" },
      { createdAt: "desc" },
    ],
  });

  /* ======================
     8️⃣ Return clean response
  ====================== */
  return NextResponse.json({
    data: testimonials.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      content: t.content,
      avatar_url: t.avatarUrl,
      rating: t.rating,
      featured: t.featured,
      created_at: t.createdAt,
    })),
  });
}
