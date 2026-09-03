import { createContext, useContext, useReducer, useState, useCallback, type ReactNode , useEffect} from "react";
import type { Product } from "../data";

/* ─── Cart ─────────────────────────────────────────────────────── */
export type CartItem = {
  product: Product;
  qty: number;
};

type CartState = { items: CartItem[] };
type CartAction =
  | { type: "ADD"; product: Product; qty?: number }
  | { type: "REMOVE"; id: string }
  | { type: "SET_QTY"; id: string; qty: number }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find(i => i.product.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map(i =>
            i.product.id === action.product.id
              ? { ...i, qty: i.qty + (action.qty ?? 1) }
              : i
          ),
        };
      }
      return { items: [...state.items, { product: action.product, qty: action.qty ?? 1 }] };
    }
    case "REMOVE":
      return { items: state.items.filter(i => i.product.id !== action.id) };
    case "SET_QTY":
      if (action.qty <= 0) return { items: state.items.filter(i => i.product.id !== action.id) };
      return {
        items: state.items.map(i =>
          i.product.id === action.id ? { ...i, qty: action.qty } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

type CartCtx = {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (product: Product, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
};

const CartContext = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] }, (initial) => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state));
  }, [state]);

  const addItem    = useCallback((product: Product, qty = 1) => dispatch({ type: "ADD", product, qty }), []);
  const removeItem = useCallback((id: string) => dispatch({ type: "REMOVE", id }), []);
  const setQty     = useCallback((id: string, qty: number) => dispatch({ type: "SET_QTY", id, qty }), []);
  const clearCart  = useCallback(() => dispatch({ type: "CLEAR" }), []);
  const isInCart   = useCallback((id: string) => state.items.some(i => i.product.id === id), [state.items]);

  const count    = state.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = state.items.reduce((s, i) => s + i.product.price * i.qty, 0);

  return (
    <CartContext.Provider value={{ items: state.items, count, subtotal, addItem, removeItem, setQty, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

/* ─── Wishlist ──────────────────────────────────────────────────── */
type WishCtx = {
  ids: Set<string>;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

const WishContext = createContext<WishCtx | null>(null);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [ids, setIds] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("wishlist");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(Array.from(ids)));
  }, [ids]);
  const toggle = useCallback((id: string) =>
    setIds(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; }), []);
  const has = useCallback((id: string) => ids.has(id), [ids]);
  return <WishContext.Provider value={{ ids, toggle, has }}>{children}</WishContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

/* ─── Toast ─────────────────────────────────────────────────────── */
export type Toast = { id: string; message: string; type?: "success" | "error" | "info" };
type ToastCtx = { toasts: Toast[]; addToast: (msg: string, type?: Toast["type"]) => void };
const ToastContext = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((message: string, type: Toast["type"] = "success") => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);
  return (
    <ToastContext.Provider value={{ toasts, addToast }}>
      {children}
      {toasts.length > 0 && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          {toasts.map(t => (
            <div key={t.id} className="toast" style={{
              background: t.type === "error" ? "#e05252" : t.type === "info" ? "#5C5C58" : "#1C1C1A",
              color: "#fff", padding: "12px 22px", borderRadius: 12, fontSize: 13.5, fontWeight: 600,
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: 10,
            }}>
              <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
              {t.message}
            </div>
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

/* ─── Cart Drawer (global open state) ───────────────────────────── */
type DrawerCtx = { cartOpen: boolean; openCart: () => void; closeCart: () => void };
const DrawerContext = createContext<DrawerCtx | null>(null);

export function DrawerProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  return (
    <DrawerContext.Provider value={{ cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false) }}>
      {children}
    </DrawerContext.Provider>
  );
}

export function useDrawer() {
  const ctx = useContext(DrawerContext);
  if (!ctx) throw new Error("useDrawer must be used within DrawerProvider");
  return ctx;
}
