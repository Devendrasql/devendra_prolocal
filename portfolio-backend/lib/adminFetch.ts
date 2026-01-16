export async function adminFetch(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem("accessToken");

  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
}
