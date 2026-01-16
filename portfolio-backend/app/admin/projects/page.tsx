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
    if (!confirm("Delete this project?")) return;

    await adminFetch(`/api/projects/${id}`, {
      method: "DELETE",
    });

    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) return <p>Loading projects…</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="px-4 py-2 bg-black text-white rounded"
        >
          New Project
        </Link>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Title</th>
            <th>Views</th>
            <th>Score</th>
            <th>Featured</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {projects.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="p-2">{p.title}</td>
              <td className="text-center">{p.views}</td>
              <td className="text-center">{p.score}</td>
              <td className="text-center">
                {p.featured ? "⭐" : "—"}
              </td>
              <td className="text-center space-x-3">
                <Link
                  href={`/admin/projects/${p.id}/edit`}
                  className="underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
