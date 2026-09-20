import { useState } from "react";
import { useToast } from "../hooks";
import { useAuth } from "../context/AuthContext";
import { getApiUrl } from "../api/config";

export function ReviewModal({ isOpen, onClose, product, orderId, user }) {
  const { addToast } = useToast();
  const { authFetch } = useAuth();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen || !product) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Please enter a headline for your review");
      return;
    }
    if (!comment.trim()) {
      setErrorMsg("Please enter your review comments");
      return;
    }

    setErrorMsg("");
    setSubmitting(true);

    try {
      const res = await authFetch(getApiUrl(`/api/products/${product.id}/reviews`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          comment: comment.trim(),
          userName: user?.name || "Verified Customer",
          orderId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        addToast(`⭐ Thank you! Your review for "${product.name}" has been submitted.`, "success");
        onClose();
        // Reset form
        setTitle("");
        setComment("");
        setRating(5);
      } else {
        setErrorMsg(data.error || "Failed to submit review");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      setErrorMsg("Network error submitting review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 950,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(35, 32, 29, 0.55)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />

      {/* Modal Card */}
      <div
        style={{
          position: "relative",
          zIndex: 960,
          width: "100%",
          maxWidth: 520,
          background: "#FFFFFF",
          borderRadius: 24,
          padding: "32px 28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          border: "1px solid #EAE3D9",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            background: "#F4EFE6",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            cursor: "pointer",
            fontSize: 16,
            fontWeight: "bold",
            color: "#6E6A63",
          }}
        >
          ✕
        </button>

        {/* Product Preview */}
        <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              overflow: "hidden",
              border: "1px solid #EAE3D9",
              flexShrink: 0,
            }}
          >
            <img
              src={product.images?.[0]}
              alt={product.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#8192D4", textTransform: "uppercase", letterSpacing: "1px" }}>
              Verified Purchase
            </span>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#23201D", margin: "2px 0 0" }}>
              {product.name}
            </h3>
          </div>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 800, color: "#23201D", fontFamily: "'DM Serif Display', serif", marginBottom: 6 }}>
          Write a Product Review
        </h2>
        <p style={{ fontSize: 13, color: "#6E6A63", marginBottom: 20 }}>
          Share your experience with this stationery item to help other journal enthusiasts.
        </p>

        {errorMsg && (
          <div
            style={{
              background: "#FEE2E2",
              color: "#DC2626",
              padding: "10px 14px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
            }}
          >
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Star Rating Selector */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>
              Overall Rating
            </label>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 28,
                      color: active ? "#F59E0B" : "#D1D5DB",
                      transition: "transform 0.1s ease",
                      padding: 0,
                    }}
                  >
                    ★
                  </button>
                );
              })}
              <span style={{ fontSize: 14, fontWeight: 700, color: "#8192D4", marginLeft: 8 }}>
                {rating === 5
                  ? "5.0 — Excellent!"
                  : rating === 4
                  ? "4.0 — Very Good"
                  : rating === 3
                  ? "3.0 — Average"
                  : rating === 2
                  ? "2.0 — Fair"
                  : "1.0 — Poor"}
              </span>
            </div>
          </div>

          {/* Headline Input */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>
              Review Headline
            </label>
            <input
              type="text"
              placeholder="e.g. Beautiful paper quality & zero bleed-through!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 12,
                border: "1px solid #EAE3D9",
                fontSize: 13.5,
                outline: "none",
                color: "#23201D",
              }}
            />
          </div>

          {/* Review Comment Textarea */}
          <div>
            <label style={{ fontSize: 12.5, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>
              Written Feedback
            </label>
            <textarea
              rows={4}
              placeholder="What did you love or dislike about this product? How is the aesthetic, texture, and durability?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: "100%",
                padding: "11px 14px",
                borderRadius: 12,
                border: "1px solid #EAE3D9",
                fontSize: 13.5,
                outline: "none",
                color: "#23201D",
                resize: "vertical",
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: "100%",
              padding: "14px",
              background: "#8192D4",
              color: "#FFFFFF",
              border: "none",
              borderRadius: 14,
              fontSize: 15,
              fontWeight: 800,
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: "0 4px 16px rgba(129, 146, 212, 0.3)",
              transition: "transform 0.15s ease",
            }}
            onMouseEnter={(e) => {
              if (!submitting) e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              if (!submitting) e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            {submitting ? "Submitting Review..." : "Submit Review ⭐"}
          </button>
        </form>
      </div>
    </div>
  );
}
