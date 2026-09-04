import re

file_path = r'h:\Projects\elow_e-commerce\src\pages\Shop.tsx'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 3. Update Grid Template Columns
content = re.sub(
    r'gridTemplateColumns:\s*showFilters\s*\?\s*"240px 1fr"\s*:\s*"1fr"',
    'gridTemplateColumns: (showFilters && !onlyWishlist) ? "240px 1fr" : "1fr"',
    content
)

# 4. Hide Aside
content = re.sub(
    r'\{showFilters && \(\s*<aside',
    '{showFilters && !onlyWishlist && (\n            <aside',
    content
)

# 5. Hide Filter Button and update count text
btn_regex = r'<button onClick=\{\(\) => setShowFilters\(f => !f\)\} className="btn btn-ghost btn-sm" style=\{\{ gap: 7 \}\}>\s*<Icons\.Filter />\s*\{showFilters \? "Hide" : "Show"\} Filters\s*</button>\s*<p style=\{\{ fontSize: 13, color: T\.light, fontWeight: 500 \}\}>\s*Showing \{filtered\.length\} of \{PRODUCTS\.length\} products\s*</p>'
new_btn = """{!onlyWishlist && (
                  <button onClick={() => setShowFilters(f => !f)} className="btn btn-ghost btn-sm" style={{ gap: 7 }}>
                    <Icons.Filter />
                    {showFilters ? "Hide" : "Show"} Filters
                  </button>
                )}
                <p style={{ fontSize: 13, color: T.light, fontWeight: 500 }}>
                  {onlyWishlist 
                    ? `You have ${filtered.length} items in your wishlist` 
                    : `Showing ${filtered.length} of ${PRODUCTS.length} products`}
                </p>"""
content = re.sub(btn_regex, new_btn, content)


with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
