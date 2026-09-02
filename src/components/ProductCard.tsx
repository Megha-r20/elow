import { useNavigate } from "react-router";
import { Badge, Stars, Price } from "./ui";
import { Icons } from "./ui";
import { useCart } from "../hooks";
import { useWishlist } from "../hooks";
import { useToast } from "../hooks";
import { ShoppingBag } from "lucide-react";
import type { Product } from "../data";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const navigate  = useNavigate();
  const { addItem, isInCart } = useCart();
  const { has, toggle }       = useWishlist();
  const { addToast }          = useToast();

  const wished  = has(product.id);
  const inCart  = isInCart(product.id);
  const imgH    = compact ? 200 : 260;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    addItem(product);
    addToast(`${product.shortName} added to cart`);
  };

  const handleWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggle(product.id);
    addToast(wished ? "Removed from wishlist" : "Saved to wishlist", "info");
  };

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ height: "100%" }}
    >
      {/* Image area */}
      <div className="card-img" style={{ position: "relative", overflow: "hidden", height: imgH, background: "#F5F0E8", flexShrink: 0 }}>
        <img
          src={product.images[0]}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />

        {/* Badges */}
        <div style={{ position: "absolute", top: 12, left: 12, display: "flex", flexDirection: "column", gap: 5 }}>
          {product.badge && (
            <Badge label={product.badge} variant={product.badgeVariant ?? "teal"} />
          )}
          {!product.inStock && (
            <Badge label="OUT OF STOCK" variant="dark" />
          )}
        </div>

        {/* Wishlist */}
        <button
          className="wish-btn icon-btn"
          onClick={handleWish}
          style={{ position: "absolute", top: 10, right: 10, background: "rgba(255,255,255,0.92)", borderRadius: "50%", width: 36, height: 36, color: wished ? "#F472B6" : "#5C5C58", boxShadow: "0 2px 8px rgba(0,0,0,0.10)" }}
          title={wished ? "Remove from wishlist" : "Save to wishlist"}
        >
          <Icons.Heart filled={wished} />
        </button>

      </div>

      {/* Info area */}
      <div style={{ padding: compact ? "12px 14px 14px" : "14px 16px 18px", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
        <p style={{ fontSize: 10.5, fontWeight: 700, color: "#3dbdb5", letterSpacing: "1px", textTransform: "uppercase" }}>
          {product.subcategory}
        </p>
        <h3 style={{ fontSize: compact ? 13 : 14, fontWeight: 600, color: "#1C1C1A", lineHeight: 1.38, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {product.name}
        </h3>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Stars n={Math.floor(product.rating)} size={11} />
          <span style={{ fontSize: 11, color: "#8C8880", fontWeight: 500 }}>
            {product.rating.toFixed(1)} ({product.reviewCount})
          </span>
        </div>
        <Price price={product.price} original={product.originalPrice} size="sm" />

        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className="btn btn-dark btn-sm btn-full"
          style={{ marginTop: "auto" }}
        >
          {inCart ? "✔ In Cart" : product.inStock ? <><ShoppingBag size={14} strokeWidth={2.5} /> Add to Cart</> : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
