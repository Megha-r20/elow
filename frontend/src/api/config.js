/**
 * Central API configuration helper.
 * Resolves API requests against VITE_API_URL when deployed (e.g. Render backend URL),
 * or falls back to relative paths for local Vite dev proxy.
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
  : "";

export function getApiUrl(endpoint) {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
}
