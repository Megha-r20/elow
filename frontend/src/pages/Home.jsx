import { useState, useEffect } from "react";
import { CATEGORIES } from "../data";
import { PRODUCTS } from "../data/products.js";
import { useDocumentTitle } from "../hooks";
import { getApiUrl } from "../api/config";
import {
  HeroSection,
  TrustBar,
  CategoryGrid,
  FeaturedCarousel,
  EditorialSection,
  GiftSection,
  ReviewsSection,
  QuoteBanner,
  StudyEssentialsBanner,
  MarqueeTicker,
} from "../components/home";

export default function Home() {
  useDocumentTitle("Home — Beautiful Stationery");

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem("elow_categories");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (_e) {}
    return CATEGORIES;
  });
  const [featured, setFeatured] = useState(() => PRODUCTS.slice(0, 8));
  const [bestSellers, setBestSellers] = useState(() => PRODUCTS.filter((p) => p.isBestseller).slice(0, 8));

  useEffect(() => {
    async function fetchHomeProducts() {
      try {
        const [featRes, bestRes, catRes] = await Promise.all([
          fetch(getApiUrl("/api/products?limit=8")),
          fetch(getApiUrl("/api/products?filter=bestseller&limit=8")),
          fetch(getApiUrl("/api/categories")),
        ]);
        if (featRes.ok) {
          const featData = await featRes.json();
          if (featData.products && featData.products.length > 0) {
            setFeatured(featData.products);
          }
        }
        if (bestRes.ok) {
          const bestData = await bestRes.json();
          if (bestData.products && bestData.products.length > 0) {
            setBestSellers(bestData.products);
          }
        }
        if (catRes.ok) {
          const catData = await catRes.json();
          if (Array.isArray(catData) && catData.length > 0) {
            const baseList = (() => {
              try {
                const saved = localStorage.getItem("elow_categories");
                if (saved) {
                  const parsed = JSON.parse(saved);
                  if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                }
              } catch (_e) {}
              return CATEGORIES;
            })();

            const matchedCatIds = new Set();
            const merged = baseList.map((b) => {
              const bId = (b.id || b.slug || b.label || "").toLowerCase();
              const matchedApi = catData.find((c) => {
                const cId = (c.id || c.slug || c.name || "").toLowerCase();
                return cId === bId || cId.includes(bId) || bId.includes(cId);
              });

              if (matchedApi) {
                matchedCatIds.add(matchedApi.id || matchedApi.slug || matchedApi.name);
                const rawImg = b.image || matchedApi.image || "";
                let finalImg = rawImg.trim();
                if (finalImg && !/^https?:\/\//i.test(finalImg) && !finalImg.startsWith("/") && !finalImg.startsWith("data:")) {
                  finalImg = `https://${finalImg}`;
                }
                const countVal = matchedApi.count ?? matchedApi.productCount ?? b.productCount ?? 0;
                return {
                  ...b,
                  ...matchedApi,
                  id: b.id || matchedApi.id || matchedApi.slug,
                  label: b.label || matchedApi.label || matchedApi.name,
                  image: b.image || finalImg,
                  fallbackImage: b.fallbackImage || b.image,
                  productCount: countVal,
                  color: b.color || "#EEE8F8",
                };
              }
              return b;
            });

            catData.forEach((c) => {
              const cKey = c.id || c.slug || c.name;
              if (cKey) {
                const matchId = cKey.toLowerCase();
                const isAlreadyAdded = merged.some((m) => {
                  const mId = (m.id || m.slug || m.label || "").toLowerCase();
                  return mId === matchId || mId.includes(matchId) || matchId.includes(mId);
                });
                if (!isAlreadyAdded) {
                  const rawImg = c.image || "";
                  let finalImg = rawImg.trim();
                  if (finalImg && !/^https?:\/\//i.test(finalImg) && !finalImg.startsWith("/") && !finalImg.startsWith("data:")) {
                    finalImg = `https://${finalImg}`;
                  }
                  merged.push({
                    id: c.id || c.slug || matchId,
                    label: c.label || c.name || c.id,
                    image: finalImg || "/journals.jpg",
                    fallbackImage: "/journals.jpg",
                    productCount: c.count ?? c.productCount ?? 0,
                    color: "#EEE8F8",
                  });
                }
              }
            });

            setCategories(merged);
          }
        }
      } catch (_err) {
        /* ignore fetch error */
      }
    }
    fetchHomeProducts();
  }, []);

  return (
    <div>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <HeroSection />

      {/* ── Trust bar ───────────────────────────────────────────── */}
      <TrustBar />

      {/* ── Categories ──────────────────────────────────────────── */}
      <CategoryGrid categories={categories} />

      {/* ── Featured Products (Fresh Drops) ────────────────────── */}
      <FeaturedCarousel
        eyebrow="New Arrivals"
        title="Fresh Drops"
        sub="The latest additions to our collection — just landed."
        viewAllLink="/shop?filter=new"
        products={featured.slice(0, 8)}
        bg="var(--bg-paper)"
      />

      {/* ── Editorial split: The Journaling Edit ────────────────── */}
      <EditorialSection />

      {/* ── Best Sellers ────────────────────────────────────────── */}
      <FeaturedCarousel
        eyebrow="Most Popular"
        title="Best Sellers"
        sub="The products our community can't stop buying."
        viewAllLink="/shop?filter=bestseller"
        products={bestSellers}
        bg="var(--bg-sand)"
      />

      {/* ── Editorial quote banner ──────────────────────────────── */}
      <QuoteBanner />

      {/* ── Gift ideas ──────────────────────────────────────────── */}
      <GiftSection />

      {/* ── Reviews ─────────────────────────────────────────────── */}
      <ReviewsSection />

      {/* ── Study Essentials banner ─────────────────────────────── */}
      <StudyEssentialsBanner />

      {/* ── Recent arrivals marquee ─────────────────────────────── */}
      <MarqueeTicker />
    </div>
  );
}
