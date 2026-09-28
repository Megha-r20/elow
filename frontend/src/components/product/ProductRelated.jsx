import { SectionHead } from "../ui";
import { ProductCard } from "../ProductCard";

export function ProductRelated({ related }) {
    if (!related || related.length === 0) return null;

    return (
        <div className="mb-16">
            <SectionHead eyebrow="You May Also Like" title="More from This Category" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {related.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}
