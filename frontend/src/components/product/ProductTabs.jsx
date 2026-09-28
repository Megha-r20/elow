import { Star } from "lucide-react";
import { Stars } from "../ui";

export function ProductTabs({
    product,
    cleanSubcategory,
    activeTab,
    setActiveTab,
    reviews,
    showReviewModal,
    setShowReviewModal,
    newRating,
    setNewRating,
    newTitle,
    setNewTitle,
    newComment,
    setNewComment,
    submittingReview,
    handleReviewSubmit,
}) {
    return (
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
                                <p className="text-xs text-[#8C847B] mt-2">
                                    Based on {reviews.length || product.reviewCount} reviews
                                </p>
                            </div>

                            <div className="pd-bars-column">
                                {[5, 4, 3, 2, 1].map((starCount) => {
                                    const pct =
                                        starCount === 5 ? 78 : starCount === 4 ? 16 : starCount === 3 ? 4 : 2;
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
                            <form
                                onSubmit={handleReviewSubmit}
                                className="bg-[#FAF7F2] border border-[#EAE3D9] rounded-[20px] p-6 mb-8"
                            >
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
    );
}
