/**
 * Central API configuration helper.
 * Resolves API requests against VITE_API_URL when deployed (e.g. Render backend URL),
 * or defaults to http://localhost:5005 in local development environment.
 */
const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = rawApiUrl
  ? rawApiUrl.replace(/\/$/, "")
  : import.meta.env.DEV
  ? "http://localhost:5005"
  : "";

export function getApiUrl(endpoint) {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_BASE_URL}${path}`;
}

export function getAuthHeaders(contentType) {
  const token = localStorage.getItem("elow_admin_token") || localStorage.getItem("elow_auth_token") || localStorage.getItem("token");
  const headers = {};
  if (contentType) headers["Content-Type"] = contentType;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}
