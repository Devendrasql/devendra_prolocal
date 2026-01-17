// app/api/case-studies/[slug]/route.ts

export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";

/* =========================
   GET CASE STUDY BY SLUG (PUBLIC)
========================= */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const caseStudy = await prisma.caseStudy.findUnique({
    where: { slug },
    include: {
      tags: { include: { tag: true } },
    },
  });

  if (!caseStudy) {
    return NextResponse.json(
      { error: "Case study not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    data: {
      id: caseStudy.id,
      title: caseStudy.title,
      slug: caseStudy.slug,
      company: caseStudy.company,
      role: caseStudy.role,
      duration: caseStudy.duration,
      overview: caseStudy.overview,
      challenge: caseStudy.challenge,
      solution: caseStudy.solution,
      impact: caseStudy.impact,
      image_url: caseStudy.imageUrl,
      tags: caseStudy.tags.map((t) => t.tag.name),
      metrics: caseStudy.metrics,
      featured: caseStudy.featured,
      published: caseStudy.published,
    },
  });
}

/* =========================
   UPDATE CASE STUDY (ADMIN)
========================= */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const { slug } = await params;

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

  const safeTags: string[] = Array.isArray(tags)
    ? tags.filter((t): t is string => typeof t === "string")
    : [];

  const caseStudy = await prisma.caseStudy.update({
    where: { slug },
    data: {
      ...(title && { title }),
      ...(company && { company }),
      ...(role && { role }),
      ...(duration && { duration }),
      ...(overview && { overview }),
      ...(challenge && { challenge }),
      ...(solution && { solution }),
      ...(impact && { impact }),
      ...(imageUrl !== undefined && { imageUrl }),
      ...(metrics !== undefined && { metrics }),
      ...(featured !== undefined && { featured }),
      ...(published !== undefined && { published }),
      ...(safeTags.length > 0 && {
        tags: {
          deleteMany: {},
          create: safeTags.map((name) => ({
            tag: {
              connectOrCreate: {
                where: { name },
                create: { name },
              },
            },
          })),
        },
      }),
    },
    include: {
      tags: { include: { tag: true } },
    },
  });

  return NextResponse.json({ data: caseStudy });
}

/* =========================
   DELETE CASE STUDY (ADMIN)
========================= */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const denied = await adminGuard(req);
  if (denied) return denied;

  const { slug } = await params;

  await prisma.caseStudy.delete({
    where: { slug },
  });

  return NextResponse.json({ success: true });
}
