import { Send } from "lucide-react";

export function ProductNewsletter({
    newsletterEmail,
    setNewsletterEmail,
    handleNewsletterSubmit,
}) {
    return (
        <div className="pd-newsletter-card">
            <h3 className="pd-newsletter-heading">Join the Elow Journal</h3>
            <p className="pd-newsletter-sub">
                Subscribe to receive weekly desk inspiration, early drop access, and 10% off your first order.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="pd-newsletter-form">
                <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                    className="pd-newsletter-input"
                />
                <button type="submit" className="pd-newsletter-btn flex items-center gap-2">
                    <span>Subscribe</span>
                    <Send size={14} />
                </button>
            </form>
        </div>
    );
}
