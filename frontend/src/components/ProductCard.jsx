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
                borderRadius: "28px",
                border: "1px solid #EFE8DF",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                boxShadow: "0 4px 24px rgba(45,31,59,0.03)",
                transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
            }}
            onClick={() => navigate(`/product/${product.id}`)}
        >
            {/* 1. DOMINANT PRODUCT IMAGE CONTAINER WITH 20PX MARGIN BELOW */}
            <div
                className="product-card-image-wrap relative shrink-0 w-full overflow-hidden"
                style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: "1 / 1",
                    backgroundColor: "#F4EFE6",
                    borderRadius: "22px",
                    overflow: "hidden",
                    marginBottom: "20px",
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
                    <div className="absolute top-3 left-3 z-10 pointer-events-none">
                        <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10.5px] font-semibold tracking-wider uppercase backdrop-blur-xs shadow-2xs ${
                                badgeLabel === "OUT OF STOCK"
                                    ? "bg-[#23201D]/90 text-white"
                                    : isPurpleBadge
                                    ? "bg-[#8E63B0]/95 text-white"
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
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs shadow-2xs flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 hover:bg-white"
                    onClick={handleWish}
                    title={wished ? "Remove from wishlist" : "Save to wishlist"}
                    aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                >
                    <Icons.Heart filled={wished} />
                </button>
            </div>

            {/* 2. PRODUCT DETAILS WITH 14PX, 16PX, 16PX, 22PX STRICT VERTICAL RHYTHM */}
            <div className="flex flex-col flex-1" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                {/* ROW 1: CATEGORY LABEL (14PX MARGIN TO TITLE) */}
                <p
                    className="product-card-category"
                    style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "#8C847B",
                        letterSpacing: "2.5px",
                        textTransform: "uppercase",
                        marginBottom: "14px",
                        lineHeight: 1.4,
                    }}
                >
                    {cleanSubcategory}
                </p>

                {/* ROW 2: PRODUCT TITLE (16PX MARGIN TO RATING, INCREASED LINE HEIGHT 1.45) */}
                <h3
                    className="product-card-title font-serif group-hover:text-[#8E63B0] transition-colors"
                    style={{
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        fontSize: "20px",
                        fontWeight: 400,
                        color: "#231A2E",
                        lineHeight: 1.45,
                        marginBottom: "16px",
                    }}
                >
                    {product.name}
                </h3>

                {/* ROW 3: DEDICATED RATING ROW (16PX MARGIN TO PRICE) */}
                <div
                    className="product-card-rating-row"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "16px",
                        fontSize: "13px",
                        color: "#7A7268",
                    }}
                >
                    {product.reviewCount > 0 ? (
                        <>
                            <Stars n={Math.floor(product.rating)} size={12} />
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#231A2E" }}>
                                {product.rating.toFixed(1)}
                            </span>
                            <span style={{ fontSize: "12.5px", color: "#8C847B" }}>
                                ({product.reviewCount} reviews)
                            </span>
                        </>
                    ) : (
                        <span style={{ fontSize: "12.5px", color: "#8C847B", fontWeight: 500 }}>
                            No reviews yet
                        </span>
                    )}
                </div>

                {/* ROW 4: PRICE & DISCOUNT SECTION (22PX MARGIN TO ADD TO CART) */}
                <div
                    className="product-card-price-row"
                    style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: "10px",
                        marginBottom: "22px",
                    }}
                >
                    <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "25px", fontWeight: 700, color: "#1E1428", lineHeight: 1 }}>
                        ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                        <span style={{ fontSize: "14px", color: "#A0988E", textDecoration: "line-through", fontWeight: 400 }}>
                            ₹{product.originalPrice.toLocaleString("en-IN")}
                        </span>
                    )}
                    {discount > 0 && (
                        <span style={{ marginLeft: "auto", background: "#FDF2F4", color: "#D94E67", fontWeight: 600, fontSize: "10.5px", padding: "3px 10px", borderRadius: "20px", border: "1px solid #F9D2DC" }}>
                            {discount}% OFF
                        </span>
                    )}
                </div>

                {/* ROW 5: PROPORTIONATE ADD TO CART BUTTON SEPARATED AT BOTTOM */}
                <div className="product-card-cta-wrap mt-auto" style={{ marginTop: "auto", paddingTop: "4px" }}>
                    {product.inStock ? (
                        <button
                            onClick={handleAdd}
                            style={{
                                width: "100%",
                                height: "44px",
                                borderRadius: "16px",
                                fontSize: "13px",
                                fontWeight: 600,
                                letterSpacing: "0.4px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "8px",
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
                        <div
                            style={{
                                width: "100%",
                                height: "44px",
                                borderRadius: "16px",
                                background: "#EDE8E0",
                                color: "#9C968D",
                                fontSize: "13px",
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
