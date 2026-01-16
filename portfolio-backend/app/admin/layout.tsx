"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  getAccessToken,
  clearAccessToken,
  logout,
} from "@/lib/auth-client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = getAccessToken();

    if (!token && pathname !== "/admin/login") {
      clearAccessToken();
      router.replace("/admin/login");
    }
  }, [router, pathname]);

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  const isLoginPage = pathname === "/admin/login";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="text-xl font-bold hover:opacity-70 transition">
                Admin Panel
              </Link>

              {!isLoginPage && (
                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    href="/admin"
                    className={`text-sm font-medium transition ${
                      pathname === "/admin"
                        ? "text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/admin/projects"
                    className={`text-sm font-medium transition ${
                      pathname.startsWith("/admin/projects")
                        ? "text-gray-900"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Projects
                  </Link>
                </nav>
              )}
            </div>

            <div className="flex items-center gap-4">
              {!isLoginPage && (
                <>
                  <Link
                    href="/"
                    target="_blank"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900 transition"
                  >
                    View Site →
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-red-600 hover:text-red-700 transition"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
