// lib/admin-api.ts

import { getAccessToken, clearAccessToken, setAccessToken } from "./auth-client";

type ApiOptions = RequestInit & {
  retry?: boolean;
};

export async function adminFetch(
  input: RequestInfo,
  options: ApiOptions = {}
) {
  const token = getAccessToken();

  const res = await fetch(input, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
  });

  /* =========================
     🔁 HANDLE EXPIRED TOKEN
     ========================= */
  if (res.status === 401 && options.retry !== false) {
    const refreshed = await refreshAccessToken();

    if (refreshed) {
      return adminFetch(input, { ...options, retry: false });
    }

    clearAccessToken();
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }

  return res;
}

/* =========================
   🔄 REFRESH ACCESS TOKEN
========================= */
async function refreshAccessToken(): Promise<boolean> {
  try {
    const res = await fetch("/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return false;

    const data = await res.json();
    setAccessToken(data.accessToken);
    return true;
  } catch {
    return false;
  }
}
