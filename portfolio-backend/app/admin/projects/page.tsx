// app/admin/projects/page.tsx

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";

type Project = {
  id: number;
  title: string;
  summary: string;
  featured: boolean;
  views: number;
  score: number;
  tags: string[];
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProjects() {
    const res = await adminFetch("/api/projects");
    const data = await res.json();
    setProjects(data.data);
    setLoading(false);
  }

  async function deleteProject(id: number) {
    if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;

    await adminFetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Loading projects...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Projects</h1>
        <Link
          href="/admin/projects/new"
          className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
        >
          New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <p className="text-gray-600 mb-4">No projects yet</p>
          <Link
            href="/admin/projects/new"
            className="inline-block px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Create Your First Project
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-semibold text-sm">Title</th>
                  <th className="text-center p-4 font-semibold text-sm">Views</th>
                  <th className="text-center p-4 font-semibold text-sm">Score</th>
                  <th className="text-center p-4 font-semibold text-sm">Featured</th>
                  <th className="text-center p-4 font-semibold text-sm">Actions</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                    <td className="p-4">
                      <div className="font-medium">{p.title}</div>
                      <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-1">
                        {p.tags?.slice(0, 3).map((tag) => (
                          <span key={tag} className="bg-gray-100 px-2 py-0.5 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="text-center p-4 text-sm">{p.views}</td>
                    <td className="text-center p-4 text-sm">{p.score}</td>
                    <td className="text-center p-4">
                      {p.featured ? (
                        <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium">
                          Featured
                        </span>
                      ) : (
                        <span className="text-gray-400 text-sm">—</span>
                      )}
                    </td>
                    <td className="text-center p-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link
                          href={`/projects/${p.id}`}
                          target="_blank"
                          className="text-sm text-gray-600 hover:text-gray-900 transition"
                        >
                          View
                        </Link>
                        <Link
                          href={`/admin/projects/${p.id}/edit`}
                          className="text-sm text-blue-600 hover:text-blue-700 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteProject(p.id)}
                          className="text-sm text-red-600 hover:text-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
