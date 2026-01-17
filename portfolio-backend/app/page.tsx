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
};

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

async function getProjects(): Promise<Project[]> {
  const baseUrl = await getBaseUrl();

  const res = await fetch(
    `${baseUrl}/api/projects?page=1&limit=6`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) {
    return [];
  }

  const json: ApiResponse = await res.json();
  return json.data;
}

export default async function HomePage() {
  const projects = await getProjects();

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const recent = projects.filter((p) => !p.featured).slice(0, 3);

  return (
    <main>
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-32 text-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-sm font-medium text-gray-700 shadow-sm">
                Portfolio 2026
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto">
              Building thoughtful
              <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                software products
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              I design and build production-grade applications, internal tools, and experiments
              with a focus on clarity, performance, and long-term maintainability.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-black px-8 py-4 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                View Projects
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <Link
                href="/projects"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white/80 backdrop-blur-sm px-8 py-4 font-semibold hover:border-gray-400 hover:shadow-lg transition-all"
              >
                Explore Work
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-sm font-medium">Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              50+
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Projects Completed</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              5+
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Years Experience</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              30+
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Happy Clients</div>
          </div>
          <div className="text-center space-y-2">
            <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              100%
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Client Satisfaction</div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">What I Do</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Specialized in building modern web applications with cutting-edge technologies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-white p-8 border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Web Development</h3>
              <p className="text-gray-600 leading-relaxed">
                Building responsive, performant web applications using React, Next.js, and modern JavaScript frameworks.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-white p-8 border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Backend Systems</h3>
              <p className="text-gray-600 leading-relaxed">
                Designing scalable APIs and database architectures with Node.js, PostgreSQL, and cloud infrastructure.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-pink-50 to-white p-8 border border-gray-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-bl-full"></div>
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-600 to-pink-700 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">UI/UX Design</h3>
              <p className="text-gray-600 leading-relaxed">
                Creating beautiful, intuitive user interfaces with attention to detail and user experience best practices.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">Tech Stack</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Technologies I work with to bring ideas to life
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {[
            { name: 'React', icon: '⚛️' },
            { name: 'Next.js', icon: '▲' },
            { name: 'TypeScript', icon: 'TS' },
            { name: 'Node.js', icon: '🟢' },
            { name: 'PostgreSQL', icon: '🐘' },
            { name: 'Tailwind', icon: '🎨' },
            { name: 'Docker', icon: '🐳' },
            { name: 'AWS', icon: '☁️' },
            { name: 'Git', icon: '📦' },
            { name: 'GraphQL', icon: '◇' },
            { name: 'Redis', icon: '🔴' },
            { name: 'Prisma', icon: '⚡' },
          ].map((tech, index) => (
            <div
              key={tech.name}
              className="group relative bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="text-center space-y-3">
                <div className="text-3xl group-hover:scale-110 transition-transform">
                  {tech.icon}
                </div>
                <div className="text-sm font-semibold text-gray-700 group-hover:text-blue-600 transition-colors">
                  {tech.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <h2 className="text-4xl font-bold">
                Featured Projects
              </h2>
              <p className="text-lg text-gray-600">
                Selected work and highlighted projects
              </p>
            </div>

            <Link
              href="/projects"
              className="group flex items-center gap-2 text-sm font-semibold hover:text-blue-600 transition"
            >
              View all
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((project, index) => (
              <div key={project.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <ProjectCard project={project} featured />
              </div>
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-12 shadow-sm border border-gray-200/50">
            <div className="space-y-2 mb-12">
              <h2 className="text-4xl font-bold">
                Recent Work
              </h2>
              <p className="text-lg text-gray-600">
                Latest projects and experiments
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recent.map((project, index) => (
                <div key={project.id} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Explore the full archive
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Case studies, experiments, and production systems — all in one place
          </p>

          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-gray-900 font-semibold shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
          >
            Browse All Projects
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </main>
  );
}
