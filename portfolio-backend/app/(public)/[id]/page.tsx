// app/(public)/[id]/page.tsx

import { notFound } from "next/navigation";
import { headers } from "next/headers";
import { Metadata } from "next";

type Project = {
  id: number;
  title: string;
  summary: string;
  content: string;
  featured: boolean;
  views: number;
  tags: { tag: { name: string } }[];
};

type Props = {
  params: {
    id: string;
  };
};

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("host");

  if (!host) {
    throw new Error("Missing host header");
  }

  const protocol =
    process.env.NODE_ENV === "production"
      ? "https"
      : "http";

  return `${protocol}://${host}`;
}

async function getProject(id: string): Promise<Project> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/projects/${id}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    notFound();
  }

  const json = await res.json();
  return json.data;
}

// ✅ SEO
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const project = await getProject(params.id);

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: "article",
    },
  };
}

export default async function ProjectDetailPage(
  { params }: Props
) {
  const project = await getProject(params.id);
  const baseUrl = await getBaseUrl();

  // 🔥 Increment view (fire-and-forget)
  fetch(`${baseUrl}/api/projects/${project.id}/view`, {
    method: "POST",
  }).catch(() => {});

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">
        {project.title}
      </h1>

      <p className="text-gray-500 mb-4">
        {project.views} views
      </p>

      <div className="flex gap-2 mb-6">
        {project.tags.map(t => (
          <span
            key={t.tag.name}
            className="text-sm bg-gray-100 px-2 py-1 rounded"
          >
            #{t.tag.name}
          </span>
        ))}
      </div>

      <article className="prose max-w-none">
        {project.content}
      </article>
    </main>
  );
}
