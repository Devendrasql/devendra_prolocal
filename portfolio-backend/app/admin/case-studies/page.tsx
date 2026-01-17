"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api";

type CaseStudy = {
  id: string;
  title: string;
  slug: string;
  company: string;
  featured: boolean;
  published: boolean;
  created_at: string;
};

export default function CaseStudiesAdminPage() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/case-studies")
      .then((res) => res.json())
      .then((json) => {
        setCaseStudies(json.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this case study?")) return;

    try {
      const res = await adminFetch(`/api/case-studies/${slug}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCaseStudies((prev) => prev.filter((cs) => cs.slug !== slug));
      } else {
        alert("Failed to delete case study");
      }
    } catch (error) {
      alert("Failed to delete case study");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Loading case studies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Case Studies</h1>
          <p className="text-gray-600 mt-1">Manage detailed project case studies</p>
        </div>
        <Link
          href="/admin/case-studies/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Case Study
        </Link>
      </div>

      {caseStudies.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No case studies yet</h3>
          <p className="text-gray-600 mb-6">Get started by creating your first detailed case study</p>
          <Link
            href="/admin/case-studies/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Create Case Study
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-semibold text-sm">Title</th>
                <th className="text-left p-4 font-semibold text-sm">Company</th>
                <th className="text-center p-4 font-semibold text-sm">Status</th>
                <th className="text-center p-4 font-semibold text-sm">Featured</th>
                <th className="text-right p-4 font-semibold text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {caseStudies.map((cs) => (
                <tr key={cs.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{cs.title}</div>
                    <div className="text-sm text-gray-500">/{cs.slug}</div>
                  </td>
                  <td className="p-4 text-gray-700">{cs.company}</td>
                  <td className="text-center p-4">
                    {cs.published ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="text-center p-4">
                    {cs.featured && (
                      <svg className="w-5 h-5 text-yellow-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/case-studies/${cs.slug}/edit`}
                        className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(cs.slug)}
                        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
      )}
    </div>
  );
}
