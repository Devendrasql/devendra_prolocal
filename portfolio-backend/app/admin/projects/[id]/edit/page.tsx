// app/admin/projects/[id]/edit/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-api";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          ...data,
          tags: data.tags?.map((t: any) => t.tag.name).join(", ") || "",
        });
      });
  }, [id]);

  async function save() {
    if (!form.title || !form.summary) {
      alert("Title and summary are required");
      return;
    }

    setLoading(true);

    try {
      const res = await adminFetch(`/api/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          title: form.title,
          summary: form.summary,
          content: form.content || null,
          image: form.image || null,
          featured: form.featured,
          editorialRank: form.editorialRank || 0,
          tags: form.tags.split(",").map((t: string) => t.trim()).filter((t: string) => t),
        }),
      });

      if (res.ok) {
        router.push("/admin/projects");
      } else {
        alert("Update failed");
      }
    } finally {
      setLoading(false);
    }
  }

  if (!form) return <p className="text-center py-8">Loading project...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Summary *</label>
          <textarea
            className="border rounded p-3 w-full h-24 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            placeholder="Detailed project content (supports markdown)"
            className="border rounded p-3 w-full h-48 focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={form.content || ""}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={form.image || ""}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            placeholder="react, nextjs, typescript (comma separated)"
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Editorial Rank</label>
          <input
            type="number"
            placeholder="0"
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={form.editorialRank || 0}
            onChange={(e) => setForm({ ...form, editorialRank: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            className="w-4 h-4"
            checked={form.featured}
            onChange={(e) => setForm({ ...form, featured: e.target.checked })}
          />
          <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
            Mark as featured project
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={save}
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 border rounded hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
