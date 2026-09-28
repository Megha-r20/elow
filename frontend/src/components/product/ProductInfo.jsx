import { Stars, QtyStepper } from "../ui";
import {
    ShoppingBag,
    Check,
    ArrowRight,
    Leaf,
    Gift,
    Truck,
    ShieldCheck,
    RefreshCw,
} from "lucide-react";

export function ProductInfo({
    product,
    cleanSubcategory,
    disc,
    qty,
    setQty,
    inCart,
    onAddToCart,
    onBuyNow,
}) {
    return (
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
                        onClick={onAddToCart}
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
                        onClick={onBuyNow}
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
    );
}
