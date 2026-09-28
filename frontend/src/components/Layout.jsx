import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { useAuth } from "../context/AuthContext";
import { CartDrawer } from "./CartDrawer";
import { AccountModal } from "./AccountModal";
import { AuthModal } from "./AuthModal";
import { SpinWheelModal } from "./SpinWheelModal";
import { SpinLauncher } from "./SpinLauncher";
import { ErrorBoundary } from "./ErrorBoundary";
import { AnnouncementBar, Navbar, MobileNavDrawer, Footer } from "./layout/index";

export default function Layout() {
  const { isAdmin } = useAuth();
  const location = useLocation();
  const [mobileNav, setMobileNav] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [spinModalOpen, setSpinModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (isAdmin || location.pathname.startsWith("/admin")) return;
    const hasSpun = localStorage.getItem("spinWonPrize");
    if (!hasSpun) {
      const timer = setTimeout(() => {
        setSpinModalOpen(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [location.pathname, isAdmin]);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Announcement bar */}
      <AnnouncementBar />

      {/* Header Navbar */}
      <Navbar
        onOpenAccount={() => setAccountOpen(true)}
        onOpenAuth={() => setAuthModalOpen(true)}
        onToggleMobileNav={() => setMobileNav((o) => !o)}
        mobileNavOpen={mobileNav}
      />

      {/* Mobile Drawer */}
      <MobileNavDrawer
        isOpen={mobileNav}
        onClose={() => setMobileNav(false)}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Account Modal */}
      <AccountModal isOpen={accountOpen} onClose={() => setAccountOpen(false)} />

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Spin-the-Wheel Popup Modal */}
      <SpinWheelModal isOpen={spinModalOpen} onClose={() => setSpinModalOpen(false)} />

      {/* Floating Spin The Wheel Launcher Button */}
      <SpinLauncher onOpen={() => setSpinModalOpen(true)} />

      {/* Cart drawer */}
      <CartDrawer />

      {/* Main content */}
      <main style={{ flex: 1 }}>
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <Footer />

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          position: "fixed",
          bottom: 28,
          right: 28,
          zIndex: 400,
          width: 44,
          height: 44,
          background: "#1C1C1A",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 24px rgba(0,0,0,0.25)",
          transition: "transform 0.18s, background 0.18s",
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(-3px)";
          el.style.background = "#AB88CD";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "translateY(0)";
          el.style.background = "#1C1C1A";
        }}
      >
        ↑
      </button>
    </div>
  );
}
