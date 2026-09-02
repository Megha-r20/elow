export type Product = {
  id: string;
  name: string;
  shortName: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  images: string[];
  tags: string[];
  badge?: string;
  badgeVariant?: "teal" | "yellow" | "red" | "pink";
  description: string;
  details: string[];
  inStock: boolean;
  stockCount: number;
  isNew?: boolean;
  isBestseller?: boolean;
};

const u = (id: string, w = 600, h = 600) =>
  `https://images.unsplash.com/${id}&w=${w}&h=${h}&fit=crop&q=82`;

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Pastel Gel Pen Set — 12 colours",
    shortName: "Pastel Gel Pen Set",
    category: "pens",
    subcategory: "Gel Pens",
    price: 349,
    originalPrice: 599,
    rating: 4.8,
    reviewCount: 203,
    images: [
      u("photo-1601311911926-dbdae16e54c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1774878488110-a1da46f5dc5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1567855354833-ac2c4f967b0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["pens", "pastel", "set", "writing"],
    badge: "SALE",
    badgeVariant: "red",
    description: "A curated set of 12 buttery-smooth gel pens in pastel shades — from lavender and blush to sage and mint. Perfect for journaling, note-taking, and embellishing your pages with colour.",
    details: [
      "12 colours: lavender, blush, sage, mint, peach, sky, cream, lilac, rose, sand, seafoam, pearl",
      "0.5mm fine tip for clean, consistent lines",
      "Archival-quality, smear-resistant ink",
      "Comfortable rubber grip for long writing sessions",
      "Comes in a collectible kraft paper gift box",
    ],
    inStock: true,
    stockCount: 48,
    isNew: true,
    isBestseller: false,
  },
  {
    id: "p2",
    name: "Cherry Blossom Washi Tape Collection",
    shortName: "Cherry Blossom Washi Tape",
    category: "washi",
    subcategory: "Decorative Tape",
    price: 199,
    originalPrice: 299,
    rating: 4.9,
    reviewCount: 156,
    images: [
      u("photo-1731575131547-d1f74ba73f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1731575131336-9756ecd34dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1700085663963-bbe0f7789b4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["washi", "tape", "floral", "cherry blossom"],
    badge: "NEW",
    badgeVariant: "teal",
    description: "Three rolls of delicately printed washi tape inspired by Japanese cherry blossom season. Light, repositionable, and perfect for planners, journals, and packaging.",
    details: [
      "Set of 3 coordinating rolls: pink blossom, cream bloom, sage branch",
      "15mm width × 10m length per roll",
      "Made from authentic Japanese washi paper",
      "Repositionable, acid-free, and writable surface",
      "Does not bleed through pages",
    ],
    inStock: true,
    stockCount: 72,
    isNew: true,
  },
  {
    id: "p3",
    name: "A5 Dotted Hardcover Journal — Midnight",
    shortName: "A5 Dotted Journal",
    category: "journals",
    subcategory: "Hardcover Journals",
    price: 599,
    originalPrice: 899,
    rating: 4.7,
    reviewCount: 89,
    images: [
      u("photo-1762318897771-f68b31c0d11f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1535837487710-a191373a20ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1660324197196-69580168711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["journal", "dotted", "a5", "hardcover", "bullet journal"],
    badge: "NEW",
    badgeVariant: "teal",
    description: "A premium A5 dotted journal with a cloth-textured hardcover in midnight navy. 192 pages of thick, fountain-pen-friendly paper — ideal for bullet journaling, sketching, and daily reflection.",
    details: [
      "192 pages / 96 leaves of 120gsm acid-free paper",
      "Subtle 5mm dot grid, barely-there grey",
      "Cloth-textured hardcover with rounded corners",
      "2 ribbon bookmarks + expandable inner pocket",
      "Lay-flat binding for comfortable writing",
    ],
    inStock: true,
    stockCount: 34,
    isNew: true,
  },
  {
    id: "p4",
    name: "Kawaii Sticker Book Vol.3 — Garden Party",
    shortName: "Kawaii Sticker Book",
    category: "stickers",
    subcategory: "Sticker Books",
    price: 249,
    originalPrice: 399,
    rating: 4.8,
    reviewCount: 127,
    images: [
      u("photo-1775884078872-3de6e7bded55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1779684998928-2d824ee831cf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1774878488255-5fc29c9edfcb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["stickers", "kawaii", "book", "decoration"],
    badge: "NEW",
    badgeVariant: "teal",
    description: "200+ die-cut stickers across 12 illustrated sheets — florals, bugs, mushrooms, teacups, and butterflies in a fresh garden palette. Printed on premium matte paper with a gentle gloss coating.",
    details: [
      "200+ stickers across 12 illustrated sheets",
      "Die-cut silhouette stickers on matte paper",
      "Permanent adhesive, no bleeding or ghosting",
      "Themes: florals, insects, mushrooms, tea, butterflies",
      "Saddle-stitched booklet, A6 format",
    ],
    inStock: true,
    stockCount: 61,
    isNew: true,
  },
  {
    id: "p5",
    name: "Macaron Highlighter Set — 6 pastel shades",
    shortName: "Macaron Highlighter Set",
    category: "pens",
    subcategory: "Highlighters",
    price: 279,
    originalPrice: 449,
    rating: 4.6,
    reviewCount: 74,
    images: [
      u("photo-1518082049942-62a4e31b18d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1772890227578-50e68afb31c2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1774878520736-6cacbcce1b7b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["highlighter", "pastel", "set", "study"],
    badge: "BESTSELLER",
    badgeVariant: "yellow",
    isBestseller: true,
    description: "Six macaron-coloured highlighters with a chisel tip for both broad strokes and fine underlining. Gentle on paper, vivid on colour — the study companion you never knew you needed.",
    details: [
      "6 shades: lemon, blush, mint, lavender, peach, sky",
      "Dual-tip: 4mm broad + 1mm fine chisel",
      "Water-based ink, smear-resistant when dry",
      "No bleed-through on standard 70gsm paper",
      "Snap-on cap stays secure for months",
    ],
    inStock: true,
    stockCount: 29,
  },
  {
    id: "p6",
    name: "Mini Memo Pad Bundle — 5 pads",
    shortName: "Mini Memo Pad Bundle",
    category: "notebooks",
    subcategory: "Memo Pads",
    price: 199,
    originalPrice: 349,
    rating: 4.7,
    reviewCount: 61,
    images: [
      u("photo-1627807353979-f8bd316b62cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1784798455842-3a0be501172c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1760720962384-e470ee773c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["memo", "pad", "notepad", "bundle"],
    badge: "NEW",
    badgeVariant: "teal",
    isNew: true,
    description: "A bundle of 5 pocket-sized memo pads — each with a different illustrated cover and 60 tear-off pages. Tuck one in your bag, leave one by your bedside, keep one on your desk.",
    details: [
      "5 pads with unique illustrated covers",
      "60 tear-off pages per pad, 80gsm",
      "A7 format (74mm × 105mm)",
      "Matte laminated covers, stitched binding",
      "Mixed ruling: lined, grid, plain, dotted",
    ],
    inStock: true,
    stockCount: 83,
  },
  {
    id: "p7",
    name: "Moon Phase Wax Seal Stamp Kit",
    shortName: "Moon Phase Stamp Kit",
    category: "desk",
    subcategory: "Desk Accessories",
    price: 499,
    originalPrice: 799,
    rating: 4.8,
    reviewCount: 118,
    images: [
      u("photo-1521669145854-0bd392445939?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1774878488110-a1da46f5dc5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1725953236941-ec8efc71b0fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["stamp", "wax seal", "moon", "desk"],
    badge: "BESTSELLER",
    badgeVariant: "yellow",
    description: "An elegant wax seal kit with a moon-phase stamp head, a wooden handle, and 3 wax sticks in gold, pearl, and dusty rose. Perfect for journaling headers, envelopes, and creative embellishments.",
    details: [
      "Brass stamp head with moon phases motif, 25mm",
      "Solid wood handle, weighted for control",
      "3 sealing wax sticks: gold, pearl, dusty rose",
      "Complete instructions included",
      "Gift-ready kraft box packaging",
    ],
    inStock: true,
    stockCount: 22,
  },
  {
    id: "p8",
    name: "A5 Weekly Planner Pad — 2025",
    shortName: "Weekly Planner Pad",
    category: "planners",
    subcategory: "Weekly Planners",
    price: 799,
    originalPrice: 1199,
    rating: 4.9,
    reviewCount: 247,
    images: [
      u("photo-1711030239034-d7dbf7f2794d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1518082130724-74d38e9ab9d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1765917921173-e43f86bf9c0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["planner", "weekly", "2025", "a5"],
    badge: "BESTSELLER",
    badgeVariant: "yellow",
    isBestseller: true,
    description: "A beautifully designed A5 undated weekly planner with space for priorities, intentions, habit tracker, and daily notes. Made to help you plan with purpose — not just productivity.",
    details: [
      "52-week undated layout — start any week",
      "Weekly spread: 5-day + weekend columns",
      "Monthly overview pages + goal-setting sections",
      "Habit tracker, gratitude, & reflection prompts",
      "120gsm cream paper, ribbon bookmark",
    ],
    inStock: true,
    stockCount: 15,
  },
  {
    id: "p9",
    name: "Crystal Clear Zippered Pen Case",
    shortName: "Crystal Clear Pen Case",
    category: "desk",
    subcategory: "Pencil Cases",
    price: 349,
    originalPrice: 549,
    rating: 5.0,
    reviewCount: 88,
    images: [
      u("photo-1725953386283-d918bb2ac9bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1725953236941-ec8efc71b0fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1774578342274-29121c889b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["pencil case", "pen case", "clear", "transparent", "desk"],
    badge: "TOP RATED",
    badgeVariant: "teal",
    description: "A minimalist clear pencil case with a frosted PVC body, gold zip, and a wide-mouth opening for easy access. Holds up to 30 pens without bulk — see every colour at a glance.",
    details: [
      "Frosted PVC body, soft-touch texture",
      "Gold-tone YKK zipper",
      "Dimensions: 20cm × 10cm × 6cm",
      "Holds up to 30 pens / markers",
      "Water-resistant and easy to wipe clean",
    ],
    inStock: true,
    stockCount: 42,
  },
  {
    id: "p10",
    name: "Rainbow Washi Tape Set — 12 rolls",
    shortName: "Rainbow Washi Set",
    category: "washi",
    subcategory: "Washi Sets",
    price: 449,
    originalPrice: 699,
    rating: 4.6,
    reviewCount: 94,
    images: [
      u("photo-1700085663963-bbe0f7789b4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1731575131547-d1f74ba73f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1731575131336-9756ecd34dbc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["washi", "tape", "rainbow", "set", "12"],
    description: "A complete set of 12 washi tapes spanning the full colour spectrum — from warm reds and oranges through cool blues and purples. Perfect for colour-coded planners and rainbow spreads.",
    details: [
      "12 rolls covering the full spectrum",
      "15mm × 5m per roll",
      "Japanese washi paper, matte finish",
      "Repositionable, writable surface",
      "Comes in a clear PVC storage case",
    ],
    inStock: true,
    stockCount: 38,
  },
  {
    id: "p11",
    name: "Floral Linen Journal — Limited Edition",
    shortName: "Floral Linen Journal",
    category: "journals",
    subcategory: "Hardcover Journals",
    price: 649,
    originalPrice: 999,
    rating: 4.7,
    reviewCount: 52,
    images: [
      u("photo-1535837487710-a191373a20ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1660324197196-69580168711e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1762318897771-f68b31c0d11f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["journal", "floral", "linen", "limited edition"],
    badge: "LIMITED",
    badgeVariant: "pink",
    description: "A limited edition journal wrapped in soft printed linen — a botanical print of wild florals in blush, sage, and cream. The perfect companion for slow mornings and long evenings.",
    details: [
      "Printed linen hardcover, 148 × 210mm (A5)",
      "192 pages of 120gsm cream dotted paper",
      "Lay-flat smyth-sewn binding",
      "Elastic closure in dusty rose",
      "Matching ribbon bookmark and inner pocket",
    ],
    inStock: true,
    stockCount: 11,
  },
  {
    id: "p12",
    name: "Aesthetic Desk Organizer — Cream Oak",
    shortName: "Desk Organizer",
    category: "desk",
    subcategory: "Desk Accessories",
    price: 899,
    originalPrice: 1299,
    rating: 4.5,
    reviewCount: 36,
    images: [
      u("photo-1774578342274-29121c889b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1750814019023-4e43037f5075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
      u("photo-1765917921173-e43f86bf9c0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    ],
    tags: ["desk", "organizer", "oak", "wood", "accessories"],
    description: "A clean oak-finish desk organizer with four compartments — perfect for pens, washi tape rolls, sticky notes, and small accessories. Bring quiet order to your creative space.",
    details: [
      "Solid poplar wood base, cream lacquer finish",
      "4 compartments: 2 pen slots, 1 wide, 1 deep",
      "Dimensions: 22cm × 12cm × 8cm",
      "Anti-slip felt feet",
      "Spot-clean with a damp cloth",
    ],
    inStock: false,
    stockCount: 0,
  },
];

export type Category = {
  id: string;
  label: string;
  image: string;
  productCount: number;
  color: string;
};

export const CATEGORIES: Category[] = [
  { id: "journals",  label: "Journals",         image: u("photo-1762318897771-f68b31c0d11f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 14, color: "#EEE8F8" },
  { id: "pens",      label: "Pens & Markers",   image: u("photo-1601311911926-dbdae16e54c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 22, color: "#FFE8EC" },
  { id: "washi",     label: "Washi Tape",        image: u("photo-1731575131547-d1f74ba73f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 18, color: "#DFF5F3" },
  { id: "stickers",  label: "Stickers",          image: u("photo-1775884078872-3de6e7bded55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 31, color: "#FFF0DC" },
  { id: "planners",  label: "Planners",          image: u("photo-1711030239034-d7dbf7f2794d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 9,  color: "#E5F5EC" },
  { id: "notebooks", label: "Notebooks",         image: u("photo-1760720962384-e470ee773c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 16, color: "#F8F0E0" },
  { id: "desk",      label: "Desk Accessories",  image: u("photo-1774578342274-29121c889b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 11, color: "#E5EEFF" },
];

export type Review = {
  id: string;
  productId: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  text: string;
  verified: boolean;
};

export const REVIEWS: Review[] = [
  {
    id: "r1",
    productId: "p1",
    name: "Ritika S.",
    avatar: u("photo-1579017308347-e53e0d2fc5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA", 80, 80),
    rating: 5,
    date: "Aug 2024",
    text: "The journal quality is incredible — smooth pages, lovely cover. I have been journaling every morning since I ordered it. The dot grid is perfect, barely visible but super helpful.",
    verified: true,
  },
  {
    id: "r2",
    productId: "p1",
    name: "Meghna P.",
    avatar: u("photo-1750814019023-4e43037f5075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA", 80, 80),
    rating: 5,
    date: "Jul 2024",
    text: "Finally found my perfect pen set. The gel pens write so smoothly and the colours are exactly as shown. Will definitely reorder!",
    verified: true,
  },
  {
    id: "r3",
    productId: "p2",
    name: "Aanya K.",
    avatar: u("photo-1517703565892-7cdb859e127b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA", 80, 80),
    rating: 4,
    date: "Jul 2024",
    text: "The washi tape collection is stunning. Beautiful prints and the adhesion is perfect — repositionable without leaving residue. Decorated my whole planner with them!",
    verified: true,
  },
];

export const SORT_OPTIONS = [
  { value: "featured",    label: "Featured" },
  { value: "newest",      label: "Newest First" },
  { value: "price-asc",   label: "Price: Low to High" },
  { value: "price-desc",  label: "Price: High to Low" },
  { value: "rating",      label: "Top Rated" },
  { value: "bestselling", label: "Best Selling" },
];

export const PRICE_RANGES = [
  { label: "Under ₹299",   min: 0,   max: 299  },
  { label: "₹299 – ₹499", min: 299, max: 499  },
  { label: "₹499 – ₹799", min: 499, max: 799  },
  { label: "₹799+",        min: 799, max: Infinity },
];

export const getProductById = (id: string) => PRODUCTS.find(p => p.id === id);
export const getProductsByCategory = (cat: string) =>
  cat === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === cat);
export const getFeatured = () => PRODUCTS.slice(0, 8);
export const getBestSellers = () => PRODUCTS.filter(p => p.isBestseller);
export const getNewArrivals = () => PRODUCTS.filter(p => p.isNew);

export const HERO_IMAGES = {
  journalCollage: u("photo-1535837487710-a191373a20ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
  washiRolls:     u("photo-1700085663963-bbe0f7789b4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
  pensPouch:      u("photo-1725953386283-d918bb2ac9bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
  deskPinks:      u("photo-1765917921173-e43f86bf9c0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
  writing1:       u("photo-1579017308347-e53e0d2fc5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
  writing2:       u("photo-1517703565892-7cdb859e127b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
  writing3:       u("photo-1781456505405-76d614cf5746?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
  cozySetup:      u("photo-1750814019023-4e43037f5075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
  bulletJournal:  u("photo-1711030239034-d7dbf7f2794d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
  deskOrg:        u("photo-1774578342274-29121c889b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
};
