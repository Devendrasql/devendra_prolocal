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
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
          <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-32 text-center">
          <div className="space-y-8 animate-fade-in">
            <div className="inline-block">
              <span className="px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-sm font-medium text-emerald-700">
                Product Manager • Designer • Strategist
              </span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl mx-auto text-gray-900">
              Crafting digital products
              <span className="block mt-2 text-emerald-600">
                that solve real problems
              </span>
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              I lead cross-functional teams to build user-centered products that drive business growth.
              From discovery to delivery, I bring clarity to complexity.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 py-4 text-white font-semibold shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-[1.02] transition-all"
              >
                View Case Studies
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>

              <a
                href="mailto:contact@example.com"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 font-semibold hover:border-gray-400 hover:shadow-md transition-all"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider">Scroll</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center space-y-3 p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
            <div className="text-4xl md:text-5xl font-bold text-gray-900">
              8+
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Years Experience</div>
          </div>
          <div className="text-center space-y-3 p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
            <div className="text-4xl md:text-5xl font-bold text-gray-900">
              25+
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Products Launched</div>
          </div>
          <div className="text-center space-y-3 p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
            <div className="text-4xl md:text-5xl font-bold text-gray-900">
              $2M+
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Revenue Impact</div>
          </div>
          <div className="text-center space-y-3 p-6 rounded-xl bg-gray-50 hover:bg-white hover:shadow-md transition-all">
            <div className="text-4xl md:text-5xl font-bold text-gray-900">
              50K+
            </div>
            <div className="text-sm md:text-base text-gray-600 font-medium">Active Users</div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Core Competencies</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Driving product success through strategy, execution, and user-centric design
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group relative overflow-hidden rounded-2xl bg-white p-8 border-2 border-gray-200 hover:border-emerald-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:scale-110 transition-all">
                <svg className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Product Strategy</h3>
              <p className="text-gray-600 leading-relaxed">
                Define vision and roadmap with data-driven insights. Align stakeholders and prioritize features that deliver maximum business value.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-8 border-2 border-gray-200 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mb-6 group-hover:bg-amber-500 group-hover:scale-110 transition-all">
                <svg className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">Team Leadership</h3>
              <p className="text-gray-600 leading-relaxed">
                Build and lead cross-functional teams. Foster collaboration between design, engineering, and business to ship exceptional products.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-white p-8 border-2 border-gray-200 hover:border-gray-400 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="relative">
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center mb-6 group-hover:bg-gray-900 group-hover:scale-110 transition-all">
                <svg className="w-7 h-7 text-gray-600 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900">User Research</h3>
              <p className="text-gray-600 leading-relaxed">
                Deeply understand user needs through interviews, testing, and analytics. Transform insights into actionable product decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-24 bg-gray-50 rounded-3xl">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900">Technical Skills</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            PM expertise backed by technical knowledge
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { name: 'Product Analytics', category: 'Analytics' },
            { name: 'A/B Testing', category: 'Optimization' },
            { name: 'SQL & Data', category: 'Technical' },
            { name: 'Figma & Design', category: 'Design' },
            { name: 'Agile & Scrum', category: 'Process' },
            { name: 'APIs & Systems', category: 'Technical' },
            { name: 'Roadmapping', category: 'Strategy' },
            { name: 'Stakeholder Mgmt', category: 'Leadership' },
          ].map((skill, index) => (
            <div
              key={skill.name}
              className="group relative bg-white rounded-xl p-5 border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all duration-300"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="space-y-2">
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">
                  {skill.category}
                </div>
                <div className="text-sm font-bold text-gray-900">
                  {skill.name}
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

      <section className="relative py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-white">
            Ready to build together?
          </h2>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Let's create products that users love and businesses grow on
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 justify-center rounded-xl bg-white px-8 py-4 text-gray-900 font-semibold shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
            >
              View Case Studies
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a
              href="mailto:contact@example.com"
              className="inline-flex items-center gap-2 justify-center rounded-xl border-2 border-white/30 bg-white/10 backdrop-blur-sm px-8 py-4 text-white font-semibold hover:bg-white/20 hover:border-white/50 transition-all"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
