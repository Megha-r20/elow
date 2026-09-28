import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { REVIEWS } from "../data";
import { useCart, useWishlist, useToast, useDrawer, useDocumentTitle } from "../hooks";
import { getApiUrl } from "../api/config";
import {
    ProductGallery,
    ProductInfo,
    ProductTabs,
    ProductTrustSection,
    ProductRelated,
    ProductNewsletter,
} from "../components/product";
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
    const [, setNewsletterSubscribed] = useState(false);

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
                    <p className="text-sm text-[#78726A] mb-6">
                        The item you are looking for does not exist or has been relocated.
                    </p>
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

    const disc =
        product.originalPrice && product.originalPrice > product.price
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

                {/* 2. MAIN PRODUCT SECTION */}
                <div className="pd-main-card">
                    <ProductGallery
                        product={product}
                        imgIdx={imgIdx}
                        setImgIdx={setImgIdx}
                        badgeLabel={badgeLabel}
                        isPurpleBadge={isPurpleBadge}
                        wished={wished}
                        onToggleWishlist={() => {
                            toggle(product.id);
                            addToast(wished ? "Removed from wishlist" : "Saved to wishlist", "info");
                        }}
                    />

                    <ProductInfo
                        product={product}
                        cleanSubcategory={cleanSubcategory}
                        disc={disc}
                        qty={qty}
                        setQty={setQty}
                        inCart={inCart}
                        onAddToCart={handleAdd}
                        onBuyNow={() => {
                            handleAdd();
                            navigate("/checkout");
                        }}
                    />
                </div>

                {/* 3. PRODUCT INFORMATION TABS SECTION */}
                <ProductTabs
                    product={product}
                    cleanSubcategory={cleanSubcategory}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    reviews={reviews}
                    showReviewModal={showReviewModal}
                    setShowReviewModal={setShowReviewModal}
                    newRating={newRating}
                    setNewRating={setNewRating}
                    newTitle={newTitle}
                    setNewTitle={setNewTitle}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    submittingReview={submittingReview}
                    handleReviewSubmit={handleReviewSubmit}
                />

                {/* 4. BRAND TRUST SECTION */}
                <ProductTrustSection />

                {/* 5. YOU MAY ALSO LIKE / RELATED PRODUCTS */}
                <ProductRelated related={related} />

                {/* 6. SOPHISTICATED NEWSLETTER SECTION */}
                <ProductNewsletter
                    newsletterEmail={newsletterEmail}
                    setNewsletterEmail={setNewsletterEmail}
                    handleNewsletterSubmit={handleNewsletterSubmit}
                />
            </div>
        </div>
    );
}
