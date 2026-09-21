import { logger } from "../config/logger.js";

/**
 * Resolves Pinterest shortlinks (pin.it) and Pin URLs (pinterest.com/pin/...)
 * into direct high-res image URLs (https://i.pinimg.com/736x/...).
 * If input is already a direct image URL or non-Pinterest URL, returns normalized URL.
 */
export async function resolvePinterestUrl(inputUrl) {
  if (!inputUrl || typeof inputUrl !== "string") return inputUrl;

  let url = inputUrl.trim();
  if (!url) return url;

  // Auto-prefix protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  // If already direct pinimg or non-Pinterest URL, return normalized URL
  if (url.includes("i.pinimg.com") || (!url.includes("pinterest.com") && !url.includes("pin.it"))) {
    return url;
  }

  try {
    let targetUrl = url;
    // Follow redirect for pin.it shortlinks
    if (url.includes("pin.it")) {
      const res = await fetch(url, { redirect: "follow" });
      targetUrl = res.url || url;
    }

    // Try oEmbed API first for Pin IDs
    const pinIdMatch = targetUrl.match(/\/pin\/(\d+)/);
    if (pinIdMatch) {
      const pinId = pinIdMatch[1];
      const oembedRes = await fetch(`https://www.pinterest.com/oembed.json?url=https://www.pinterest.com/pin/${pinId}/`);
      if (oembedRes.ok) {
        const data = await oembedRes.json();
        if (data.thumbnail_url) {
          const highRes = data.thumbnail_url
            .replace(/\/236x\//, "/736x/")
            .replace(/\/474x\//, "/736x/")
            .replace(/\/564x\//, "/736x/");
          logger.info(`[Pinterest Resolved] ${url} -> ${highRes}`);
          return highRes;
        }
      }
    }

    // Fallback: fetch HTML page and parse meta tags
    const htmlRes = await fetch(targetUrl);
    if (htmlRes.ok) {
      const html = await htmlRes.text();
      const ogMatch = html.match(/<meta [^>]*content=["'](https:\/\/i\.pinimg\.com\/[^"']+)["']/i) ||
                      html.match(/<meta [^>]*property=["']og:image["'][^>]*content=["'](https:\/\/i\.pinimg\.com\/[^"']+)["']/i);
      if (ogMatch && ogMatch[1]) {
        const highRes = ogMatch[1].replace(/\/236x\//, "/736x/").replace(/\/474x\//, "/736x/");
        logger.info(`[Pinterest Resolved HTML Meta] ${url} -> ${highRes}`);
        return highRes;
      }

      const pinImgMatches = html.match(/https:\/\/i\.pinimg\.com\/(originals|736x|564x|474x|236x)\/[a-z0-9/_.-]+\.(jpg|jpeg|png|webp)/gi);
      if (pinImgMatches && pinImgMatches.length > 0) {
        const best = pinImgMatches.find(u => u.includes("/736x/") || u.includes("/originals/")) || pinImgMatches[0];
        const highRes = best.replace(/\/236x\//, "/736x/").replace(/\/474x\//, "/736x/");
        logger.info(`[Pinterest Resolved HTML Regexp] ${url} -> ${highRes}`);
        return highRes;
      }
    }
  } catch (err) {
    logger.warn(`[Pinterest Resolver Warning] Could not resolve ${url}: ${err.message}`);
  }

  return url;
}
