"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken } from "@/lib/auth-client";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Login failed");
      }

      const data = await res.json();

      /* =========================
         ✅ STORE TOKEN (ONE PLACE)
         =========================
         CHANGE:
         - Removed localStorage.setItem
         - Use auth-client only

         WHY:
         - Prevent storage mismatch bugs
         - Single source of truth
      ========================= */

      setAccessToken(data.accessToken);

      /* =========================
         ✅ REDIRECT (ONCE)
         =========================
         CHANGE:
         - Use router.replace only
         - Removed router.push

         WHY:
         - push + replace causes race conditions
         - replace prevents back-navigation to login
      ========================= */

      router.replace("/admin/projects");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Admin Login
        </h1>

        {error && (
          <p className="text-red-600 mb-3 text-sm">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="border p-2 w-full mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          disabled={loading}
          className="w-full py-2 bg-black text-white rounded disabled:opacity-50"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </div>
    </div>
  );
}
