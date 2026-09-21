import React from "react";
import { Stars } from "../ui";

export function AdminReviews({
  reviews = [],
  loadingReviews = false,
  reviewSearch = "",
  setReviewSearch,
  reviewStatusFilter = "all",
  setReviewStatusFilter,
  fetchReviews,
  handleApproveReview,
  handleDeleteReview,
}) {
  const filteredReviews = reviews.filter((r) => {
    if (reviewStatusFilter === "pending" && r.status === "approved") return false;
    if (reviewStatusFilter === "approved" && r.status !== "approved") return false;
    if (reviewSearch.trim()) {
      const q = reviewSearch.toLowerCase();
      const matchName = (r.userName || "").toLowerCase().includes(q);
      const matchComment = (r.comment || "").toLowerCase().includes(q);
      const matchTitle = (r.title || "").toLowerCase().includes(q);
      const matchProd = (r.productId || "").toLowerCase().includes(q);
      return matchName || matchComment || matchTitle || matchProd;
    }
    return true;
  });

  return (
    <div style={{ background: "#FFFFFF", padding: 28, borderRadius: 24, border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>Customer Product Reviews</h3>
            <span style={{ fontSize: 12, fontWeight: 800, background: "#FEF3C7", color: "#D97706", border: "1px solid #FDE68A", padding: "2px 10px", borderRadius: 999 }}>
              ⭐ {reviews.length} total
            </span>
          </div>
          <p style={{ fontSize: 13, color: "#9C968D", marginTop: 4 }}>
            Approve or delete customer ratings and feedback. Accepted reviews will immediately show up on customer product pages.
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <input
            type="text"
            placeholder="🔍 Search reviews, customer, or product..."
            value={reviewSearch}
            onChange={(e) => setReviewSearch(e.target.value)}
            style={{
              padding: "9px 16px",
              borderRadius: 12,
              border: "1px solid #EAE3D9",
              fontSize: 13,
              outline: "none",
              width: 260,
              background: "#FAF7F2",
            }}
          />
          <button
            onClick={fetchReviews}
            style={{
              background: "#FAF7F2",
              border: "1px solid #EAE3D9",
              borderRadius: 12,
              padding: "9px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              color: "#23201D",
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { id: "all", label: `All Reviews (${reviews.length})` },
          { id: "pending", label: `Pending Approval ⏳ (${reviews.filter((r) => r.status !== "approved").length})` },
          { id: "approved", label: `Accepted & Live ✓ (${reviews.filter((r) => r.status === "approved").length})` },
        ].map((st) => (
          <button
            key={st.id}
            onClick={() => setReviewStatusFilter(st.id)}
            style={{
              background: reviewStatusFilter === st.id ? "#23201D" : "#FAF7F2",
              color: reviewStatusFilter === st.id ? "#FAF7F2" : "#6E6A63",
              border: `1.5px solid ${reviewStatusFilter === st.id ? "#23201D" : "#EAE3D9"}`,
              borderRadius: 999,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit",
              transition: "all 0.15s ease",
              boxShadow: reviewStatusFilter === st.id ? "0 4px 12px rgba(35,32,29,0.12)" : "none",
            }}
          >
            {st.label}
          </button>
        ))}
      </div>

      {loadingReviews ? (
        <div style={{ padding: 40, textAlign: "center", color: "#9C968D" }}>Loading customer reviews...</div>
      ) : filteredReviews.length === 0 ? (
        <div style={{ padding: "48px 24px", textAlign: "center", background: "#FAF7F2", borderRadius: 20, border: "1px dashed #EAE3D9" }}>
          <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>⭐</div>
          <h4 style={{ fontSize: 16, fontWeight: 800, color: "#23201D" }}>No customer reviews found</h4>
          <p style={{ fontSize: 13, color: "#9C968D", marginTop: 4 }}>When customers write reviews on products, they will appear here live for approval.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {filteredReviews.map((r) => {
            const isApproved = r.status === "approved";
            return (
              <div
                key={r.id || r._id}
                style={{
                  background: isApproved ? "#FFFFFF" : "#FFFDF9",
                  borderRadius: 18,
                  padding: "20px 24px",
                  border: isApproved ? "1px solid #EAE3D9" : "1.5px solid #FCD34D",
                  boxShadow: "0 4px 16px rgba(35,32,29,0.03)",
                  display: "flex",
                  justify: "space-between",
                  alignItems: "flex-start",
                  gap: 20,
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <Stars n={r.rating} size={14} />
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#23201D" }}>{r.title}</span>
                    <span
                      style={{
                        fontSize: 10.5,
                        fontWeight: 800,
                        background: isApproved ? "rgba(129,146,212,0.15)" : "#FEF3C7",
                        color: isApproved ? "#8192D4" : "#D97706",
                        border: isApproved ? "1px solid rgba(129,146,212,0.3)" : "1px solid #FDE68A",
                        padding: "2px 8px",
                        borderRadius: 999,
                      }}
                    >
                      {isApproved ? "● Live on storefront" : "⏳ Pending Moderation"}
                    </span>
                  </div>

                  <p style={{ fontSize: 13.5, color: "#6E6A63", lineHeight: 1.6, marginBottom: 12 }}>"{r.comment}"</p>

                  <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12, color: "#9C968D" }}>
                    <span>
                      Reviewer: <strong style={{ color: "#23201D" }}>{r.userName || "Customer"}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Product ID: <code style={{ background: "#FAF7F2", padding: "2px 6px", borderRadius: 4, color: "#23201D" }}>{r.productId}</code>
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  {!isApproved && (
                    <button
                      onClick={() => handleApproveReview(r.id || r._id)}
                      style={{
                        background: "#8192D4",
                        color: "#FFFFFF",
                        border: "none",
                        padding: "8px 18px",
                        borderRadius: 12,
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(129,146,212,0.3)",
                      }}
                    >
                      ✓ Accept Review
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteReview(r.id || r._id, r.title)}
                    style={{
                      background: "#FDF2F2",
                      color: "#DC2626",
                      border: "1px solid #F8B4B4",
                      padding: "8px 14px",
                      borderRadius: 12,
                      fontSize: 12.5,
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
