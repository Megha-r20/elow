import { X } from "lucide-react";

export function ShopActiveFilters({ activeFilters, clearAll }) {
    if (!activeFilters || activeFilters.length === 0) return null;

    return (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#78726A" }}>Active Filters:</span>
            {activeFilters.map((f, i) => (
                <span
                    key={i}
                    style={{
                        background: "#FFFFFF",
                        border: "1px solid #EAE3D9",
                        fontSize: 12,
                        color: "#23201D",
                        fontWeight: 500,
                        padding: "4px 12px",
                        borderRadius: 20,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    {f.label}
                    <button
                        onClick={f.clear}
                        style={{
                            border: "none",
                            background: "none",
                            cursor: "pointer",
                            padding: 0,
                            color: "#9C968D",
                            display: "flex",
                            alignItems: "center",
                        }}
                        title="Remove filter"
                    >
                        <X size={12} />
                    </button>
                </span>
            ))}
            <button
                onClick={clearAll}
                style={{
                    border: "none",
                    background: "none",
                    color: "#AB88CD",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    marginLeft: 4,
                }}
            >
                Clear all
            </button>
        </div>
    );
}
