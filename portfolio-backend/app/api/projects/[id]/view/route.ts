// app/api/projects/[id]/view/route.ts

export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const VIEW_COOLDOWN_MINUTES = 10;

export async function POST(
  req: Request,
  //  { params }: { params: { id: string } }
  context: { params: Promise<{ id: string }> }
) {
  /* ======================
     1️⃣ Parse & validate project ID
     CHANGE: params is NOT a Promise
     WHY: App Router contract
  ====================== */
  const { id } = await context.params;
  const projectId = Number(id);

  if (isNaN(projectId)) {
    return NextResponse.json(
      { error: "Invalid project id" },
      { status: 400 }
    );
  }

  /* ======================
     2️⃣ Ensure project exists
     CHANGE: added existence check
     WHY: prevent Prisma errors + bad analytics
  ====================== */
  const projectExists = await prisma.project.findUnique({
    where: { id: projectId },
    select: { id: true },
  });

  if (!projectExists) {
    return NextResponse.json(
      { error: "Project not found" },
      { status: 404 }
    );
  }

  /* ======================
     3️⃣ Normalize IP address
     CHANGE: improved fallback
     WHY: avoid global cooldown collisions
  ====================== */
  
  // const forwardedFor = req.headers.get("x-forwarded-for");
  // const ip =
  //   forwardedFor?.split(",")[0]?.trim() ||
  //   req.headers.get("x-real-ip") ||
  //   `unknown-${projectId}`;
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const userAgent = req.headers.get("user-agent") ?? "unknown";

  /* ======================
     4️⃣ Calculate cooldown window
  ====================== */
  const cooldownFrom = new Date(
    Date.now() - VIEW_COOLDOWN_MINUTES * 60 * 1000
  );

  /* ======================
     5️⃣ Check cooldown
     WHY: prevent view spam
  ====================== */
  const recentView = await prisma.projectView.findFirst({
    where: {
      projectId,
      ip,
      createdAt: { gte: cooldownFrom },
    },
  });

  if (recentView) {
    return NextResponse.json({
      success: true,
      skipped: true,
      reason: "Cooldown active",
    });
  }

  /* ======================
     6️⃣ Count view (atomic)
     WHY: keep views + analytics consistent
  ====================== */
  await prisma.$transaction(async (tx) => {
    await tx.projectView.create({
      data: {
        projectId,
        ip,
        userAgent,
      },
    });

    await tx.project.update({
      where: { id: projectId },
      data: {
        views: { increment: 1 },
      },
    });
  });

  return NextResponse.json({
    success: true,
    counted: true,
  });
}
