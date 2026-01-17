"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";

type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  featured: boolean;
};

export default function TestimonialsAdminPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    avatarUrl: "",
    rating: 5,
    featured: false,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = () => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then((json) => {
        setTestimonials(json.data || []);
        setLoading(false);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await adminFetch("/api/testimonials", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowForm(false);
        setFormData({ name: "", role: "", company: "", content: "", avatarUrl: "", rating: 5, featured: false });
        fetchTestimonials();
      } else {
        alert("Failed to create testimonial");
      }
    } catch (error) {
      alert("Error creating testimonial");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;

    try {
      const res = await adminFetch(`/api/testimonials/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        fetchTestimonials();
      } else {
        alert("Failed to delete testimonial");
      }
    } catch (error) {
      alert("Error deleting testimonial");
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Testimonials</h1>
          <p className="text-gray-600">Manage client reviews and feedback</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-700"
        >
          {showForm ? "Cancel" : "Add Testimonial"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" placeholder="Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Role" required value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="text" placeholder="Company" required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="px-4 py-2 border rounded-lg" />
            <input type="url" placeholder="Avatar URL" value={formData.avatarUrl} onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })} className="px-4 py-2 border rounded-lg" />
          </div>
          <textarea placeholder="Testimonial content" required rows={4} value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="w-full px-4 py-2 border rounded-lg" />
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
              <span>Featured</span>
            </label>
          </div>
          <button type="submit" className="px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg">Save</button>
        </form>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border p-6 space-y-3">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold">{t.name}</h3>
                <p className="text-sm text-gray-600">{t.role} at {t.company}</p>
              </div>
              {t.featured && <span className="text-yellow-500">⭐</span>}
            </div>
            <p className="text-gray-700">{t.content}</p>
            <button onClick={() => handleDelete(t.id)} className="text-sm text-red-600 hover:underline">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
