import { getApiUrl, getAuthHeaders } from "../api/config";

/**
 * Normalizes input image URL by adding missing https:// protocol
 */
export function normalizeImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  let trimmed = url.trim();
  if (!trimmed) return "";
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Resolves Pinterest shortlinks (pin.it) or Pin URLs via backend API
 */
export async function resolvePinterestImage(url) {
  const normalized = normalizeImageUrl(url);
  if (!normalized) return "";

  // If not a Pinterest pin/shortlink, return as is
  if (normalized.includes("i.pinimg.com") || (!normalized.includes("pinterest.com") && !normalized.includes("pin.it"))) {
    return normalized;
  }

  try {
    const res = await fetch(getApiUrl(`/api/admin/resolve-image?url=${encodeURIComponent(normalized)}`), {
      headers: getAuthHeaders(),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.resolved) {
        return data.resolved;
      }
    }
  } catch (_err) {
    /* ignore resolution error */
  }

  return normalized;
}
