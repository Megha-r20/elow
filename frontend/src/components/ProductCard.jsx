import { useNavigate } from "react-router";
import { Badge, Stars, Price } from "./ui";
import { Icons } from "./ui";
import { useCart } from "../hooks";
import { useWishlist } from "../hooks";
import { useToast } from "../hooks";
import { ShoppingBag } from "lucide-react";
export function ProductCard({ product, compact = false }) {
    const navigate = useNavigate();
    const { addItem, isInCart } = useCart();
    const { has, toggle } = useWishlist();
    const { addToast } = useToast();
    const wished = has(product.id);
    const inCart = isInCart(product.id);
    const imgH = compact ? 200 : 260;
    const handleAdd = (e) => {
        e.stopPropagation();
        if (!product.inStock)
            return;
        addItem(product);
        addToast(`${product.shortName} added to cart`);
    };
    const handleWish = (e) => {
        e.stopPropagation();
        toggle(product.id);
        addToast(wished ? "Removed from wishlist" : "Saved to wishlist", "info");
    };
    return (<div className="product-card h-full" onClick={() => navigate(`/product/${product.id}`)}>
      {/* Image area */}
      <div className="card-img relative overflow-hidden bg-[#F4EFE6] shrink-0" style={{ height: imgH }}>
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover block"/>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.badge && (<Badge label={product.badge} variant={product.badgeVariant ?? "teal"}/>)}
          {!product.inStock && (<Badge label="OUT OF STOCK" variant="dark"/>)}
        </div>

        {/* Wishlist */}
        <button className="wish-btn icon-btn absolute top-2.5 right-2.5 bg-white/90 rounded-full w-9 h-9 shadow-sm" onClick={handleWish} style={{ color: wished ? "#E26D5C" : "#6E6A63" }} title={wished ? "Remove from wishlist" : "Save to wishlist"} aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}>
          <Icons.Heart filled={wished}/>
        </button>

      </div>

      {/* Info area */}
      <div className={`flex flex-col gap-1.5 flex-1 ${compact ? "p-3.5" : "p-4"}`}>
        <p className="text-[10.5px] font-bold text-[#8192D4] tracking-widest uppercase">
          {product.subcategory}
        </p>
        <h3 className={`font-semibold text-[#23201D] leading-snug line-clamp-2 ${compact ? "text-xs" : "text-sm"}`}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          {product.reviewCount > 0 ? (
            <>
              <Stars n={Math.floor(product.rating)} size={11}/>
              <span className="text-[11px] text-[#9C968D] font-medium">
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            </>
          ) : (
            <span className="text-[11px] text-[#9C968D] font-medium">
              No reviews yet
            </span>
          )}
        </div>
        <Price price={product.price} original={product.originalPrice} size="sm"/>

        <button onClick={handleAdd} disabled={!product.inStock} className="btn btn-dark btn-sm btn-full mt-auto">
          {inCart ? "✔ In Cart" : product.inStock ? <><ShoppingBag size={14} strokeWidth={2.5}/> Add to Cart</> : "Out of Stock"}
        </button>
      </div>
    </div>);
}
