import { useNavigate } from "react-router";
import { Badge, Stars, Price } from "./ui";
import { Icons } from "./ui";
import { useCart } from "../hooks";
import { useWishlist } from "../hooks";
import { useToast } from "../hooks";
import { ShoppingBag, Check } from "lucide-react";

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

    // Sanitize subcategory string (removes generic "General " prefixes)
    const cleanSubcategory = (() => {
        const raw = product.subcategory || product.category || "Stationery";
        const cleaned = raw.replace(/^general\s+/i, "").trim();
        return cleaned ? cleaned.toUpperCase() : "STATIONERY";
    })();

    // SINGLE PRIMARY BADGE LOGIC
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
            className="group relative bg-white rounded-[20px] border border-[#EAE3D9] overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-md cursor-pointer"
            onClick={() => navigate(`/product/${product.id}`)}
        >
            {/* 1. PRODUCT IMAGE AREA (Aspect ratio ~1:1 square image) */}
            <div className={`relative bg-[#F4EFE6] overflow-hidden shrink-0 ${compact ? "h-[190px]" : "aspect-square w-full"}`}>
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1760720962384-e470ee773c1f?q=80&w=800&auto=format&fit=crop";
                    }}
                />

                {/* 2. SINGLE PRIMARY BADGE */}
                {primaryBadge && (
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <Badge label={primaryBadge.label} variant={primaryBadge.variant} />
                    </div>
                )}

                {/* 3. WISHLIST HEART BUTTON */}
                <button
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                    onClick={handleWish}
                    style={{ color: wished ? "#E26D5C" : "#23201D" }}
                    title={wished ? "Remove from wishlist" : "Save to wishlist"}
                    aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                >
                    <Icons.Heart filled={wished} />
                </button>
            </div>

            {/* 4. PRODUCT INFORMATION */}
            <div className={`flex flex-col flex-1 ${compact ? "p-3" : "p-4 pt-3.5"}`}>
                <p className="text-[11px] font-bold text-[#9C968D] tracking-[1.2px] uppercase mb-0.5">
                    {cleanSubcategory}
                </p>

                <h3 className={`font-semibold text-[#23201D] leading-snug line-clamp-1 ${compact ? "text-xs mb-1" : "text-[15px] mb-1"} group-hover:text-[#858BE4] transition-colors`}>
                    {product.name}
                </h3>

                {/* 5. SUBTLE RATING */}
                <div className="flex items-center gap-1.5 mb-2.5">
                    {product.reviewCount > 0 ? (
                        <>
                            <Stars n={Math.floor(product.rating)} size={11} />
                            <span className="text-[12px] text-[#78726A] font-medium">
                                {product.rating.toFixed(1)} ({product.reviewCount})
                            </span>
                        </>
                    ) : (
                        <span className="text-[12px] text-[#78726A] font-medium">
                            No reviews yet
                        </span>
                    )}
                </div>

                {/* 6. PRICING */}
                <div className="mb-3.5">
                    <Price price={product.price} original={product.originalPrice} size="sm" />
                </div>

                {/* 7. ADD TO CART / OUT OF STOCK BUTTON */}
                {product.inStock ? (
                    <button
                        onClick={handleAdd}
                        className={`w-full h-11 mt-auto rounded-[14px] text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer ${
                            inCart
                                ? "bg-[#E5F5EC] text-[#1E6B43] border border-[#B8E6CB]"
                                : "bg-[#23201D] hover:bg-[#35312D] text-white shadow-2xs active:scale-[0.99]"
                        }`}
                    >
                        {inCart ? (
                            <>
                                <Check size={15} strokeWidth={2.2} /> In Cart
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={15} strokeWidth={2} /> Add to Cart
                            </>
                        )}
                    </button>
                ) : (
                    <div className="w-full h-11 mt-auto rounded-[14px] bg-[#EDE8E0] text-[#9C968D] text-xs font-semibold flex items-center justify-center select-none cursor-not-allowed">
                        Out of Stock
                    </div>
                )}
            </div>
        </div>
    );
}



