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
            className="product-card-container group relative cursor-pointer"
            style={{
                background: "#FCFAF7",
                borderRadius: "24px",
                border: "1px solid #EFE8DF",
                padding: "18px 20px 20px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                boxShadow: "0 4px 20px rgba(45,31,59,0.03)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onClick={() => navigate(`/product/${product.id}`)}
        >
            {/* 1. DOMINANT PRODUCT IMAGE CONTAINER WITH 14PX MARGIN BELOW */}
            <div
                className="product-card-image-wrap relative shrink-0 w-full overflow-hidden"
                style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    backgroundColor: "#F4EFE6",
                    borderRadius: "18px",
                    overflow: "hidden",
                    marginBottom: "14px",
                    border: "1px solid rgba(239, 232, 223, 0.8)",
                }}
            >
                <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover block transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
                    }}
                />

                {/* ELEGANT TOP-LEFT OVERLAY BADGE */}
                {badgeLabel && (
                    <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                        <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase backdrop-blur-xs shadow-2xs ${
                                badgeLabel === "OUT OF STOCK"
                                    ? "bg-[#23201D]/90 text-white"
                                    : isPurpleBadge
                                    ? "bg-[#8E63B0]/95 text-white"
                                    : "bg-[#FDF2F4] text-[#D94E67] border border-[#F9D2DC]"
                            }`}
                        >
                            {isPurpleBadge && <Sparkles size={9} className="fill-current" />}
                            {badgeLabel}
                        </span>
                    </div>
                )}

                {/* SLEEK TOP-RIGHT WISHLIST HEART */}
                <button
                    className="absolute top-2.5 right-2.5 z-10 w-8.5 h-8.5 rounded-full bg-white/90 backdrop-blur-xs shadow-2xs flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-white"
                    onClick={handleWish}
                    title={wished ? "Remove from wishlist" : "Save to wishlist"}
                    aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                >
                    <Icons.Heart filled={wished} />
                </button>
            </div>

            {/* 2. PRODUCT DETAILS WITH BALANCED COMPACT VERTICAL RHYTHM */}
            <div className="flex flex-col flex-1" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                {/* ROW 1: CATEGORY LABEL (7PX MARGIN TO TITLE) */}
                <p
                    className="product-card-category"
                    style={{
                        fontSize: "10.5px",
                        fontWeight: 700,
                        color: "#8C847B",
                        letterSpacing: "2.2px",
                        textTransform: "uppercase",
                        marginBottom: "7px",
                        lineHeight: 1.35,
                    }}
                >
                    {cleanSubcategory}
                </p>

                {/* ROW 2: PRODUCT TITLE (10PX MARGIN TO RATING) */}
                <h3
                    className="product-card-title font-serif group-hover:text-[#8E63B0] transition-colors"
                    style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        fontSize: "19px",
                        fontWeight: 400,
                        color: "#231A2E",
                        lineHeight: 1.35,
                        marginBottom: "10px",
                    }}
                >
                    {product.name}
                </h3>

                {/* ROW 3: DEDICATED RATING ROW (10PX MARGIN TO PRICE) */}
                <div
                    className="product-card-rating-row"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "10px",
                        fontSize: "12.5px",
                        color: "#7A7268",
                    }}
                >
                    {product.reviewCount > 0 ? (
                        <>
                            <Stars n={Math.floor(product.rating)} size={11.5} />
                            <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#231A2E" }}>
                                {product.rating.toFixed(1)}
                            </span>
                            <span style={{ fontSize: "12px", color: "#8C847B" }}>
                                ({product.reviewCount} reviews)
                            </span>
                        </>
                    ) : (
                        <span style={{ fontSize: "12px", color: "#8C847B", fontWeight: 500 }}>
                            No reviews yet
                        </span>
                    )}
                </div>

                {/* ROW 4: PRICE SECTION (18PX MARGIN TO ADD TO CART) */}
                <div
                    className="product-card-price-row"
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "10px",
                        marginBottom: "18px",
                    }}
                >
                    <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "24px", fontWeight: 700, color: "#1E1428", lineHeight: 1 }}>
                        ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span style={{ fontSize: "13.5px", color: "#A0988E", textDecoration: "line-through", fontWeight: 400 }}>
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                    )}
                </div>

                {/* ROW 5: PROPORTIONATE ADD TO CART BUTTON SEPARATED AT BOTTOM */}
                <div className="product-card-cta-wrap mt-auto" style={{ marginTop: "auto", paddingTop: "2px" }}>
                    {product.inStock ? (
                        <button
                            onClick={handleAdd}
                            style={{
                                width: "100%",
                                height: "42px",
                                borderRadius: "14px",
                                fontSize: "12.5px",
                                fontWeight: 600,
                                letterSpacing: "0.3px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "7px",
                                transition: "all 0.2s ease",
                                cursor: "pointer",
                                border: "none",
                                background: inCart ? "#E5F5EC" : "#2D1F3B",
                                color: inCart ? "#1E6B43" : "#FFFFFF",
                                boxShadow: "0 2px 8px rgba(45, 31, 59, 0.08)",
                            }}
                        >
                            {inCart ? (
                                <>
                                    <Check size={14} strokeWidth={2.2} />
                                    <span>In Cart</span>
                                </>
                            ) : (
                                <>
                                    <ShoppingBag size={14} strokeWidth={1.8} />
                                    <span>Add to Cart</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <div
                            style={{
                                width: "100%",
                                height: "42px",
                                borderRadius: "14px",
                                background: "#EDE8E0",
                                color: "#9C968D",
                                fontSize: "12.5px",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                userSelect: "none",
                                cursor: "not-allowed",
                            }}
                        >
                            Out of Stock
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
