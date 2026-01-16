"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import ViewsChart from "./components/ViewsChart";

type Analytics = {
  totals: {
    projects: number;
    featured: number;
    views: number;
  };
  topProjects: {
    id: number;
    title: string;
    views: number;
    featured: boolean;
    ranking: { score: number };
  }[];
  dailyViews: {
    date: string;   // ✅ already formatted by backend
    views: number;  // ✅ already normalized
  }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch("/api/admin/analytics")
      .then((res) => res.json())
      .then((raw) => {
        /* =========================
           FIX: use new API shape
           WHY: backend already normalized
        ========================= */

        setData({
          totals: raw.totals,
          topProjects: raw.topProjects,
          dailyViews: raw.dailyViews,
        });
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading dashboard…</p>;
  if (!data) return <p>Failed to load analytics</p>;

  return (
    <div className="space-y-8">
      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard label="Total Projects" value={data.totals.projects} />
        <StatCard label="Featured Projects" value={data.totals.featured} />
        <StatCard label="Total Views" value={data.totals.views} />
      </div>

      {/* VIEWS OVER TIME */}
      <ViewsChart data={data.dailyViews} />

      {/* TOP PROJECTS */}
      <div>
        <h2 className="text-lg font-semibold mb-3">
          Top Projects
        </h2>

        <table className="w-full border">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="text-left p-2">Title</th>
              <th>Views</th>
              <th>Score</th>
              <th>Featured</th>
            </tr>
          </thead>
          <tbody>
            {data.topProjects.map((p) => (
              <tr key={p.id} className="border-b">
                <td className="p-2">{p.title}</td>
                <td className="text-center">{p.views}</td>
                <td className="text-center">{p.ranking.score}</td>
                <td className="text-center">
                  {p.featured ? "⭐" : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-white border rounded p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
