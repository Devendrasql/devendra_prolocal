// app/api/projects/[id]/route.ts
export const runtime = "nodejs";

console.log("✅2 /api/projects/[id] route loaded");

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";

/* =========================
   GET PROJECT BY ID
========================= */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params; // ✅ REQUIRED
  const projectId = Number(id);

  if (isNaN(projectId)) {
    return NextResponse.json(
      { error: "Invalid project id" },
      { status: 400 }
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      tags: { include: { tag: true } },
      ranking: true,
      // _count: { select: { viewsList: true } },
    },
  });

  if (!project) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...project,
    // views: project._count.viewsList,
  });
}

/* =========================
   UPDATE PROJECT
========================= */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log("🔥 PUT /api/projects/[id] HIT");

  const denied = await adminGuard(req);
  if (denied) return denied;

  const { id } = await context.params; // ✅ REQUIRED
  const projectId = Number(id);

  if (isNaN(projectId)) {
    return NextResponse.json(
      { error: "Invalid project id" },
      { status: 400 }
    );
  }

  const {
    title,
    summary,
    content,
    featured,
    tags = [],
    editorialRank,
  } = await req.json();

  const result = await prisma.$transaction(async (tx) => {
    const project = await tx.project.update({
      where: { id: projectId },
      data: { title, summary, content, featured },
    });

    await tx.projectTag.deleteMany({ where: { projectId } });

    for (const tagName of tags) {
      const tag = await tx.tag.upsert({
        where: { name: tagName },
        update: {},
        create: { name: tagName },
      });

      await tx.projectTag.create({
        data: { projectId, tagId: tag.id },
      });
    }

    if (typeof editorialRank === "number") {
      await tx.projectRanking.update({
        where: { projectId },
        data: { editorialRank },
      });
    }

    return project;
  });

  return NextResponse.json(result);
}

/* =========================
   DELETE PROJECT
========================= */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  console.log("🔥 DELETE /api/projects/[id] HIT");

  const denied = await adminGuard(req);
  if (denied) return denied;

  const { id } = await context.params; // ✅ REQUIRED
  const projectId = Number(id);

  if (isNaN(projectId)) {
    return NextResponse.json(
      { error: "Invalid project id" },
      { status: 400 }
    );
  }

  await prisma.project.delete({
    where: { id: projectId },
  });

  return NextResponse.json({ success: true });
}
