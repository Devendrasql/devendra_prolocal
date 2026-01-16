//app/(public)/projects/page.tsx

import type { Metadata } from "next";
import { headers } from "next/headers";
import { Suspense } from "react";

import ProjectCard from "@/components/ProjectCard";
import ProjectSkeleton from "@/components/ProjectSkeleton";

/* =========================
   SEO METADATA (UNCHANGED)
========================= */
export const metadata: Metadata = {
  title: "Projects | Your Name",
  description:
    "A curated list of featured and ranked projects showcasing my work.",
  metadataBase: new URL(
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  ),
  alternates: {
    canonical: "/projects",
  },
};

/* =========================
   TYPES
========================= */
type Project = {
  id: number;
  title: string;
  summary: string;
  featured: boolean;
  views: number;
  score: number;
  tags: string[];
};

type ApiResponse = {
  data: Project[];
  page: number;
  totalPages: number;
};

/* =========================
   BASE URL (SSR SAFE)
========================= */
async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    throw new Error("Host header missing");
  }

  const protocol =
    process.env.NODE_ENV === "production" ? "https" : "http";

  return `${protocol}://${host}`;
}

/* =========================
   FETCH PROJECTS
========================= */
async function getProjects(page: number): Promise<ApiResponse> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(
    `${baseUrl}/api/projects?page=${page}&limit=9`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    throw new Error("Failed to load projects");
  }

  return res.json();
}

/* =========================
   DATA SECTION (SUSPENSED)
========================= */
async function ProjectsContent({ page }: { page: number }) {
  const { data, totalPages } = await getProjects(page);

  const featured = data.filter((p) => p.featured);
  const regular = data.filter((p) => !p.featured);

  return (
    <>
      {/* ======================
          FEATURED PROJECTS
      ====================== */}
      {featured.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">Featured</h2>
            <span className="text-sm text-muted-foreground">
              Highlighted work
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                featured
              />
            ))}
          </div>
        </section>
      )}

      {/* ======================
          ALL PROJECTS
      ====================== */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium">All Projects</h2>

        {regular.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            No projects found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regular.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        )}
      </section>

      {/* ======================
          PAGINATION
      ====================== */}
      <nav className="flex items-center justify-between pt-8 text-sm">
        {page > 1 ? (
          <a
            href={`/projects?page=${page - 1}`}
            rel="prev"
            className="hover:underline"
          >
            ← Previous
          </a>
        ) : (
          <span />
        )}

        <span className="text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        {page < totalPages ? (
          <a
            href={`/projects?page=${page + 1}`}
            rel="next"
            className="hover:underline"
          >
            Next →
          </a>
        ) : (
          <span />
        )}
      </nav>
    </>
  );
}

/* =========================
   PAGE
========================= */
export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? "1"));

  return (
    <main className="max-w-6xl mx-auto px-4 py-14 space-y-16">
      {/* ======================
          HEADER
      ====================== */}
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight">
          Projects
        </h1>
        <p className="text-muted-foreground max-w-2xl">
          A selection of projects ranging from production systems
          to focused experiments and tools.
        </p>
      </header>

      {/* ======================
          CONTENT (SUSPENSE)
      ====================== */}
      <Suspense fallback={<ProjectSkeleton count={9} />}>
        <ProjectsContent page={page} />
      </Suspense>
    </main>
  );
}
