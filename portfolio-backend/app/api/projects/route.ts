// app/api/projects/route.ts

export const runtime = "nodejs";
console.log("✅ /api/projects route loaded");

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";

/* =========================
   CREATE PROJECT (ADMIN)
========================= */
export async function POST(req: Request) {

  console.log("🔥 POST /api/projects HIT");

  /* ======================
     1️⃣ Admin authorization
     WHY: Only admins can create projects
  ====================== */
  const denied = await adminGuard(req);
  if (denied) return denied;

  /* ======================
     2️⃣ Parse JSON body SAFELY
     CHANGE: wrapped in try/catch
     WHY: req.json() throws on invalid JSON
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

  const { title, summary, content, featured, tags } = body;

  /* ======================
     3️⃣ Validate required fields
     WHY: Prevent bad data in DB
  ====================== */
  if (!title || !summary) {
    return NextResponse.json(
      { error: "Title and summary required" },
      { status: 400 }
    );
  }

  /* ======================
     4️⃣ Normalize tags
     CHANGE: ensure array of strings
     WHY: Prevent Prisma runtime errors
  ====================== */
  const safeTags: string[] = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === "string")
    : [];

  /* ======================
     5️⃣ Create project + relations
  ====================== */
  const project = await prisma.project.create({
    data: {
      title,
      summary,
      content,
      featured: featured ?? false,
      ranking: { create: {} },
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
      ranking: true,
    },
  });

  return NextResponse.json(project, { status: 201 });
}

/* =========================
   LIST PROJECTS (PUBLIC)
========================= */
export async function GET(req: Request) {

  /* ======================
     6️⃣ Parse pagination SAFELY
     CHANGE: clamp page & limit
     WHY: Prevent abuse & DB stress
  ====================== */
  const { searchParams } = new URL(req.url);

  const page = Math.max(
    1,
    Number(searchParams.get("page") ?? 1)
  );

  const limit = Math.min(
    50,
    Math.max(1, Number(searchParams.get("limit") ?? 10))
  );

  /* ======================
     7️⃣ Fetch ranked projects
  ====================== */
  const projects = await prisma.project.findMany({
    skip: (page - 1) * limit,
    take: limit,
    include: {
      tags: { include: { tag: true } },
      ranking: true,
    },
    orderBy: [
      { featured: "desc" },
      { ranking: { score: "desc" } },
      { createdAt: "desc" },
    ],
  });

  /* ======================
     8️⃣ Return clean response
     WHY: Avoid leaking DB internals
  ====================== */
  return NextResponse.json({
    page,
    limit,
    data: projects.map((p) => ({
      id: p.id,
      title: p.title,
      summary: p.summary,
      featured: p.featured,
      views: p.views,
      score: p.ranking?.score ?? 0,
      tags: p.tags.map((t) => t.tag.name),
    })),
  });
}
