import { Sparkles } from "lucide-react";
import { Icons } from "../ui";

export function ProductGallery({
    product,
    imgIdx,
    setImgIdx,
    badgeLabel,
    isPurpleBadge,
    wished,
    onToggleWishlist,
}) {
    return (
        <div className="pd-gallery-wrap">
            <div className="pd-main-img-box">
                <img
                    src={product.images?.[imgIdx] || product.images?.[0]}
                    alt={product.name}
                    className="pd-main-img"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                            "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop";
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
                    onClick={onToggleWishlist}
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
    );
}
