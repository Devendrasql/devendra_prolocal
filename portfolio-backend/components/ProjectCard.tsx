// components/ProjectCard.tsx

import Link from "next/link";
import Image from "next/image";

type Props = {
  project: {
    id: number;
    title: string;
    summary: string;
    featured: boolean;
    views: number;
    score: number;
    tags: string[];
    image?: string;
  };
  featured?: boolean;
};

export default function ProjectCard({ project, featured }: Props) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className={`
        group block overflow-hidden rounded-xl border
        bg-white transition
        hover:-translate-y-0.5 hover:shadow-xl
        ${featured ? "ring-1 ring-yellow-400/40" : ""}
      `}
    >
      {/* IMAGE */}
      <div className="relative w-full h-[180px] bg-gray-100 overflow-hidden">
        <Image
          src={project.image || "/project-placeholder.jpg"}
          alt={project.title}
          width={600}
          height={360}
          priority={featured}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {featured && (
          <div className="absolute top-2 right-2 rounded-full bg-yellow-400/90 px-2 py-0.5 text-[11px] font-medium text-black">
            Featured
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 space-y-3">
        {/* TITLE */}
        <h3 className="font-semibold text-lg leading-snug tracking-tight">
          {project.title}
        </h3>

        {/* SUMMARY */}
        <p className="text-sm text-gray-600 line-clamp-2">
          {project.summary}
        </p>

        {/* TAGS */}
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* META */}
        <div className="flex items-center justify-between pt-3 text-xs text-gray-500">
          <span>{project.views.toLocaleString()} views</span>
          <span className="font-medium">
            Score {project.score}
          </span>
        </div>
      </div>
    </Link>
  );
}
