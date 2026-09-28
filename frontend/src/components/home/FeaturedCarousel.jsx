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
        <div
          className="hide-scroll"
          style={{
            display: "flex",
            gap: 24,
            overflowX: "auto",
            paddingBottom: 32,
            paddingTop: 16,
            margin: "0 -32px",
            paddingLeft: 32,
            paddingRight: 32,
            scrollSnapType: "x mandatory",
          }}
        >
          {products.length === 0 ? (
            [1, 2, 3, 4].map((n) => (
              <div
                key={n}
                style={{
                  flex: "0 0 240px",
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
                style={{
                  flex: "0 0 240px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  scrollSnapAlign: "start",
                }}
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
