"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
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

    /* =========================
       🔒 CLIENT-SIDE ADMIN GUARD
       =========================
       CHANGE:
       - Added pathname check

       WHY:
       - Prevent infinite redirect loop
       - Allow /admin/login to be publicly accessible
    ========================= */

    if (!token && pathname !== "/admin/login") {
      clearAccessToken(); // defensive cleanup
      router.replace("/admin/login");
    }
  }, [router, pathname]);

  async function handleLogout() {
    await logout();
    router.replace("/admin/login");
  }

  /* =========================
     WHY WE STILL RENDER UI
     =========================
     - Layout must always return JSX
     - Redirect happens async in useEffect
  ========================= */

  return (
    <div className="min-h-screen bg-gray-50">
      {/* =========================
          Admin Header
      ========================= */}
      <header className="bg-white border-b px-6 py-4">
        <h1
          className="text-lg font-semibold cursor-pointer"
          onClick={() => router.push("/admin")}
        >
          Admin Dashboard
        </h1>

      {/* Logout button */}
      {pathname !== "/admin/login" && (
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          Logout
        </button>
      )}

    </header>

      {/* =========================
          Page Content
      ========================= */}
  <main className="p-6">{children}</main>
    </div >
  );
}
