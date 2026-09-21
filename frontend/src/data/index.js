const u = (id, w = 600, h = 600) => `https://images.unsplash.com/${id}&w=${w}&h=${h}&fit=crop&q=82`;

export const CATEGORIES = [
    { id: "journals", label: "Journals", image: u("photo-1762318897771-f68b31c0d11f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 14, color: "#EEE8F8" },
    { id: "pens", label: "Pens & Markers", image: u("photo-1601311911926-dbdae16e54c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 22, color: "#FFE8EC" },
    { id: "washi", label: "Washi Tape", image: u("photo-1731575131547-d1f74ba73f85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 18, color: "#DFF5F3" },
    { id: "stickers", label: "Stickers", image: u("photo-1775884078872-3de6e7bded55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 31, color: "#FFF0DC" },
    { id: "planners", label: "Planners", image: u("photo-1711030239034-d7dbf7f2794d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 9, color: "#E5F5EC" },
    { id: "notebooks", label: "Notebooks", image: u("photo-1760720962384-e470ee773c1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 16, color: "#F8F0E0" },
    { id: "desk", label: "Desk Accessories", image: u("photo-1774578342274-29121c889b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 11, color: "#E5EEFF" },
    { id: "gifting", label: "Gift Combos", image: u("photo-1762318897771-f68b31c0d11f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"), productCount: 50, color: "#FDEFEF" },
];

export const REVIEWS = [
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
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest First" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating", label: "Top Rated" },
    { value: "bestselling", label: "Best Selling" },
];

export const PRICE_RANGES = [
    { label: "Under ₹299", min: 0, max: 299 },
    { label: "₹299 – ₹499", min: 299, max: 499 },
    { label: "₹499 – ₹799", min: 499, max: 799 },
    { label: "₹799+", min: 799, max: Infinity },
];

export const HERO_IMAGES = {
    journalCollage: u("photo-1535837487710-a191373a20ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    washiRolls: u("photo-1700085663963-bbe0f7789b4a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    pensPouch: u("photo-1725953386283-d918bb2ac9bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    deskPinks: u("photo-1765917921173-e43f86bf9c0f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    writing1: u("photo-1579017308347-e53e0d2fc5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    writing2: u("photo-1517703565892-7cdb859e127b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    writing3: u("photo-1781456505405-76d614cf5746?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    cozySetup: u("photo-1750814019023-4e43037f5075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    bulletJournal: u("photo-1711030239034-d7dbf7f2794d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
    deskOrg: u("photo-1774578342274-29121c889b01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA"),
};

export { PRODUCTS } from "./products.js";

