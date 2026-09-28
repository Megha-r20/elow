import { createContext, useContext, useReducer, useState, useCallback, useEffect } from "react";
import { getApiUrl } from "../api/config";
import { useAuth } from "./AuthContext";

function useOptionalAuth() {
    try {
        return useAuth();
    } catch {
        return null;
    }
}
function cartReducer(state, action) {
    switch (action.type) {
        case "ADD": {
            const existing = state.items.find(i => i.product.id === action.product.id);
            if (existing) {
                return {
                    items: state.items.map(i => i.product.id === action.product.id
                        ? { ...i, qty: i.qty + (action.qty ?? 1) }
                        : i),
                };
            }
            return { items: [...state.items, { product: action.product, qty: action.qty ?? 1 }] };
        }
        case "REMOVE":
            return { items: state.items.filter(i => i.product.id !== action.id) };
        case "SET_QTY":
            if (action.qty <= 0)
                return { items: state.items.filter(i => i.product.id !== action.id) };
            return {
                items: state.items.map(i => i.product.id === action.id ? { ...i, qty: action.qty } : i),
            };
        case "CLEAR":
            return { items: [] };
        default:
            return state;
    }
}
const CartContext = createContext(null);
export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] }, (initial) => {
        try {
            const stored = localStorage.getItem("cart");
            return stored ? JSON.parse(stored) : initial;
        }
        catch {
            return initial;
        }
    });
    const [promoCode, setPromoCode] = useState(() => {
        try {
            return localStorage.getItem("promoCode");
        }
        catch {
            return null;
        }
    });
    const auth = useOptionalAuth();
    const user = auth?.user;
    const authFetch = auth?.authFetch;

    const [lastOrder, setLastOrder] = useState(() => {
        try {
            const stored = sessionStorage.getItem("lastOrder") || localStorage.getItem("lastOrder");
            return stored ? JSON.parse(stored) : null;
        }
        catch {
            return null;
        }
    });
    const [myOrders, setMyOrders] = useState([]);

    // Server-side Orders Synchronization for logged in users
    useEffect(() => {
        if (!user || !authFetch) return;
        let cancelled = false;
        async function fetchServerOrders() {
            try {
                const res = await authFetch(getApiUrl("/api/orders/my-orders"));
                if (res.ok) {
                    const data = await res.json();
                    if (!cancelled && Array.isArray(data.orders)) {
                        setMyOrders(data.orders);
                    }
                }
            } catch (_e) { /* ignore */ }
        }
        fetchServerOrders();
        return () => { cancelled = true; };
    }, [user, authFetch]);

    useEffect(() => {
        try { localStorage.setItem("cart", JSON.stringify(state)); } catch (_e) { /* ignore */ }
    }, [state]);
    useEffect(() => {
        try {
            if (promoCode)
                localStorage.setItem("promoCode", promoCode);
            else
                localStorage.removeItem("promoCode");
        } catch (_e) { /* ignore */ }
    }, [promoCode]);
    useEffect(() => {
        try {
            if (lastOrder)
                sessionStorage.setItem("lastOrder", JSON.stringify(lastOrder));
        } catch (_e) { /* ignore */ }
    }, [lastOrder]);
    const addItem = useCallback((product, qty = 1) => dispatch({ type: "ADD", product, qty }), []);
    const removeItem = useCallback((id) => dispatch({ type: "REMOVE", id }), []);
    const setQty = useCallback((id, qty) => dispatch({ type: "SET_QTY", id, qty }), []);
    const clearCart = useCallback(() => { dispatch({ type: "CLEAR" }); setPromoCode(null); }, []);
    const isInCart = useCallback((id) => state.items.some(i => i.product.id === id), [state.items]);
    const count = state.items.reduce((s, i) => s + i.qty, 0);
    const subtotal = state.items.reduce((s, i) => s + i.product.price * i.qty, 0);
    const [serverDiscount, setServerDiscount] = useState(0);

    const applyPromo = useCallback(async (code) => {
        const cleaned = code.trim().toUpperCase();
        try {
            const res = await fetch(getApiUrl("/api/promo/validate"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ code: cleaned, subtotal }),
            });
            const data = await res.json();
            if (res.ok && data.valid) {
                setPromoCode(cleaned);
                setServerDiscount(data.discountAmount || 0);
                return { success: true, message: data.message };
            }
            return { success: false, error: data.error || "Invalid promo code" };
        } catch (err) {
            const validCodes = ["WRITE50", "ELOW10", "SPIN50", "SPIN100", "SPIN150", "SPIN250", "SPIN10"];
            if (validCodes.includes(cleaned)) {
                setPromoCode(cleaned);
                return { success: true };
            }
            return { success: false, error: "Error validating promo code" };
        }
    }, [subtotal]);

    const removePromo = useCallback(() => { setPromoCode(null); setServerDiscount(0); }, []);

    let discount = serverDiscount;
    if (promoCode && discount === 0) {
        const c = promoCode.toUpperCase();
        if (c === "SPIN50" || c.startsWith("SPIN-")) discount = 50;
        else if (c === "SPIN100") discount = 100;
        else if (c === "SPIN150") discount = 150;
        else if (c === "SPIN250") discount = 250;
        else if (c === "WRITE50" || c === "ELOW10" || c === "SPIN10") discount = Math.round(subtotal * 0.1);
        discount = Math.min(discount, subtotal);
    }
    const saveOrder = useCallback((order) => {
        setLastOrder(order);
        setMyOrders(prev => {
            const exists = prev.some(o => o.id === order.id);
            if (exists) return prev.map(o => o.id === order.id ? order : o);
            return [order, ...prev];
        });
    }, []);
    const clearCustomerOrders = useCallback(() => {
        setLastOrder(null);
        setMyOrders([]);
        try {
            localStorage.removeItem("lastOrder");
            localStorage.removeItem("myOrders");
        }
        catch (_err) { /* ignore localStorage error */ }
    }, []);
    const removeOrderFromHistory = useCallback((id) => {
        setLastOrder(prev => (prev?.id === id ? null : prev));
        setMyOrders(prev => prev.filter(o => o.id !== id));
        try {
            const storedLast = localStorage.getItem("lastOrder");
            if (storedLast) {
                const parsed = JSON.parse(storedLast);
                if (parsed.id === id)
                    localStorage.removeItem("lastOrder");
            }
            const storedMy = localStorage.getItem("myOrders");
            if (storedMy) {
                const parsed = JSON.parse(storedMy);
                const filtered = parsed.filter(o => o.id !== id);
                localStorage.setItem("myOrders", JSON.stringify(filtered));
            }
        }
        catch (_err) { /* ignore localStorage error */ }
    }, []);
    return (<CartContext.Provider value={{
            items: state.items, count, subtotal, promoCode, discount, applyPromo, removePromo,
            addItem, removeItem, setQty, clearCart, isInCart, lastOrder, myOrders, saveOrder, clearCustomerOrders, removeOrderFromHistory,
        }}>
      {children}
    </CartContext.Provider>);
}
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx)
        throw new Error("useCart must be used within CartProvider");
    return ctx;
}
const WishContext = createContext(null);
export function WishlistProvider({ children }) {
    const auth = useOptionalAuth();
    const user = auth?.user;
    const authFetch = auth?.authFetch;

    const [ids, setIds] = useState(() => {
        try {
            const stored = localStorage.getItem("wishlist");
            return stored ? new Set(JSON.parse(stored)) : new Set();
        }
        catch {
            return new Set();
        }
    });

    // Server-side Wishlist Synchronization across devices
    useEffect(() => {
        if (!user || !authFetch) return;
        let cancelled = false;
        async function syncServerWishlist() {
            try {
                // If local guest IDs exist, sync them to server
                const localIds = Array.from(ids);
                if (localIds.length > 0) {
                    await authFetch(getApiUrl("/api/auth/wishlist"), {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ productIds: localIds }),
                    });
                }
                const res = await authFetch(getApiUrl("/api/auth/wishlist"));
                if (res.ok) {
                    const data = await res.json();
                    if (!cancelled && Array.isArray(data.wishlist)) {
                        setIds(new Set(data.wishlist));
                        try { localStorage.setItem("wishlist", JSON.stringify(data.wishlist)); } catch (_e) {}
                    }
                }
            } catch (_err) {
                if (Array.isArray(user.wishlist) && user.wishlist.length > 0) {
                    setIds(new Set(user.wishlist));
                }
            }
        }
        syncServerWishlist();
        return () => { cancelled = true; };
    }, [user, authFetch]);

    useEffect(() => {
        try {
            localStorage.setItem("wishlist", JSON.stringify(Array.from(ids)));
        } catch (_e) { /* ignore */ }
    }, [ids]);

    const toggle = useCallback((id) => {
        setIds((prev) => {
            const n = new Set(prev);
            if (n.has(id)) {
                n.delete(id);
            } else {
                n.add(id);
            }
            try {
                localStorage.setItem("wishlist", JSON.stringify(Array.from(n)));
            } catch (_e) {}
            return n;
        });

        // Persist change to server if user is logged in
        if (user && authFetch) {
            authFetch(getApiUrl("/api/auth/wishlist/toggle"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: id }),
            }).catch(() => {});
        }
    }, [user, authFetch]);

    const has = useCallback((id) => ids.has(id), [ids]);
    return <WishContext.Provider value={{ ids, toggle, has }}>{children}</WishContext.Provider>;
}
export function useWishlist() {
    const ctx = useContext(WishContext);
    if (!ctx)
        throw new Error("useWishlist must be used within WishlistProvider");
    return ctx;
}
const ToastContext = createContext(null);
export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const addToast = useCallback((message, type = "success") => {
        const id = Date.now().toString();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
    }, []);
    return (<ToastContext.Provider value={{ toasts, addToast }}>
      {children}
      {toasts.length > 0 && (<div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 9999, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
          {toasts.map(t => (<div key={t.id} className="toast" style={{
                    background: t.type === "error" ? "#e05252" : t.type === "info" ? "#5C5C58" : "#1C1C1A",
                    color: "#fff", padding: "12px 22px", borderRadius: 12, fontSize: 13.5, fontWeight: 600,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)", display: "flex", alignItems: "center", gap: 10,
                }}>
              <span>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
              {t.message}
            </div>))}
        </div>)}
    </ToastContext.Provider>);
}
export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx)
        throw new Error("useToast must be used within ToastProvider");
    return ctx;
}
const DrawerContext = createContext(null);
export function DrawerProvider({ children }) {
    const [cartOpen, setCartOpen] = useState(false);
    return (<DrawerContext.Provider value={{ cartOpen, openCart: () => setCartOpen(true), closeCart: () => setCartOpen(false) }}>
      {children}
    </DrawerContext.Provider>);
}
export function useDrawer() {
    const ctx = useContext(DrawerContext);
    if (!ctx)
        throw new Error("useDrawer must be used within DrawerProvider");
    return ctx;
}
/* ─── Export Auth ────────────────────────────────────────────────── */
export { AuthProvider, useAuth } from "./AuthContext";
