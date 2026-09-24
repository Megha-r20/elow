import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { REVIEWS } from "../data";
import { PRODUCTS } from "../data/products.js";
import { useCart, useWishlist, useToast, useDrawer, useDocumentTitle } from "../hooks";
import { Stars, QtyStepper, Icons, SectionHead } from "../components/ui";
import { ProductCard } from "../components/ProductCard";
import { getApiUrl } from "../api/config";
import {
    ShoppingBag, Check, ArrowRight, Leaf, Gift, Truck,
    Sparkles, ShieldCheck, RefreshCw, Send, Star, ChevronRight
} from "lucide-react";
import "./ProductDetail.css";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    useDocumentTitle(product?.name || "Product Details — Elow");

    const { addItem, isInCart } = useCart();
    const { has, toggle } = useWishlist();
    const { addToast } = useToast();
    const { openCart } = useDrawer();

    const [imgIdx, setImgIdx] = useState(0);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState(0);
    const [apiReviews, setApiReviews] = useState([]);
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

    // Write Review Modal / Inline state
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [newRating, setNewRating] = useState(5);
    const [newTitle, setNewTitle] = useState("");
    const [newComment, setNewComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);

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
            const staticProd = PRODUCTS.find((p) => String(p.id) === String(id));
            if (staticProd) {
                setProduct(staticProd);
                setRelated(
                    PRODUCTS.filter(
                        (p) => p.category === staticProd.category && String(p.id) !== String(id)
                    ).slice(0, 4)
                );
            } else {
                setProduct(null);
            }
            setLoading(false);
        }
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="pd-wrapper flex items-center justify-center min-h-screen">
                <div className="text-center p-8">
                    <div className="w-10 h-10 border-4 border-[#9B72BF] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-[14.5px] font-medium text-[#78726A]">Loading product details...</p>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pd-wrapper flex items-center justify-center min-h-screen">
                <div className="bg-[#FCFAF7] border border-[#EFE8DF] rounded-[24px] p-8 max-w-md w-full text-center shadow-sm">
                    <h2 className="font-serif text-2xl font-normal text-[#1E1528] mb-3">Product Not Found</h2>
                    <p className="text-sm text-[#78726A] mb-6">The item you are looking for does not exist or has been relocated.</p>
                    <button
                        className="bg-[#2D1F3B] hover:bg-[#3E2C4C] text-white px-6 py-3 rounded-[16px] text-xs font-semibold"
                        onClick={() => navigate("/shop")}
                    >
                        Back to Shop
                    </button>
                </div>
            </div>
        );
    }

    const wished = has(product.id);
    const inCart = isInCart(product.id);

    const staticReviews = REVIEWS.filter((r) => r.productId === product.id);
    const approvedApiReviews = apiReviews.map((r) => ({
        id: r.id || r._id,
        productId: r.productId,
        name: r.userName || "Verified Buyer",
        rating: r.rating,
        title: r.title,
        text: r.comment,
        date: r.createdAt
            ? new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : "Recent",
        verified: r.verifiedPurchase ?? true,
        avatar: r.avatar,
    }));
    const reviews = [...approvedApiReviews, ...staticReviews.filter((s) => !approvedApiReviews.some((a) => a.id === s.id))];

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

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (!newsletterEmail.trim()) return;
        setNewsletterSubscribed(true);
        addToast("Thank you for subscribing to Elow updates!", "success");
        setNewsletterEmail("");
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setSubmittingReview(true);
        try {
            const res = await fetch(getApiUrl("/api/reviews"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: product.id,
                    rating: newRating,
                    title: newTitle,
                    comment: newComment,
                }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.review) {
                    setApiReviews((prev) => [data.review, ...prev]);
                }
                addToast("Review submitted successfully!", "success");
                setShowReviewModal(false);
                setNewTitle("");
                setNewComment("");
            } else {
                addToast("Thank you! Review added.", "info");
                setShowReviewModal(false);
            }
        } catch (_err) {
            addToast("Review logged. Thank you!", "info");
            setShowReviewModal(false);
        }
        setSubmittingReview(false);
    };

    return (
        <div className="pd-wrapper">
            <div className="pd-container">
                {/* 1. BREADCRUMBS */}
                <div className="pd-breadcrumb-wrap">
                    <nav className="pd-breadcrumb" aria-label="Breadcrumb">
                        <Link to="/">Home</Link>
                        <span className="pd-breadcrumb-sep">/</span>
                        <Link to="/shop">Shop</Link>
                        <span className="pd-breadcrumb-sep">/</span>
                        <Link to={`/shop?cat=${product.category}`}>{cleanSubcategory}</Link>
                        <span className="pd-breadcrumb-sep">/</span>
                        <span className="pd-breadcrumb-current">{product.shortName || product.name}</span>
                    </nav>
                </div>

                {/* 2. MAIN PRODUCT SECTION (DESKTOP 2-COLUMN LUXURY GRID) */}
                <div className="pd-main-card">
                    {/* LEFT: IMAGE GALLERY & THUMBNAILS */}
                    <div className="pd-gallery-wrap">
                        <div className="pd-main-img-box">
                            <img
                                src={product.images?.[imgIdx] || product.images?.[0]}
                                alt={product.name}
                                className="pd-main-img"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
                                }}
                            />

                            {/* OVERLAY BADGE */}
                            {badgeLabel && (
                                <div className="pd-badge-overlay">
                                    <span
                                        className={`pd-badge ${
                                            badgeLabel === "OUT OF STOCK"
                                                ? "pd-badge-dark"
                                                : isPurpleBadge
                                                ? "pd-badge-purple"
                                                : "pd-badge-pink"
                                        }`}
                                    >
                                        {isPurpleBadge && <Sparkles size={11} />}
                                        {badgeLabel}
                                    </span>
                                </div>
                            )}

                            {/* FLOATING WISHLIST BUTTON */}
                            <button
                                className="pd-wish-btn"
                                onClick={() => {
                                    toggle(product.id);
                                    addToast(wished ? "Removed from wishlist" : "Saved to wishlist", "info");
                                }}
                                title={wished ? "Remove from wishlist" : "Save to wishlist"}
                                aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
                            >
                                <Icons.Heart filled={wished} />
                            </button>
                        </div>

                        {/* THUMBNAIL CAROUSEL */}
                        {product.images && product.images.length > 1 && (
                            <div className="pd-thumbnails-row">
                                {product.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImgIdx(i)}
                                        className={`pd-thumb-btn ${imgIdx === i ? "active" : ""}`}
                                    >
                                        <img src={img} alt="" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT: PRODUCT INFORMATION & ACTIONS */}
                    <div className="pd-info-col">
                        {/* Subcategory Label */}
                        <p className="pd-category-tag">{cleanSubcategory}</p>
                        <div className="pd-category-line" />

                        {/* Product Title */}
                        <h1 className="pd-product-title">{product.name}</h1>

                        {/* Rating & Stock Status Bar */}
                        <div className="pd-rating-stock-bar">
                            {product.reviewCount > 0 ? (
                                <>
                                    <Stars n={Math.floor(product.rating)} size={14} />
                                    <span className="pd-rating-score">{product.rating.toFixed(1)}</span>
                                    <span className="pd-rating-count">({product.reviewCount} reviews)</span>
                                </>
                            ) : (
                                <span className="pd-rating-count">No reviews yet</span>
                            )}
                            <span className="pd-divider-dot">·</span>
                            <span className={`pd-stock-text ${product.inStock ? "pd-stock-in" : "pd-stock-out"}`}>
                                {product.inStock ? `In Stock (${product.stockCount} left)` : "Out of Stock"}
                            </span>
                        </div>

                        {/* Price Hierarchy */}
                        <div className="pd-price-wrap">
                            <span className="pd-price-current">
                                ₹{product.price.toLocaleString("en-IN")}
                            </span>
                            {product.originalPrice && product.originalPrice > product.price && (
                                <span className="pd-price-original">
                                    ₹{product.originalPrice.toLocaleString("en-IN")}
                                </span>
                            )}
                            {disc > 0 && (
                                <span className="pd-discount-badge">
                                    {disc}% OFF
                                </span>
                            )}
                        </div>
                        {disc > 0 && (
                            <p className="pd-savings-banner">
                                You save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")} ({disc}% off)
                            </p>
                        )}

                        {/* Benefit Highlights Cards */}
                        <div className="pd-benefits-bar">
                            <div className="pd-benefit-item">
                                <Leaf size={18} className="pd-benefit-icon" />
                                <span className="pd-benefit-label">Premium Quality</span>
                            </div>
                            <div className="pd-benefit-item">
                                <Gift size={18} className="pd-benefit-icon" />
                                <span className="pd-benefit-label">Great Gifting</span>
                            </div>
                            <div className="pd-benefit-item">
                                <Truck size={18} className="pd-benefit-icon" />
                                <span className="pd-benefit-label">Fast Delivery</span>
                            </div>
                        </div>

                        {/* Short Description */}
                        <p className="pd-description-text">{product.description}</p>

                        {/* Quantity Stepper */}
                        {product.inStock && (
                            <div className="pd-qty-wrap">
                                <p className="pd-section-label">QUANTITY</p>
                                <QtyStepper
                                    qty={qty}
                                    onAdd={() => setQty((q) => Math.min(q + 1, product.stockCount))}
                                    onSub={() => setQty((q) => Math.max(q - 1, 1))}
                                    max={product.stockCount}
                                />
                            </div>
                        )}

                        {/* Action Buttons */}
                        {product.inStock ? (
                            <div className="pd-cta-row">
                                <button
                                    onClick={handleAdd}
                                    className={`pd-btn-cart ${
                                        inCart ? "pd-btn-cart-added" : "pd-btn-cart-primary"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {inCart ? <Check size={18} strokeWidth={2.2} /> : <ShoppingBag size={18} strokeWidth={2} />}
                                        <span>{inCart ? "Added to Cart" : "Add to Cart"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-normal opacity-90">
                                            ₹{(product.price * qty).toLocaleString("en-IN")}
                                        </span>
                                        {inCart ? <Check size={16} /> : <ArrowRight size={16} />}
                                    </div>
                                </button>

                                <button
                                    onClick={() => {
                                        handleAdd();
                                        navigate("/checkout");
                                    }}
                                    className="pd-btn-buy"
                                >
                                    Buy Now
                                </button>
                            </div>
                        ) : (
                            <button disabled className="pd-btn-disabled">
                                Out of Stock
                            </button>
                        )}

                        {/* Shipping & Security Trust Notes */}
                        <div className="pd-trust-notes">
                            <div className="pd-trust-note-item">
                                <Truck size={15} />
                                <span>Dispatches in 1–3 business days</span>
                            </div>
                            <div className="pd-trust-note-item">
                                <ShieldCheck size={15} />
                                <span>100% Secure Payments</span>
                            </div>
                            <div className="pd-trust-note-item">
                                <RefreshCw size={15} />
                                <span>30-Day Easy Returns</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. PRODUCT INFORMATION TABS SECTION */}
                <div className="pd-tabs-card">
                    <div className="pd-tabs-nav">
                        {[
                            "Product Details",
                            "Specifications",
                            "What's Included",
                            `Reviews (${reviews.length || product.reviewCount})`,
                        ].map((tabLabel, idx) => (
                            <button
                                key={tabLabel}
                                onClick={() => setActiveTab(idx)}
                                className={`pd-tab-item ${activeTab === idx ? "active" : ""}`}
                            >
                                {tabLabel}
                            </button>
                        ))}
                    </div>

                    <div className="pd-tab-content">
                        {/* TAB 0: PRODUCT DETAILS */}
                        {activeTab === 0 && (
                            <div>
                                <h3 className="pd-tab-heading">Product Overview</h3>
                                <p className="pd-description-text mb-6">{product.description}</p>
                                {product.details && product.details.length > 0 && (
                                    <ul className="pd-details-list">
                                        {product.details.map((item, i) => (
                                            <li key={i}>
                                                <span className="pd-check-icon">✓</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}

                        {/* TAB 1: CLEAN 2-COLUMN SPECIFICATIONS */}
                        {activeTab === 1 && (
                            <div>
                                <h3 className="pd-tab-heading">Specifications & Details</h3>
                                <div className="pd-specs-grid">
                                    <div className="pd-spec-item">
                                        <span className="pd-spec-label">Subcategory</span>
                                        <span className="pd-spec-value">{cleanSubcategory}</span>
                                    </div>
                                    <div className="pd-spec-item">
                                        <span className="pd-spec-label">SKU Identifier</span>
                                        <span className="pd-spec-value">ELOW-{product.id.toUpperCase()}</span>
                                    </div>
                                    <div className="pd-spec-item">
                                        <span className="pd-spec-label">Availability</span>
                                        <span className="pd-spec-value">
                                            {product.inStock ? `${product.stockCount} units in stock` : "Out of Stock"}
                                        </span>
                                    </div>
                                    <div className="pd-spec-item">
                                        <span className="pd-spec-label">Rating</span>
                                        <span className="pd-spec-value">{product.rating.toFixed(1)} / 5.0</span>
                                    </div>
                                    <div className="pd-spec-item">
                                        <span className="pd-spec-label">Verified Reviews</span>
                                        <span className="pd-spec-value">{product.reviewCount} customer reviews</span>
                                    </div>
                                    <div className="pd-spec-item">
                                        <span className="pd-spec-label">Estimated Shipping</span>
                                        <span className="pd-spec-value">Standard Dispatch (1–3 Days)</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: WHAT'S INCLUDED */}
                        {activeTab === 2 && (
                            <div>
                                <h3 className="pd-tab-heading">What's Included in Package</h3>
                                {product.details && product.details.length > 0 ? (
                                    <ul className="pd-details-list">
                                        {product.details.map((item, i) => (
                                            <li key={i}>
                                                <span className="pd-check-icon">✦</span>
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="pd-description-text">
                                        Each package includes 1x premium authentic {product.name} crafted with eco-conscious archival paper.
                                    </p>
                                )}
                            </div>
                        )}

                        {/* TAB 3: REVIEWS BREAKDOWN & REVIEWS LIST */}
                        {activeTab === 3 && (
                            <div>
                                <div className="pd-reviews-summary-bar">
                                    <div className="pd-rating-big-box">
                                        <div className="pd-big-score">{product.rating.toFixed(1)}</div>
                                        <Stars n={Math.floor(product.rating)} size={16} />
                                        <p className="text-xs text-[#8C847B] mt-2">Based on {reviews.length || product.reviewCount} reviews</p>
                                    </div>

                                    <div className="pd-bars-column">
                                        {[5, 4, 3, 2, 1].map((starCount) => {
                                            const pct = starCount === 5 ? 78 : starCount === 4 ? 16 : starCount === 3 ? 4 : 2;
                                            return (
                                                <div key={starCount} className="pd-bar-row">
                                                    <span className="w-3 font-semibold text-[#1E1528]">{starCount}</span>
                                                    <Star size={12} className="text-[#F59E0B] fill-current" />
                                                    <div className="pd-bar-track">
                                                        <div className="pd-bar-fill" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="w-8 text-right text-[#8C847B]">{pct}%</span>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <div className="ml-auto">
                                        <button
                                            onClick={() => setShowReviewModal((prev) => !prev)}
                                            className="px-5 py-2.5 rounded-[14px] bg-[#2D1F3B] hover:bg-[#3E2C4C] text-white text-xs font-semibold cursor-pointer transition-all"
                                        >
                                            Write a Review
                                        </button>
                                    </div>
                                </div>

                                {/* Interactive Review Form Modal / Box */}
                                {showReviewModal && (
                                    <form onSubmit={handleReviewSubmit} className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-[20px] p-6 mb-8">
                                        <h4 className="font-serif text-lg font-normal text-[#1E1528] mb-3">Share Your Review</h4>
                                        <div className="flex items-center gap-2 mb-4">
                                            <span className="text-xs font-semibold text-[#78726A]">Rating:</span>
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <button
                                                    key={s}
                                                    type="button"
                                                    onClick={() => setNewRating(s)}
                                                    className="p-1 cursor-pointer text-[#F59E0B]"
                                                >
                                                    <Star size={18} className={s <= newRating ? "fill-current" : "opacity-30"} />
                                                </button>
                                            ))}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Review Headline (e.g. Absolutely beautiful quality!)"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                            className="w-full h-10 px-4 rounded-[12px] border border-[#EDE6DC] bg-white text-xs text-[#231A2E] mb-3 outline-none focus:border-[#9B72BF]"
                                        />
                                        <textarea
                                            placeholder="Tell us what you loved about this product..."
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            rows={3}
                                            required
                                            className="w-full p-4 rounded-[12px] border border-[#EDE6DC] bg-white text-xs text-[#231A2E] mb-4 outline-none focus:border-[#9B72BF]"
                                        />
                                        <div className="flex gap-3 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setShowReviewModal(false)}
                                                className="px-4 py-2 text-xs font-semibold text-[#78726A]"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submittingReview}
                                                className="px-5 py-2 rounded-[12px] bg-[#9B72BF] hover:bg-[#8A5FB0] text-white text-xs font-semibold"
                                            >
                                                {submittingReview ? "Submitting..." : "Submit Review"}
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {/* Reviews List */}
                                <div className="pd-reviews-list">
                                    {reviews.map((rev) => (
                                        <div key={rev.id} className="pd-review-card">
                                            <div className="pd-reviewer-head">
                                                {rev.avatar ? (
                                                    <img src={rev.avatar} alt={rev.name} className="pd-avatar" />
                                                ) : (
                                                    <div className="pd-avatar">{rev.name?.[0] || "C"}</div>
                                                )}
                                                <div>
                                                    <p className="pd-reviewer-name">{rev.name}</p>
                                                    <div className="pd-review-meta">
                                                        <Stars n={rev.rating} size={11} />
                                                        <span className="pd-review-date">{rev.date}</span>
                                                        {rev.verified && (
                                                            <span className="pd-verified-badge">✓ Verified Buyer</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {rev.title && <h5 className="pd-review-title">"{rev.title}"</h5>}
                                            <p className="pd-review-text">{rev.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* 4. BRAND TRUST SECTION */}
                <div className="pd-trust-section">
                    <div className="pd-trust-card">
                        <div className="pd-trust-icon-box"><Leaf size={22} /></div>
                        <h4 className="pd-trust-title">Premium Quality</h4>
                        <p className="pd-trust-desc">Archival 100gsm eco-conscious paper</p>
                    </div>
                    <div className="pd-trust-card">
                        <div className="pd-trust-icon-box"><Truck size={22} /></div>
                        <h4 className="pd-trust-title">Fast Delivery</h4>
                        <p className="pd-trust-desc">Express shipping across 50+ cities</p>
                    </div>
                    <div className="pd-trust-card">
                        <div className="pd-trust-icon-box"><ShieldCheck size={22} /></div>
                        <h4 className="pd-trust-title">Secure Payments</h4>
                        <p className="pd-trust-desc">Encrypted UPI, Cards & NetBanking</p>
                    </div>
                    <div className="pd-trust-card">
                        <div className="pd-trust-icon-box"><RefreshCw size={22} /></div>
                        <h4 className="pd-trust-title">Easy Returns</h4>
                        <p className="pd-trust-desc">Hassle-free 30-day return policy</p>
                    </div>
                    <div className="pd-trust-card">
                        <div className="pd-trust-icon-box"><Gift size={22} /></div>
                        <h4 className="pd-trust-title">Gift Wrapping</h4>
                        <p className="pd-trust-desc">Complimentary aesthetic gift boxes</p>
                    </div>
                </div>

                {/* 5. YOU MAY ALSO LIKE / RELATED PRODUCTS */}
                {related.length > 0 && (
                    <div className="mb-16">
                        <SectionHead eyebrow="You May Also Like" title="More from This Category" />
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                            {related.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. SOPHISTICATED NEWSLETTER SECTION */}
                <div className="pd-newsletter-card">
                    <h3 className="pd-newsletter-heading">Join the Elow Journal</h3>
                    <p className="pd-newsletter-sub">
                        Subscribe to receive weekly desk inspiration, early drop access, and 10% off your first order.
                    </p>
                    <form onSubmit={handleNewsletterSubmit} className="pd-newsletter-form">
                        <input
                            type="email"
                            placeholder="Enter your email address..."
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            required
                            className="pd-newsletter-input"
                        />
                        <button type="submit" className="pd-newsletter-btn flex items-center gap-2">
                            <span>Subscribe</span>
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
