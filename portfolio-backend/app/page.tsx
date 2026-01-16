// app/page.tsx

import Link from "next/link";
import { headers } from "next/headers";
import ProjectCard from "@/components/ProjectCard";

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

/* =========================
   PAGE
========================= */
export default async function HomePage() {
  const projects = await getProjects();

  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const recent = projects.filter((p) => !p.featured).slice(0, 3);

  return (
    <main className="space-y-32">
      {/* ======================
          HERO
      ====================== */}
      <section className="max-w-6xl mx-auto px-4 pt-24">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
            Building thoughtful software products.
          </h1>

          <p className="text-lg text-gray-600">
            I design and build production-grade applications,
            internal tools, and experiments with a focus on
            clarity, performance, and long-term maintainability.
          </p>

          <div className="flex gap-4 pt-4">
            <Link
              href="/projects"
              className="inline-flex items-center rounded-md bg-black px-6 py-3 text-white font-medium hover:opacity-90 transition"
            >
              View Projects
            </Link>

            <Link
              href="/projects"
              className="inline-flex items-center rounded-md border px-6 py-3 font-medium hover:bg-gray-50 transition"
            >
              Explore Work
            </Link>
          </div>
        </div>
      </section>

      {/* ======================
          FEATURED PROJECTS
      ====================== */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold">
                Featured Projects
              </h2>
              <p className="text-gray-600 mt-1">
                Selected work and highlighted projects
              </p>
            </div>

            <Link
              href="/projects"
              className="text-sm font-medium hover:underline"
            >
              View all →
            </Link>
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
          RECENT PROJECTS
      ====================== */}
      {recent.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 space-y-8">
          <div>
            <h2 className="text-2xl font-semibold">
              Recent Work
            </h2>
            <p className="text-gray-600 mt-1">
              Latest projects and experiments
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recent.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
              />
            ))}
          </div>
        </section>
      )}

      {/* ======================
          CTA
      ====================== */}
      <section className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center space-y-6">
          <h2 className="text-3xl font-semibold">
            Explore the full project archive
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            Case studies, experiments, and production systems —
            all in one place.
          </p>

          <Link
            href="/projects"
            className="inline-flex items-center rounded-md bg-black px-8 py-3 text-white font-medium hover:opacity-90 transition"
          >
            Browse Projects
          </Link>
        </div>
      </section>
    </main>
  );
}









// // app/page.tsx

// import Image from "next/image";
// import styles from "./page.module.css";

// export default function Home() {
//   return (
//     <div className={styles.page}>
//       <main className={styles.main}>
//         <Image
//           className={styles.logo}
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className={styles.intro}>
//           <h1>To get started, edit the page.tsx file.</h1>
//           <p>
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className={styles.ctas}>
//           <a
//             className={styles.primary}
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className={styles.logo}
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className={styles.secondary}
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }
