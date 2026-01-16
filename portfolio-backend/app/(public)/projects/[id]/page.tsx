// app/(public)/projects/[id]/page.tsx

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";

/* =========================
   TYPES
========================= */
type Project = {
  id: number;
  title: string;
  summary: string;
  content?: string;
  image?: string;
  featured: boolean;
  views: number;
  createdAt?: string;
  updatedAt?: string;
  tags?: { tag: { name: string } }[];
};

type ProjectListItem = {
  id: number;
  title: string;
  summary: string;
  featured: boolean;
  views: number;
  score: number;
  tags: string[];
  createdAt?: string;
};

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
   DATA FETCHERS
========================= */
async function fetchProject(id: string): Promise<Project | null> {
  const res = await fetch(`${getBaseUrl()}/api/projects/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}

async function fetchAllProjects(): Promise<ProjectListItem[]> {
  const res = await fetch(
    `${getBaseUrl()}/api/projects?page=1&limit=50`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const json = await res.json();
  return json.data;
}

/* =========================
   SEO METADATA
========================= */
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const project = await fetchProject(id);

  if (!project) {
    return {
      title: "Project Not Found",
      robots: { index: false },
    };
  }

  const url = `${getBaseUrl()}/projects/${project.id}`;

  return {
    title: `${project.title} | Portfolio`,
    description: project.summary,
    keywords: project.tags?.map(t => t.tag.name),
    alternates: { canonical: url },

    robots: {
      index: true,
      follow: true,
    },

    authors: [{ name: "Your Name", url: getBaseUrl() }],
    category: "Projects",

    openGraph: {
      title: project.title,
      description: project.summary,
      url,
      type: "article",
      images: [
        {
          url: `${getBaseUrl()}/api/og/projects/${project.id}`,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      creator: "@yourhandle",
    },
  };
}

/* =========================
   PAGE
========================= */
export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await fetchProject(id);

  if (!project) notFound();

  const baseUrl = getBaseUrl();
  const pageUrl = `${baseUrl}/projects/${project.id}`;

  /* ======================
     JSON-LD
  ====================== */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: project.title,
    description: project.summary,
    url: pageUrl,
    datePublished: project.createdAt,
    dateModified: project.updatedAt,
    author: {
      "@type": "Person",
      name: "Your Name",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Your Portfolio",
      url: baseUrl,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Projects", item: `${baseUrl}/projects` },
      { "@type": "ListItem", position: 3, name: project.title, item: pageUrl },
    ],
  };

  /* ======================
     VIEW COUNTER (NON-BLOCKING)
  ====================== */
  fetch(`${baseUrl}/api/projects/${id}/view`, { method: "POST" }).catch(() => {});

  /* ======================
     FETCH RELATED PROJECTS
  ====================== */
  const allProjects = await fetchAllProjects();
  const tagNames = project.tags?.map((t) => t.tag.name) ?? [];

  let related = allProjects
    .filter((p) => p.id !== project.id)
    .filter((p) => p.tags?.some((tag) => tagNames.includes(tag)))
    .slice(0, 3);

  if (related.length < 3) {
    const fallback = allProjects
      .filter((p) => p.id !== project.id)
      .sort((a, b) => b.views - a.views)
      .slice(0, 3);
    related = fallback;
  }

  /* ======================
     NEXT / PREVIOUS LOGIC
  ====================== */
  const sortedProjects = allProjects
    .filter((p) => p.createdAt)
    .sort(
      (a, b) =>
        new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
    );

  const currentIndex = sortedProjects.findIndex((p) => p.id === project.id);
  const prevProject = currentIndex > 0 ? sortedProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < sortedProjects.length - 1 ? sortedProjects[currentIndex + 1] : null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-16">
      {/* ======================
          STRUCTURED DATA
      ====================== */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* ======================
          BREADCRUMBS
      ====================== */}
      <nav className="mb-8 text-sm text-gray-500">
        <a href="/" className="hover:underline">Home</a>
        <span className="mx-2">/</span>
        <a href="/projects" className="hover:underline">Projects</a>
        <span className="mx-2">/</span>
        <span className="text-gray-700">{project.title}</span>
      </nav>

      {/* ======================
          HEADER
      ====================== */}
      <header className="space-y-6">
        <h1 className="text-4xl font-semibold tracking-tight">{project.title}</h1>

        <p className="text-lg text-gray-600 max-w-2xl">{project.summary}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>{project.views.toLocaleString()} views</span>
          {project.createdAt && (
            <span>Published {new Date(project.createdAt).toLocaleDateString()}</span>
          )}
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.tags.map((t) => (
              <span key={t.tag.name} className="rounded-md bg-gray-100 px-2 py-1 text-sm text-gray-700">
                {t.tag.name}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* ======================
          PROJECT IMAGE
      ====================== */}
      {project.image && (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* ======================
          CONTENT
      ====================== */}
      {project.content && (
        <article className="prose prose-gray max-w-none mt-12 whitespace-pre-wrap">{project.content}</article>
      )}

      {/* ======================
          NEXT / PREVIOUS
      ====================== */}
      <section className="border-t pt-12 flex justify-between">
        {prevProject ? (
          <a
            href={`/projects/${prevProject.id}`}
            className="text-sm text-gray-700 hover:underline"
          >
            ← {prevProject.title}
          </a>
        ) : <span />}

        {nextProject ? (
          <a
            href={`/projects/${nextProject.id}`}
            className="text-sm text-gray-700 hover:underline"
          >
            {nextProject.title} →
          </a>
        ) : <span />}
      </section>

      {/* ======================
          RELATED PROJECTS
      ====================== */}
      {related.length > 0 && (
        <section className="border-t pt-12">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Related Projects</h2>
            <p className="text-gray-600">You may also like these projects</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProjectCard key={p.id} project={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
