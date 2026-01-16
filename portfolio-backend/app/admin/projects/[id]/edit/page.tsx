// app/admin/projects/[id]/edit/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
// import { adminFetch } from "@/lib/adminFetch";
import { adminFetch } from "@/lib/admin-api";

export default function EditProjectPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => res.json())
      .then(setForm);
  }, [id]);

  async function save() {
    const res = await adminFetch(`/api/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: form.title,
        summary: form.summary,
        featured: form.featured,
        editorialRank: form.editorialRank,
        tags: form.tags.map((t: any) => t.tag.name),
      }),
    });

    if (res.ok) {
      router.push("/admin/projects");
    } else {
      alert("Update failed");
    }
  }

  if (!form) return <p>Loading…</p>;

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-bold mb-4">Edit Project</h1>

      <input
        className="border p-2 w-full mb-3"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <textarea
        className="border p-2 w-full mb-3"
        value={form.summary}
        onChange={(e) => setForm({ ...form, summary: e.target.value })}
      />

      <label className="flex items-center gap-2 mb-3">
        <input
          type="checkbox"
          checked={form.featured}
          onChange={(e) =>
            setForm({ ...form, featured: e.target.checked })
          }
        />
        Featured
      </label>

      <button
        onClick={save}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Save
      </button>
    </div>
  );
}
