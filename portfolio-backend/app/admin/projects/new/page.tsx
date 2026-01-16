// app/admin/projects/new/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminFetch } from "@/lib/admin-api";

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [tags, setTags] = useState("");
  const [featured, setFeatured] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!title || !summary) {
      alert("Title and summary are required");
      return;
    }

    setLoading(true);

    try {
      const res = await adminFetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({
          title,
          summary,
          content: content || null,
          image: image || null,
          featured,
          tags: tags.split(",").map((t) => t.trim()).filter((t) => t),
        }),
      });

      if (res.ok) {
        router.push("/admin/projects");
      } else {
        alert("Failed to create project");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

      <div className="bg-white rounded-lg border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            placeholder="Project title"
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Summary *</label>
          <textarea
            placeholder="Brief project description"
            className="border rounded p-3 w-full h-24 focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            placeholder="Detailed project content (supports markdown)"
            className="border rounded p-3 w-full h-48 focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Image URL</label>
          <input
            type="url"
            placeholder="https://example.com/image.jpg"
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tags</label>
          <input
            type="text"
            placeholder="react, nextjs, typescript (comma separated)"
            className="border rounded p-3 w-full focus:outline-none focus:ring-2 focus:ring-gray-900"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            className="w-4 h-4"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
          />
          <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
            Mark as featured project
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            onClick={submit}
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Project"}
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
