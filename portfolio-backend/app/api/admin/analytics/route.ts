// app/api/admin/analytics/route.ts

export const runtime = "nodejs";

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/adminGuard";

export async function GET(req: Request) {
  /* ======================
     Admin-only
  ====================== */

  const denied = await adminGuard(req);
  if (denied) return denied;

  /* ======================
     Fetch analytics
  ====================== */

  const [
    totalProjects,
    featuredProjects,
    totalViewsAgg,
    topProjects,
    rawDailyViews,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { featured: true } }),
    prisma.project.aggregate({
      _sum: { views: true },
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: [
        { featured: "desc" },
        { ranking: { score: "desc" } },
      ],
      select: {
        id: true,
        title: true,
        views: true,
        featured: true,
        ranking: {
          select: { score: true },
        },
      },
    }),
    prisma.$queryRaw<
      { date: Date; views: bigint }[]
    >`
      SELECT
        DATE("createdAt") as date,
        COUNT(*) as views
      FROM "ProjectView"
      GROUP BY DATE("createdAt")
      ORDER BY DATE("createdAt") ASC
    `,
  ]);

  /* ======================
     FIX: normalize BigInt
     WHY: JSON cannot serialize BigInt
  ====================== */

  const dailyViews = rawDailyViews.map((row) => ({
    date: row.date.toISOString().slice(0, 10),
    views: Number(row.views),
  }));

  const totalViews = Number(totalViewsAgg._sum.views ?? 0);

  return NextResponse.json({
    totals: {
      projects: totalProjects,
      featured: featuredProjects,
      views: totalViews,
    },
    topProjects: topProjects.map((p) => ({
      ...p,
      ranking: {
        score: p.ranking?.score ?? 0,
      },
    })),
    dailyViews,
  });
}
