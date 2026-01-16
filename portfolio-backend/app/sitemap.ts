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
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  let projects: { id: number; updatedAt: Date }[] = [];

  try {
    projects = await prisma.project.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch projects for sitemap:", error);
  }

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
  ];

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
