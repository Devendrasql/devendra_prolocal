// app/sitemap.ts

import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

/* =========================
   BASE URL
========================= */
function getBaseUrl() {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

/* =========================
   SITEMAP
========================= */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  /* ======================
     Fetch public projects
     WHY:
     - Dynamic SEO discovery
     - Sorted by freshness
  ====================== */
  const projects = await prisma.project.findMany({
    where: {
      // 🔒 future-proof: exclude drafts/private
      // published: true,
    },
    select: {
      id: true,
      updatedAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  /* ======================
     Static pages
  ====================== */
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  /* ======================
     Dynamic project pages
  ====================== */
  const projectPages: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${baseUrl}/projects/${p.id}`,
    lastModified: p.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...projectPages];
}

// http://localhost:3000/sitemap.xml
// http://localhost:3000/robots.txt
