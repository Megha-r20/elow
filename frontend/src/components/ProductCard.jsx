import { useNavigate } from "react-router";
import { Stars } from "./ui";
import { Icons } from "./ui";
import { useCart, useWishlist, useToast } from "../hooks";
import { ShoppingBag, Check, ArrowRight, Leaf, Gift, Truck, Sparkles } from "lucide-react";

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

    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    // Primary badge text
    let badgeLabel = null;
    let isPurpleBadge = false;
    if (!product.inStock) {
        badgeLabel = "OUT OF STOCK";
    } else if (product.isNew || product.badge === "NEW") {
        badgeLabel = "NEW";
        isPurpleBadge = true;
    } else if (product.isBestseller || product.badge === "BESTSELLER") {
        badgeLabel = "BESTSELLER";
        isPurpleBadge = true;
    } else if (discount > 0) {
        badgeLabel = `${discount}% OFF`;
    }

    return (
        <div
            className="group relative bg-[#FCFAF7] rounded-[24px] border border-[#EFE8DF] overflow-hidden flex flex-col h-full shadow-[0_4px_20px_rgba(45,31,59,0.04)] hover:shadow-[0_12px_32px_rgba(45,31,59,0.08)] transition-all duration-300 cursor-pointer p-4"
            onClick={() => navigate(`/product/${product.id}`)}
        >
            {/* 1. PRODUCT IMAGE CONTAINER */}
            <div className={`relative bg-[#F4EFE6] rounded-[20px] overflow-hidden shrink-0 w-full ${compact ? "h-[180px]" : "aspect-square"}`}>
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
                    }}
                />

                {/* TOP-LEFT OVERLAY BADGE */}
                {badgeLabel && (
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] font-bold uppercase tracking-wider shadow-xs ${
                                badgeLabel === "OUT OF STOCK"
                                    ? "bg-[#23201D] text-white"
                                    : isPurpleBadge
                                    ? "bg-[#9B72BF] text-white"
                                    : "bg-[#FCE8EC] text-[#D94E67] border border-[#F9D2DC]"
                            }`}
                        >
                            {isPurpleBadge && <Sparkles size={11} className="fill-current" />}
                            {badgeLabel}
                        </span>
                    </div>
                )}

                {/* TOP-RIGHT FLOATING WISHLIST HEART */}
                <button
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 shadow-md flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
                    onClick={handleWish}
                    title={wished ? "Remove from wishlist" : "Save to wishlist"}
                    aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                >
                    <Icons.Heart filled={wished} />
                </button>
            </div>

            {/* 2. PRODUCT INFO & DETAILS */}
            <div className="flex flex-col flex-1 pt-3.5 px-0.5">
                {/* Subcategory */}
                <p className="text-[10.5px] font-bold text-[#8A827A] tracking-[1.8px] uppercase mb-0.5">
                    {cleanSubcategory}
                </p>
                <div className="w-5 h-[2px] bg-[#9B72BF] rounded-full mb-2"></div>

                {/* Title */}
                <h3 className="font-serif text-[18px] font-normal text-[#1E1528] leading-tight line-clamp-1 group-hover:text-[#9B72BF] transition-colors mb-2">
                    {product.name}
                </h3>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-1.5 mb-2.5">
                    {product.reviewCount > 0 ? (
                        <>
                            <Stars n={Math.floor(product.rating)} size={12} />
                            <span className="text-[12px] font-semibold text-[#1E1528] ml-0.5">
                                {product.rating.toFixed(1)}
                            </span>
                            <span className="text-[12px] text-[#7A7268]">
                                ({product.reviewCount} reviews)
                            </span>
                        </>
                    ) : (
                        <span className="text-[12px] text-[#7A7268] font-medium">
                            No reviews yet
                        </span>
                    )}
                </div>

                {/* Price & Discount Row */}
                <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-serif text-[24px] font-bold text-[#1E1428] leading-none">
                        ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[14px] text-[#A0988E] line-through font-normal">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="ml-auto bg-[#FCE8EC] text-[#D94E67] font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-[#F9D2DC]">
                            {discount}% OFF
                        </span>
                    )}
                </div>

                {/* Benefit Highlights Row */}
                <div className="grid grid-cols-3 gap-1 py-2.5 my-1.5 border-y border-[#EDE6DC] text-center">
                    <div className="flex flex-col items-center gap-0.5">
                        <Leaf size={13} className="text-[#8A827A]" />
                        <span className="text-[9.5px] font-medium text-[#5E574F] leading-tight">Premium Quality</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5 border-x border-[#EDE6DC] px-0.5">
                        <Gift size={13} className="text-[#8A827A]" />
                        <span className="text-[9.5px] font-medium text-[#5E574F] leading-tight">Great Gifting</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        <Truck size={13} className="text-[#8A827A]" />
                        <span className="text-[9.5px] font-medium text-[#5E574F] leading-tight">Fast Delivery</span>
                    </div>
                </div>

                {/* Prominent Add to Cart Button */}
                {product.inStock ? (
                    <button
                        onClick={handleAdd}
                        className={`w-full h-11 mt-3 rounded-[16px] text-xs font-semibold flex items-center justify-between px-4 transition-all duration-200 cursor-pointer shadow-xs active:scale-[0.99] ${
                            inCart
                                ? "bg-[#E5F5EC] text-[#1E6B43] border border-[#B8E6CB]"
                                : "bg-[#2D1F3B] hover:bg-[#3E2C4C] text-white"
                        }`}
                    >
                        {inCart ? (
                            <>
                                <div className="flex items-center gap-2">
                                    <Check size={15} strokeWidth={2.2} />
                                    <span>In Cart</span>
                                </div>
                                <Check size={15} />
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-2">
                                    <ShoppingBag size={15} strokeWidth={2} />
                                    <span>Add to Cart</span>
                                </div>
                                <ArrowRight size={15} />
                            </>
                        )}
                    </button>
                ) : (
                    <div className="w-full h-11 mt-3 rounded-[16px] bg-[#EDE8E0] text-[#9C968D] text-xs font-semibold flex items-center justify-center select-none cursor-not-allowed">
                        Out of Stock
                    </div>
                )}
            </div>
        </div>
    );
}
