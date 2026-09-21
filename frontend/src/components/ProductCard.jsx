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

    const handleAdd = (e) => {
        e.stopPropagation();
        if (!product.inStock) return;
        addItem(product);
        addToast(`${product.shortName || product.name} added to cart`);
    };

    const handleWish = (e) => {
        e.stopPropagation();
        toggle(product.id);
        addToast(wished ? "Removed from wishlist" : "Saved to wishlist", "info");
    };

    // SINGLE PRIMARY BADGE LOGIC: Exactly ONE primary badge is shown at a time
    let primaryBadge = null;
    if (!product.inStock) {
        primaryBadge = { label: "OUT OF STOCK", variant: "dark" };
    } else if (product.isNew || product.badge === "NEW") {
        primaryBadge = { label: "NEW", variant: "lavender" };
    } else if (product.isBestseller || product.badge === "BESTSELLER") {
        primaryBadge = { label: "BESTSELLER", variant: "lavender" };
    } else if (product.originalPrice > product.price) {
        primaryBadge = { label: "SALE", variant: "terracotta" };
    } else if (product.badge) {
        primaryBadge = { label: product.badge, variant: product.badgeVariant ?? "lavender" };
    }

    return (
        <div
            className="group relative bg-white rounded-[16px] border border-[#EAE3D9] overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
        >
            {/* 1. PRODUCT IMAGE AREA (Aspect ratio ~4:5) */}
            <div className={`relative bg-[#F4EFE6] overflow-hidden shrink-0 ${compact ? "h-[200px]" : "aspect-[4/5] w-full"}`}>
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
                    }}
                />

                {/* 2. SINGLE PRIMARY BADGE */}
                {primaryBadge && (
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <Badge label={primaryBadge.label} variant={primaryBadge.variant} />
                    </div>
                )}

                {/* 3. WISHLIST BUTTON */}
                <button
                    className="absolute top-3 right-3 z-10 w-8.5 h-8.5 rounded-full bg-white/85 backdrop-blur-md border border-white/60 shadow-sm flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95"
                    onClick={handleWish}
                    style={{ color: wished ? "#E26D5C" : "#78726A" }}
                    title={wished ? "Remove from wishlist" : "Save to wishlist"}
                    aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                >
                    <Icons.Heart filled={wished} />
                </button>
            </div>

            {/* 4. PRODUCT INFORMATION */}
            <div className={`flex flex-col flex-1 gap-1.5 ${compact ? "p-3" : "p-4"}`}>
                <p className="text-[10px] font-bold text-[#8192D4] tracking-widest uppercase">
                    {product.subcategory || product.category}
                </p>

                <h3 className={`font-semibold text-[#23201D] leading-snug line-clamp-2 ${compact ? "text-xs min-h-[32px]" : "text-[13.5px] min-h-[38px]"} group-hover:text-[#8192D4] transition-colors`}>
                    {product.name}
                </h3>

                {/* 5. SUBTLE RATING */}
                <div className="flex items-center gap-1.5 my-0.5">
                    {product.reviewCount > 0 ? (
                        <>
                            <Stars n={Math.floor(product.rating)} size={10} />
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

                {/* 6. PRICING */}
                <div className="mt-0.5 mb-2">
                    <Price price={product.price} original={product.originalPrice} size="sm" />
                </div>

                {/* 7. ADD TO CART BUTTON */}
                <button
                    onClick={handleAdd}
                    disabled={!product.inStock}
                    className="w-full h-11 mt-auto rounded-xl bg-[#23201D] hover:bg-[#35312D] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] disabled:bg-[#EAE3D9] disabled:text-[#9C968D] disabled:cursor-not-allowed cursor-pointer"
                >
                    {inCart ? (
                        "✔ In Cart"
                    ) : product.inStock ? (
                        <>
                            <ShoppingBag size={14} strokeWidth={2.2} /> + Add to Cart
                        </>
                    ) : (
                        "Out of Stock"
                    )}
                </button>
            </div>
        </div>
    );
}

