import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

const Home = lazy(() => import("./pages/Home"));
const Shop = lazy(() => import("./pages/Shop"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Checkout = lazy(() => import("./pages/Checkout"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const Settings = lazy(() => import("./pages/Settings"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Contact = lazy(() => import("./pages/Contact"));
const ReturnsPolicy = lazy(() => import("./pages/ReturnsPolicy"));
const OrderTracking = lazy(() => import("./pages/OrderTracking"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

const PageLoader = () => (
    <div style={{ padding: "80px 24px", textAlign: "center", color: "#6E6A63" }}>
        Loading...
    </div>
);

const withSuspense = (Component) => {
    const SuspenseWrapper = (props) => (
        <Suspense fallback={<PageLoader />}>
            <Component {...props} />
        </Suspense>
    );
    SuspenseWrapper.displayName = `WithSuspense(${Component.displayName || Component.name || "Component"})`;
    return SuspenseWrapper;
};

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            { index: true, Component: withSuspense(Home) },
            { path: "shop", Component: withSuspense(Shop) },
            { path: "product/:id", Component: withSuspense(ProductDetail) },
            { path: "cart", Component: withSuspense(Cart) },
            { path: "checkout", Component: withSuspense(Checkout) },
            { path: "order-confirmation", Component: withSuspense(OrderConfirmation) },
            { path: "admin", Component: () => <ProtectedRoute requireAdmin><Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense></ProtectedRoute> },
            { path: "settings", Component: () => <ProtectedRoute><Suspense fallback={<PageLoader />}><Settings /></Suspense></ProtectedRoute> },
            { path: "shipping", Component: withSuspense(ShippingPolicy) },
            { path: "faq", Component: withSuspense(FAQ) },
            { path: "contact", Component: withSuspense(Contact) },
            { path: "returns", Component: withSuspense(ReturnsPolicy) },
            { path: "tracking", Component: withSuspense(OrderTracking) },
            { path: "reset-password", Component: withSuspense(ResetPassword) },
            { path: "*", Component: () => (
                <div style={{ textAlign: "center", padding: "120px 24px" }}>
                    <h1 style={{ fontSize: 36, fontWeight: 700, marginBottom: 12, fontFamily: "'DM Serif Display', serif" }}>Page not found</h1>
                    <p style={{ color: "#8C8880", marginBottom: 28 }}>The page you're looking for doesn't exist.</p>
                    <a href="/" style={{ background: "#1C1C1A", color: "#fff", padding: "14px 32px", borderRadius: 12, textDecoration: "none", fontWeight: 600, fontSize: 15 }}>Go Home</a>
                </div>
            ) },
        ],
    },
]);
