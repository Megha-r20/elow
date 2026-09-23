const u = (id, w = 600, h = 600) => `https://images.unsplash.com/${id}&w=${w}&h=${h}&fit=crop&q=82`;

export const CATEGORIES = [
    { id: "journals", label: "Journals", image: "https://i.pinimg.com/736x/b4/36/63/b436631b0540af88e56ebbbe0bae7225.jpg", fallbackImage: "/journals.jpg", productCount: 22, color: "#EEE8F8" },
    { id: "pens", label: "Pens & Markers", image: "https://i.pinimg.com/1200x/83/77/e1/8377e146a982995b73c6ab429b0c9086.jpg", fallbackImage: "/pens-markers.jpg", productCount: 25, color: "#FFE8EC" },
    { id: "washi", label: "Washi Tape", image: "https://i.pinimg.com/1200x/59/03/21/590321b4fba750d7c7fd44ac9275c113.jpg", fallbackImage: "/washi-tape.jpg", productCount: 20, color: "#DFF5F3" },
    { id: "stickers", label: "Stickers", image: "https://i.pinimg.com/736x/4a/c1/3a/4ac13a77c2e20daf95eb3908a51ba8c2.jpg", fallbackImage: "/stickers.jpg", productCount: 22, color: "#FFF0DC" },
    { id: "planners", label: "Planners", image: "https://i.pinimg.com/736x/e3/98/85/e398859b4ad2054888f6dd247876e1f6.jpg", fallbackImage: "/planners.jpg", productCount: 20, color: "#E5F5EC" },
    { id: "desk", label: "Desk Accessories", image: "https://i.pinimg.com/736x/1d/57/21/1d57211c08728c61f843b375102d6018.jpg", fallbackImage: "/desk-accessories.jpg", productCount: 41, color: "#E5EEFF" },
    { id: "gifting", label: "Gift Combos", image: "https://i.pinimg.com/736x/5c/a7/30/5ca730b11ab643bde784311628014b92.jpg", fallbackImage: "/gift-combo.jpg", productCount: 0, color: "#FDEFEF" },
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
