import { useNavigate } from "react-router";
import { ProductCard } from "../ProductCard";
import { SectionHead, Icons } from "../ui";

export function FeaturedCarousel({
  eyebrow,
  title,
  sub,
  viewAllLink,
  products,
  bg = "var(--bg-paper)",
}) {
  const navigate = useNavigate();

  return (
    <section className="section" style={{ background: bg, overflow: "hidden" }}>
      <div className="container">
        <SectionHead
          eyebrow={eyebrow}
          title={title}
          sub={sub}
          right={
            <button onClick={() => navigate(viewAllLink)} className="btn btn-ghost btn-md">
              See all <Icons.ArrowRight />
            </button>
          }
        />
        <div className="featured-carousel-track hide-scroll">
          {products.length === 0 ? (
            [1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="featured-carousel-item"
                style={{
                  height: 320,
                  borderRadius: 16,
                  background: "#F4EFE6",
                  border: "1px solid #EAE3D9",
                  opacity: 0.6,
                }}
              />
            ))
          ) : (
            products.map((p) => (
              <div
                key={p.id}
                className="featured-carousel-item"
              >
                <ProductCard product={p} compact={true} />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
