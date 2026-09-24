import { useNavigate } from "react-router";
import { Stars } from "./ui";
import { Icons } from "./ui";
import { useCart, useWishlist, useToast } from "../hooks";
import { ShoppingBag, Check, Sparkles } from "lucide-react";

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

    // Clean subcategory tracking label
    const cleanSubcategory = (() => {
        const raw = product.subcategory || product.category || "Stationery";
        const cleaned = raw.replace(/^general\s+/i, "").trim();
        return cleaned ? cleaned.toUpperCase() : "STATIONERY";
    })();

    const discount = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    // Minimalist primary badge
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
            className="group relative bg-[#FCFAF7] rounded-[26px] border border-[#EFE8DF] overflow-hidden flex flex-col h-full shadow-[0_4px_24px_rgba(45,31,59,0.03)] hover:shadow-[0_16px_40px_rgba(45,31,59,0.08)] transition-all duration-300 cursor-pointer p-4 sm:p-5 md:p-6"
            onClick={() => navigate(`/product/${product.id}`)}
        >
            {/* 1. DOMINANT PRODUCT IMAGE CONTAINER */}
            <div className={`relative bg-[#F4EFE6] rounded-[22px] overflow-hidden shrink-0 w-full mb-5 border border-[#EFE8DF]/60 shadow-2xs ${compact ? "h-[180px]" : "aspect-square"}`}>
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
                    }}
                />

                {/* ELEGANT TOP-LEFT OVERLAY BADGE */}
                {badgeLabel && (
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10.5px] font-semibold tracking-wider uppercase backdrop-blur-xs shadow-2xs ${
                                badgeLabel === "OUT OF STOCK"
                                    ? "bg-[#23201D]/90 text-white"
                                    : isPurpleBadge
                                    ? "bg-[#9B72BF]/95 text-white"
                                    : "bg-[#FDF2F4] text-[#D94E67] border border-[#F9D2DC]"
                            }`}
                        >
                            {isPurpleBadge && <Sparkles size={10} className="fill-current" />}
                            {badgeLabel}
                        </span>
                    </div>
                )}

                {/* SLEEK TOP-RIGHT WISHLIST HEART */}
                <button
                    className="absolute top-3 right-3 z-10 w-9.5 h-9.5 rounded-full bg-white/90 backdrop-blur-xs shadow-xs flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-white"
                    onClick={handleWish}
                    title={wished ? "Remove from wishlist" : "Save to wishlist"}
                    aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                >
                    <Icons.Heart filled={wished} />
                </button>
            </div>

            {/* 2. PRODUCT DETAILS WITH GENEROUS VERTICAL HIERARCHY */}
            <div className="flex flex-col flex-1">
                {/* ROW 1: CATEGORY LABEL */}
                <p className="text-[10.5px] font-semibold text-[#8C847B] tracking-[2.2px] uppercase mb-1.5">
                    {cleanSubcategory}
                </p>

                {/* ROW 2: PRODUCT TITLE */}
                <h3 className="font-serif text-[19px] sm:text-[21px] font-normal text-[#231A2E] leading-[1.3] line-clamp-2 group-hover:text-[#9B72BF] transition-colors mb-3">
                    {product.name}
                </h3>

                {/* ROW 3: DEDICATED RATING ROW */}
                <div className="flex items-center gap-2 mb-4 pt-0.5">
                    {product.reviewCount > 0 ? (
                        <>
                            <Stars n={Math.floor(product.rating)} size={12} />
                            <span className="text-[12.5px] font-semibold text-[#231A2E]">
                                {product.rating.toFixed(1)}
                            </span>
                            <span className="text-[12.5px] text-[#7A7268]">
                                ({product.reviewCount} reviews)
                            </span>
                        </>
                    ) : (
                        <span className="text-[12.5px] text-[#7A7268] font-medium">
                            No reviews yet
                        </span>
                    )}
                </div>

                {/* ROW 4: PRICE & DISCOUNT SECTION */}
                <div className="flex items-baseline gap-2.5 my-3 py-0.5">
                    <span className="font-serif text-[24px] sm:text-[26px] font-bold text-[#1E1428] leading-none">
                        ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-[14px] text-[#A0988E] line-through font-normal">
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                    )}
                    {discount > 0 && (
                        <span className="ml-auto bg-[#FDF2F4] text-[#D94E67] font-semibold text-[11px] px-2.5 py-1 rounded-full border border-[#F9D2DC]">
                            {discount}% OFF
                        </span>
                    )}
                </div>

                {/* ROW 5: PROPORTIONATE ADD TO CART BUTTON (SEPARATED AT BOTTOM) */}
                <div className="mt-auto pt-3">
                    {product.inStock ? (
                        <button
                            onClick={handleAdd}
                            className={`w-full h-11 rounded-[16px] text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer active:scale-[0.99] ${
                                inCart
                                    ? "bg-[#E5F5EC] text-[#1E6B43] border border-[#B8E6CB]"
                                    : "bg-[#2D1F3B] hover:bg-[#3E2C4C] text-white shadow-xs hover:shadow-sm"
                            }`}
                        >
                            {inCart ? (
                                <>
                                    <Check size={15} strokeWidth={2.2} />
                                    <span>In Cart</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={15} strokeWidth={1.8} />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <div className="w-full h-11 rounded-[16px] bg-[#EDE8E0] text-[#9C968D] text-[13px] font-semibold flex items-center justify-center select-none cursor-not-allowed">
                            Out of Stock
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
