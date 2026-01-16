// app/admin/projects/new/page.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// import { adminFetch } from "@/lib/adminFetch";
import { adminFetch } from "@/lib/admin-api";


export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [tags, setTags] = useState("");

  async function submit() {
    const res = await adminFetch("/api/projects", {
      method: "POST",
      body: JSON.stringify({
        title,
        summary,
        tags: tags.split(",").map((t) => t.trim()),
      }),
    });

    if (res.ok) {
      router.push("/admin/projects");
    } else {
      alert("Failed to create project");
    }
  }

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">New Project</h1>

      <input
        placeholder="Title"
        className="border p-2 w-full mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Summary"
        className="border p-2 w-full mb-3"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
      />

      <input
        placeholder="Tags (comma separated)"
        className="border p-2 w-full mb-4"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />

      <button
        onClick={submit}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Create
      </button>
    </div>
  );
}
