import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true,                Component: Home             },
      { path: "shop",               Component: Shop             },
      { path: "product/:id",        Component: ProductDetail    },
      { path: "cart",               Component: Cart             },
      { path: "checkout",           Component: Checkout         },
      { path: "order-confirmation", Component: OrderConfirmation},
      { path: "*", Component: () => {
        const n = (globalThis as any).__reactRouterNavigate;
        return (
          <div style={{ textAlign: "center", padding: "120px 24px" }}>
            <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, fontFamily: "'DM Serif Display', serif" }}>Page not found</h1>
            <p style={{ color: "#8C8880", marginBottom: 28 }}>The page you're looking for doesn't exist.</p>
            <a href="/" style={{ background: "#1C1C1A", color: "#fff", padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 15 }}>Go Home</a>
          </div>
        );
      }},
    ],
  },
]);
