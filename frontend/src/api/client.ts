export const API_BASE = "http://localhost:8000/api";

export function authFetch(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access");
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...(options.headers || {}),
    },
  });
}
