"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  published: boolean;
  views: number;
  created_at: string;
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((json) => {
        setPosts(json.data || []);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this blog post?")) return;
    await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <p className="text-gray-600">Write and manage articles</p>
        </div>
        <Link href="/admin/blog/new" className="px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700">
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed p-12 text-center">
          <h3 className="text-lg font-semibold mb-2">No blog posts yet</h3>
          <Link href="/admin/blog/new" className="text-amber-600 hover:underline">Create your first post</Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold">Title</th>
                <th className="text-center p-4 font-semibold">Views</th>
                <th className="text-center p-4 font-semibold">Status</th>
                <th className="text-right p-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-sm text-gray-500">{post.excerpt.substring(0, 60)}...</div>
                  </td>
                  <td className="text-center p-4">{post.views}</td>
                  <td className="text-center p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${post.published ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link href={`/admin/blog/${post.slug}/edit`} className="text-blue-600 hover:underline mr-3">Edit</Link>
                    <button onClick={() => handleDelete(post.slug)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
