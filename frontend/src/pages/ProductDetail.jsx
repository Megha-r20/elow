import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { REVIEWS } from "../data";
import { PRODUCTS } from "../data/products.js";
import { useCart, useWishlist, useToast, useDrawer, useDocumentTitle } from "../hooks";
import { Stars, Badge, Price, Breadcrumb, QtyStepper, Divider, Icons, SectionHead } from "../components/ui";
import { ProductCard } from "../components/ProductCard";
import { getApiUrl } from "../api/config";
import { ShoppingBag, Check, ArrowRight, Leaf, Gift, Truck, Sparkles } from "lucide-react";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    useDocumentTitle(product?.name || "Product Details");
    const { addItem, isInCart } = useCart();
    const { has, toggle } = useWishlist();
    const { addToast } = useToast();
    const { openCart } = useDrawer();
    const [imgIdx, setImgIdx] = useState(0);
    const [qty, setQty] = useState(1);
    const [tab, setTab] = useState(0);
    const [apiReviews, setApiReviews] = useState([]);

    useEffect(() => {
        if (!id) return;
        async function fetchDetails() {
            setLoading(true);
            try {
                const res = await fetch(getApiUrl(`/api/products/${id}`));
                if (res.ok) {
                    const data = await res.json();
                    if (data.product) {
                        setProduct(data.product);
                        setApiReviews(data.reviews || []);
                        setRelated(data.related || []);
                        setLoading(false);
                        return;
                    }
                }
            } catch (_err) {
                /* fallback to static product */
            }
            const staticProd = PRODUCTS.find(p => String(p.id) === String(id));
            if (staticProd) {
                setProduct(staticProd);
                setRelated(PRODUCTS.filter(p => p.category === staticProd.category && String(p.id) !== String(id)).slice(0, 4));
            } else {
                setProduct(null);
            }
            setLoading(false);
        }
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#9B72BF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-[15px] font-medium text-[#7A7268]">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-8">
                <div className="bg-[#FCFAF7] border border-[#EFE8DF] rounded-[24px] p-8 max-w-md w-full text-center shadow-md">
                    <h2 className="font-serif text-2xl font-normal text-[#1E1528] mb-3">Product Not Found</h2>
                    <p className="text-sm text-[#7A7268] mb-6">The product you are looking for does not exist or has been removed.</p>
                    <button className="bg-[#2D1F3B] hover:bg-[#3E2C4C] text-white px-6 py-3 rounded-[16px] text-xs font-semibold" onClick={() => navigate("/shop")}>
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const wished = has(product.id);
    const inCart = isInCart(product.id);

    const staticReviews = REVIEWS.filter(r => r.productId === product.id);
    const approvedApiReviews = apiReviews.map(r => ({
        id: r.id || r._id,
        productId: r.productId,
        name: r.userName || "Verified Customer",
        rating: r.rating,
        title: r.title,
        text: r.comment,
        date: r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recent",
        verified: r.verifiedPurchase ?? true,
        avatar: r.avatar,
    }));
    const reviews = [...approvedApiReviews, ...staticReviews.filter(s => !approvedApiReviews.some(a => a.id === s.id))];

    const cleanSubcategory = (() => {
        const raw = product.subcategory || product.category || "Stationery";
        const cleaned = raw.replace(/^general\s+/i, "").trim();
        return cleaned ? cleaned.toUpperCase() : "STATIONERY";
    })();

    const disc = product.originalPrice && product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

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
    } else if (disc > 0) {
        badgeLabel = `${disc}% OFF`;
    }

    const handleAdd = () => {
        addItem(product, qty);
        addToast(`${product.shortName || product.name} added to cart`);
        openCart();
    };

    return (
        <div className="bg-[#FAF7F2] min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <Breadcrumb items={[
                    { label: "Home", href: "/" },
                    { label: "Shop", href: "/shop" },
                    { label: cleanSubcategory, href: `/shop?cat=${product.category}` },
                    { label: product.shortName || product.name },
                ]} />

                {/* ── MAIN REFERENCE PRODUCT CARD CONTAINER ──────────────── */}
                <div className="bg-[#FCFAF7] border border-[#EFE8DF] rounded-[32px] p-6 sm:p-8 md:p-10 shadow-[0_16px_48px_rgba(45,31,59,0.06)] grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-12">
                    
                    {/* LEFT COLUMN: IMAGE & THUMBNAILS GALLERY */}
                    <div>
                        {/* MAIN IMAGE CARD */}
                        <div className="relative bg-[#F4EFE6] rounded-[26px] overflow-hidden aspect-square w-full border border-[#EDE6DC] shadow-sm mb-4">
                            <img
                                src={product.images?.[imgIdx] || product.images?.[0]}
                                alt={product.name}
                                className="w-full h-full object-cover block"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
                                }}
                            />

                            {/* TOP-LEFT OVERLAY BADGE */}
                            {badgeLabel && (
                                <div className="absolute top-4 left-4 z-10 pointer-events-none">
                                    <span
                                        className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                                            badgeLabel === "OUT OF STOCK"
                                                ? "bg-[#23201D] text-white"
                                                : isPurpleBadge
                                                ? "bg-[#9B72BF] text-white"
                                                : "bg-[#FCE8EC] text-[#D94E67] border border-[#F9D2DC]"
                                        }`}
                                    >
                                        {isPurpleBadge && <Sparkles size={12} className="fill-current" />}
                                        {badgeLabel}
                                    </span>
                                </div>
                            )}

                            {/* TOP-RIGHT FLOATING WISHLIST HEART */}
                            <button
                                onClick={() => { toggle(product.id); addToast(wished ? "Removed from wishlist" : "Saved to wishlist", "info"); }}
                                className="absolute top-4 right-4 z-10 w-11 h-11 rounded-full bg-white/95 shadow-md flex items-center justify-center cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95 text-[#2D1F3B]"
                                title={wished ? "Remove from wishlist" : "Save to wishlist"}
                                aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                            >
                                <Icons.Heart filled={wished} />
                            </button>
                        </div>

                        {/* THUMBNAILS ROW */}
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-1">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImgIdx(i)}
                                        className={`w-20 h-20 rounded-[16px] overflow-hidden border-2 cursor-pointer transition-all duration-200 shrink-0 bg-[#F4EFE6] ${
                                            imgIdx === i ? "border-[#9B72BF] shadow-xs" : "border-[#EDE6DC] opacity-70 hover:opacity-100"
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: PRODUCT INFORMATION & ACTIONS */}
                    <div className="flex flex-col">
                        {/* Subcategory Label */}
                        <p className="text-[12px] font-bold text-[#8A827A] tracking-[2.2px] uppercase mb-1">
                            {cleanSubcategory}
                        </p>
                        <div className="w-8 h-[2.5px] bg-[#9B72BF] rounded-full mb-3.5"></div>

                        {/* Title */}
                        <h1 className="font-serif text-[32px] sm:text-[38px] md:text-[42px] font-normal text-[#1E1528] leading-[1.15] mb-3">
                            {product.name}
                        </h1>

                        {/* Rating & Stock Status */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            {product.reviewCount > 0 ? (
                                <>
                                    <Stars n={Math.floor(product.rating)} size={14} />
                                    <span className="text-[14px] font-bold text-[#1E1528]">{product.rating.toFixed(1)}</span>
                                    <span className="text-[13px] text-[#7A7268]">({product.reviewCount} reviews)</span>
                                </>
                            ) : (
                                <span className="text-[13px] text-[#7A7268] font-medium">No reviews yet</span>
                            )}
                            <span className="text-[#DDD6CB]">·</span>
                            <span className={`text-[13px] font-semibold ${product.inStock ? "text-[#1E6B43]" : "text-[#D94E67]"}`}>
                                {product.inStock ? `In Stock (${product.stockCount} left)` : "Out of Stock"}
                            </span>
                        </div>

                        {/* Price & Discount Row */}
                        <div className="flex items-baseline gap-3 mb-2">
                            <span className="font-serif text-[36px] sm:text-[42px] font-bold text-[#1E1428] leading-none">
                                ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="text-[20px] text-[#A0988E] line-through font-normal">
                                    ₹{product.originalPrice.toLocaleString("en-IN")}
                                </span>
                            )}
                            {disc > 0 && (
                                <span className="bg-[#FCE8EC] text-[#D94E67] font-bold text-xs px-3 py-1 rounded-full border border-[#F9D2DC]">
                                    {disc}% OFF
                                </span>
                            )}
                        </div>
                        {disc > 0 && (
                            <p className="text-[13px] text-[#7A7268] mb-5">
                                You save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")} ({disc}% off)
                            </p>
                        )}

                        {/* Feature Highlights Row (3 Benefits with Dividers) */}
                        <div className="grid grid-cols-3 gap-2 py-4 my-3 border-y border-[#EDE6DC] text-center">
                            <div className="flex flex-col items-center gap-1.5">
                                <Leaf size={18} className="text-[#8A827A]" />
                                <span className="text-[12px] font-medium text-[#4A423A]">Premium Quality</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5 border-x border-[#EDE6DC] px-2">
                                <Gift size={18} className="text-[#8A827A]" />
                                <span className="text-[12px] font-medium text-[#4A423A]">Great for Gifting</span>
                            </div>
                            <div className="flex flex-col items-center gap-1.5">
                                <Truck size={18} className="text-[#8A827A]" />
                                <span className="text-[12px] font-medium text-[#4A423A]">Fast Delivery</span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-[14.5px] text-[#5E574F] leading-relaxed my-4">
                            {product.description}
                        </p>

                        {/* Quantity Stepper */}
                        {product.inStock && (
                            <div className="mb-5">
                                <p className="text-[11px] font-bold text-[#8A827A] tracking-[1.5px] uppercase mb-2">QUANTITY</p>
                                <QtyStepper qty={qty} onAdd={() => setQty(q => Math.min(q + 1, product.stockCount))} onSub={() => setQty(q => Math.max(q - 1, 1))} max={product.stockCount} />
                            </div>
                        )}

                        {/* PROMINENT ADD TO CART BUTTON */}
                        {product.inStock ? (
                            <div className="flex flex-col sm:flex-row gap-3 mt-2">
                                <button
                                    onClick={handleAdd}
                                    className={`flex-1 h-[56px] rounded-[20px] text-[15px] font-semibold flex items-center justify-between px-6 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg active:scale-[0.99] ${
                                        inCart
                                            ? "bg-[#E5F5EC] text-[#1E6B43] border border-[#B8E6CB]"
                                            : "bg-[#2D1F3B] hover:bg-[#3E2C4C] text-white"
                                    }`}
                                >
                                    <div className="flex items-center gap-2.5">
                                        {inCart ? <Check size={18} strokeWidth={2.2} /> : <ShoppingBag size={18} strokeWidth={2} />}
                                        <span>{inCart ? "Added to Cart" : "Add to Cart"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-normal opacity-90">₹{(product.price * qty).toLocaleString("en-IN")}</span>
                                        {inCart ? <Check size={18} /> : <ArrowRight size={18} />}
                                    </div>
                                </button>
                                
                                <button
                                    onClick={() => { handleAdd(); navigate("/checkout"); }}
                                    className="h-[56px] px-6 rounded-[20px] bg-[#9B72BF] hover:bg-[#8A5FB0] text-white font-semibold text-[14px] transition-all duration-200 shadow-sm active:scale-[0.99]"
                                >
                                    Buy Now
                                </button>
                            </div>
                        ) : (
                            <div className="w-full h-[56px] rounded-[20px] bg-[#EDE8E0] text-[#9C968D] text-[14px] font-semibold flex items-center justify-center cursor-not-allowed">
                                Out of Stock
                            </div>
                        )}
                    </div>
                </div>

                {/* ── TABS: DETAILS & REVIEWS ──────────────────────────────── */}
                <div className="bg-[#FCFAF7] border border-[#EFE8DF] rounded-[24px] overflow-hidden mb-12 shadow-sm">
                    <div className="border-b border-[#EFE8DF] flex bg-[#FAF7F2]">
                        {["Product Details", `Reviews (${reviews.length || product.reviewCount})`].map((t, i) => (
                            <button
                                key={t}
                                onClick={() => setTab(i)}
                                className={`px-6 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
                                    tab === i ? "border-[#9B72BF] text-[#2D1F3B] bg-[#FCFAF7]" : "border-transparent text-[#8A827A] hover:text-[#2D1F3B]"
                                }`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 sm:p-8">
                        {tab === 0 && (
                            <div>
                                <h3 className="font-serif text-xl font-normal text-[#1E1528] mb-4">What's Included & Specifications</h3>
                                <ul className="space-y-2.5 mb-8">
                                    {product.details?.map((d, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-[#5E574F] leading-relaxed">
                                            <span className="text-[#9B72BF] mt-0.5"><Icons.Check /></span>
                                            {d}
                                        </li>
                                    ))}
                                </ul>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    {[
                                        { label: "Subcategory", value: cleanSubcategory },
                                        { label: "SKU", value: `ELOW-${product.id.toUpperCase()}` },
                                        { label: "Stock", value: product.inStock ? `${product.stockCount} items left` : "Out of Stock" },
                                        { label: "Rating", value: `${product.rating} / 5.0` },
                                        { label: "Reviews", value: `${product.reviewCount} verified` },
                                        { label: "Shipping", value: "Standard Dispatch (1–3 Days)" },
                                    ].map(s => (
                                        <div key={s.label} className="bg-[#F4EFE6] rounded-[16px] p-4 border border-[#EDE6DC]">
                                            <p className="text-[10px] font-bold text-[#8A827A] tracking-[1.5px] uppercase mb-1">{s.label}</p>
                                            <p className="text-sm font-semibold text-[#1E1528]">{s.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {tab === 1 && (
                            <div>
                                <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b border-[#EFE8DF] items-center">
                                    <div className="text-center sm:pr-8 sm:border-r border-[#EFE8DF]">
                                        <p className="font-serif text-5xl text-[#1E1528] leading-none mb-2">{product.rating.toFixed(1)}</p>
                                        <Stars n={Math.floor(product.rating)} size={16} />
                                        <p className="text-xs text-[#8A827A] mt-2">{product.reviewCount} total reviews</p>
                                    </div>
                                    <div className="flex-1 w-full space-y-2">
                                        {[5, 4, 3, 2, 1].map(n => {
                                            const pct = n === 5 ? 75 : n === 4 ? 17 : n === 3 ? 5 : n === 2 ? 2 : 1;
                                            return (
                                                <div key={n} className="flex items-center gap-3">
                                                    <span className="text-xs font-semibold text-[#1E1528] w-3">{n}</span>
                                                    <Icons.Star filled />
                                                    <div className="flex-1 bg-[#EDE6DC] rounded-full h-2 overflow-hidden">
                                                        <div className="bg-[#F59E0B] h-full rounded-full" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-xs text-[#8A827A] w-8">{pct}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {reviews.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-base font-semibold text-[#1E1528] mb-1">No reviews yet for this product</p>
                                        <p className="text-sm text-[#7A7268]">Be the first customer to share your thoughts!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {reviews.map(r => (
                                            <div key={r.id} className="pb-6 border-b border-[#EFE8DF] last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3 mb-2">
                                                    {r.avatar ? (
                                                        <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border border-[#EFE8DF]" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-[#9B72BF] text-white flex items-center justify-center font-bold text-sm">
                                                            {r.name?.[0] || "C"}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-sm font-bold text-[#1E1528]">{r.name}</p>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <Stars n={r.rating} size={11} />
                                                            <span className="text-xs text-[#8A827A]">{r.date}</span>
                                                            {r.verified && (
                                                                <span className="text-[10px] font-bold text-[#1E6B43] bg-[#E5F5EC] border border-[#B8E6CB] rounded-full px-2 py-0.5">
                                                                    ✓ Verified Buyer
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {r.title && <h5 className="text-sm font-bold text-[#1E1528] mt-2 mb-1">"{r.title}"</h5>}
                                                <p className="text-sm text-[#5E574F] leading-relaxed">{r.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RELATED PRODUCTS GRID ───────────────────────────────── */}
                {related.length > 0 && (
                    <div className="mt-12">
                        <SectionHead eyebrow="You May Also Like" title="More from This Category" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                            {related.map(p => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
