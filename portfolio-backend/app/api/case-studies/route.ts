// app/api/case-studies/route.ts

export const runtime = "nodejs";
console.log("✅ /api/case-studies route loaded");

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";

/* =========================
   CREATE CASE STUDY (ADMIN)
========================= */
export async function POST(req: Request) {
  console.log("🔥 POST /api/case-studies HIT");

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
    slug,
    company,
    role,
    duration,
    overview,
    challenge,
    solution,
    impact,
    imageUrl,
    metrics,
    featured,
    published,
    tags,
  } = body;

  /* ======================
     3️⃣ Validate required fields
  ====================== */
  if (!title || !slug || !company || !role || !duration || !overview || !challenge || !solution || !impact) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  /* ======================
     4️⃣ Normalize tags
  ====================== */
  const safeTags: string[] = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === "string")
    : [];

  /* ======================
     5️⃣ Create case study
  ====================== */
  const caseStudy = await prisma.caseStudy.create({
    data: {
      title,
      slug,
      company,
      role,
      duration,
      overview,
      challenge,
      solution,
      impact,
      imageUrl,
      metrics: metrics || {},
      featured: featured ?? false,
      published: published ?? false,
      tags: {
        create: safeTags.map((name) => ({
          tag: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
    },
    include: {
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json(caseStudy, { status: 201 });
}

/* =========================
   LIST CASE STUDIES (PUBLIC)
========================= */
export async function GET(req: Request) {
  /* ======================
     6️⃣ Parse query params
  ====================== */
  const { searchParams } = new URL(req.url);
  const published = searchParams.get("published") === "true";
  const featured = searchParams.get("featured") === "true";

  /* ======================
     7️⃣ Build where clause
  ====================== */
  const where: any = {};
  if (published) where.published = true;
  if (featured) where.featured = true;

  /* ======================
     8️⃣ Fetch case studies
  ====================== */
  const caseStudies = await prisma.caseStudy.findMany({
    where,
    include: {
      tags: { include: { tag: true } },
    },
    orderBy: [
      { orderIndex: "asc" },
      { createdAt: "desc" },
    ],
  });

  /* ======================
     9️⃣ Return clean response
  ====================== */
  return NextResponse.json({
    data: caseStudies.map((cs) => ({
      id: cs.id,
      title: cs.title,
      slug: cs.slug,
      company: cs.company,
      role: cs.role,
      duration: cs.duration,
      overview: cs.overview,
      challenge: cs.challenge,
      solution: cs.solution,
      impact: cs.impact,
      image_url: cs.imageUrl,
      tags: cs.tags.map((t) => t.tag.name),
      metrics: cs.metrics,
      featured: cs.featured,
      published: cs.published,
      created_at: cs.createdAt,
    })),
  });
}
