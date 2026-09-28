import { Leaf, Truck, ShieldCheck, RefreshCw, Gift } from "lucide-react";

export function ProductTrustSection() {
    return (
        <div className="pd-trust-section">
            <div className="pd-trust-card">
                <div className="pd-trust-icon-box">
                    <Leaf size={22} />
                </div>
                <h4 className="pd-trust-title">Premium Quality</h4>
                <p className="pd-trust-desc">Archival 100gsm eco-conscious paper</p>
            </div>
            <div className="pd-trust-card">
                <div className="pd-trust-icon-box">
                    <Truck size={22} />
                </div>
                <h4 className="pd-trust-title">Fast Delivery</h4>
                <p className="pd-trust-desc">Express shipping across 50+ cities</p>
            </div>
            <div className="pd-trust-card">
                <div className="pd-trust-icon-box">
                    <ShieldCheck size={22} />
                </div>
                <h4 className="pd-trust-title">Secure Payments</h4>
                <p className="pd-trust-desc">Encrypted UPI, Cards & NetBanking</p>
            </div>
            <div className="pd-trust-card">
                <div className="pd-trust-icon-box">
                    <RefreshCw size={22} />
                </div>
                <h4 className="pd-trust-title">Easy Returns</h4>
                <p className="pd-trust-desc">Hassle-free 30-day return policy</p>
            </div>
            <div className="pd-trust-card">
                <div className="pd-trust-icon-box">
                    <Gift size={22} />
                </div>
                <h4 className="pd-trust-title">Gift Wrapping</h4>
                <p className="pd-trust-desc">Complimentary aesthetic gift boxes</p>
            </div>
        </div>
    );
}
