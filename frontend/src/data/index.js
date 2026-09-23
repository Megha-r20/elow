const u = (id, w = 600, h = 600) => `https://images.unsplash.com/${id}&w=${w}&h=${h}&fit=crop&q=82`;

export const CATEGORIES = [
    { id: "journals", label: "Journals", image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800", fallbackImage: "/journals.jpg", productCount: 22, color: "#EEE8F8" },
    { id: "pens", label: "Pens & Ink", image: "https://images.unsplash.com/photo-1725953386283-d918bb2ac9bb?auto=format&fit=crop&q=80&w=800", fallbackImage: "/pens-markers.jpg", productCount: 25, color: "#FFE8EC" },
    { id: "washi", label: "Washi Tape", image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800", fallbackImage: "/washi-tape.jpg", productCount: 20, color: "#DFF5F3" },
    { id: "stickers", label: "Stickers", image: "https://images.unsplash.com/photo-1572375992501-4b0892d50c69?auto=format&fit=crop&q=80&w=800", fallbackImage: "/stickers.jpg", productCount: 22, color: "#FFF0DC" },
    { id: "planners", label: "Planners", image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=800", fallbackImage: "/planners.jpg", productCount: 20, color: "#E5F5EC" },
    { id: "desk", label: "Workspace & Desk", image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800", fallbackImage: "/desk-accessories.jpg", productCount: 21, color: "#E5EEFF" },
    { id: "gifting", label: "Accessories", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=800", fallbackImage: "/gift-combo.jpg", productCount: 20, color: "#FDEFEF" },
];

export const REVIEWS = [
    {
        id: "r1",
        productId: "P001",
        name: "Ritika S.",
        avatar: u("photo-1579017308347-e53e0d2fc5e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA", 80, 80),
        rating: 5,
        date: "Aug 2024",
        text: "The glass dip pen quality is incredible — smooth ink flow, lovely feel. I have been using it every morning for calligraphy.",
        verified: true,
    },
    {
        id: "r2",
        productId: "P026",
        name: "Meghna P.",
        avatar: u("photo-1750814019023-4e43037f5075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA", 80, 80),
        rating: 5,
        date: "Jul 2024",
        text: "Finally found my perfect lavender journal. The paper quality is so premium and smooth. Will definitely reorder!",
        verified: true,
    },
    {
        id: "r3",
        productId: "P068",
        name: "Aanya K.",
        avatar: u("photo-1517703565892-7cdb859e127b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfA", 80, 80),
        rating: 4,
        date: "Jul 2024",
        text: "The Lavender Sky washi tape collection is stunning. Beautiful prints and perfect adhesion for my bullet journal!",
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
