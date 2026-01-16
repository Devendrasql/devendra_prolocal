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
      className="group block"
    >
      <div className={`
        relative overflow-hidden rounded-2xl bg-white border border-gray-200
        transition-all duration-300 h-full
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-gray-300/50
        ${featured ? "ring-2 ring-blue-500/20" : ""}
      `}>
        <div className="relative w-full h-[220px] bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <Image
            src={project.image || "/project-placeholder.jpg"}
            alt={project.title}
            width={600}
            height={360}
            priority={featured}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {featured && (
            <div className="absolute top-4 right-4 flex items-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Featured
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <h3 className="font-bold text-xl leading-tight tracking-tight group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>

          <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
            {project.summary}
          </p>

          {project.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {project.views.toLocaleString()}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-900">
                Score: {project.score}
              </span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
