/**
 * Central API configuration helper.
 * Resolves API requests against VITE_API_URL when deployed (e.g. Render backend URL),
 * or defaults to http://localhost:5005 in local development environment.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : import.meta.env.DEV
  ? "http://localhost:5005"
  : "";

export function getApiUrl(endpoint) {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
}
