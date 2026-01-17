import Link from "next/link";
import { headers } from "next/headers";
import ProjectCard from "@/components/ProjectCard";

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
  limit: number;
  total: number;
};

async function getBaseUrl() {
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) {
    throw new Error("Host header missing");
  }

  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${host}`;
}

async function getProjects(): Promise<ApiResponse> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(`${baseUrl}/api/projects?page=1&limit=50`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    return { data: [], page: 1, limit: 50, total: 0 };
  }

  return res.json();
}

export default async function ProjectsPage() {
  const { data: projects } = await getProjects();

  const featured = projects.filter((p) => p.featured);
  const other = projects.filter((p) => !p.featured);

  return (
    <main className="min-h-screen">
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>

        <div className="relative max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 mb-16">
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              All Projects
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A collection of work, experiments, and production systems built over the years
            </p>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">Featured Projects</h2>
            <p className="text-gray-600">Highlighted work and selected projects</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((project) => (
              <ProjectCard key={project.id} project={project} featured />
            ))}
          </div>
        </section>
      )}

      {other.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-2">All Projects</h2>
            <p className="text-gray-600">Complete archive of work</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {other.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      )}

      {projects.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 py-32 text-center">
          <div className="space-y-4">
            <p className="text-2xl font-semibold text-gray-800">No projects yet</p>
            <p className="text-gray-600">Check back soon for updates</p>
          </div>
        </section>
      )}

      <section className="relative py-24 mt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>

        <div className="relative max-w-6xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl font-bold text-white">
            Let's work together
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Have a project in mind? Let's build something great together
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-gray-900 font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
