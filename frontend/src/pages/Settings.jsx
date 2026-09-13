import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../hooks";
import { Link, useNavigate } from "react-router";
export default function Settings() {
    const { user, updateProfile } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();
    const [name, setName] = useState(user?.name || "");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState(user?.phone || "9876543210");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [savingProfile, setSavingProfile] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);
    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            if (user.phone)
                setPhone(user.phone);
        }
    }, [user]);
    if (!user) {
        return (<div style={{ background: "#FAF7F2", minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ background: "#FFFFFF", padding: "40px 32px", borderRadius: 24, border: "1px solid #EAE3D9", textAlign: "center", maxWidth: 440, boxShadow: "0 12px 32px rgba(35,32,29,0.08)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#23201D" }}>Authentication Required</h2>
          <p style={{ fontSize: 13.5, color: "#6E6A63", marginTop: 8, lineHeight: 1.6 }}>
            Please sign in to view and edit your account profile settings.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Link to="/" className="btn btn-dark btn-md btn-full">
              Back to Home
            </Link>
          </div>
        </div>
      </div>);
    }
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !email.trim()) {
            addToast("Full name and email address are required", "error");
            return;
        }
        setSavingProfile(true);
        const res = await updateProfile({ name: name.trim(), email: email.trim(), phone: phone.trim() });
        setSavingProfile(false);
        if (res.success) {
            addToast("Profile details updated successfully!");
        }
        else {
            addToast(res.error || "Failed to update profile", "error");
        }
    };
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (!currentPassword) {
            addToast("Please enter your current password", "error");
            return;
        }
        if (newPassword.length < 6) {
            addToast("New password must be at least 6 characters long", "error");
            return;
        }
        if (newPassword !== confirmPassword) {
            addToast("New passwords do not match", "error");
            return;
        }
        setSavingPassword(true);
        const res = await updateProfile({ currentPassword, newPassword });
        setSavingPassword(false);
        if (res.success) {
            addToast("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        }
        else {
            addToast(res.error || "Failed to change password", "error");
        }
    };
    return (<div style={{ background: "#FAF7F2", minHeight: "100vh", padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: 860 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#EBF3EF", border: "1px solid rgba(94,140,119,0.3)", color: "#5E8C77", padding: "4px 14px", borderRadius: 999, fontSize: 11.5, fontWeight: 700, letterSpacing: "1px", marginBottom: 10 }}>
            ⚙️ USER ACCOUNT & SETTINGS
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: "#23201D", letterSpacing: "-0.5px" }}>
            Profile Settings
          </h1>
          <p style={{ fontSize: 14, color: "#6E6A63", marginTop: 4 }}>
            Manage your personal profile details, account security, and default preferences.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 28 }}>
          {/* Card 1: Account Summary Overview */}
          <div style={{ background: "#FFFFFF", borderRadius: 24, padding: "28px 32px", border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <div style={{ width: 58, height: 58, borderRadius: "50%", background: user.role === "admin" ? "#1C1C1A" : "#5E8C77", color: "#FFFFFF", fontSize: 24, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, color: "#23201D" }}>{user.name}</h3>
                  <span style={{ fontSize: 10, fontWeight: 800, background: user.role === "admin" ? "#1C1C1A" : "#5E8C77", color: "#FFFFFF", padding: "3px 10px", borderRadius: 999, textTransform: "uppercase" }}>
                    {user.role}
                  </span>
                </div>
                <p style={{ fontSize: 13, color: "#6E6A63", marginTop: 2 }}>{user.email}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 12 }}>
              {user.role === "admin" && (<Link to="/admin" className="btn btn-teal btn-sm">
                  ⚡ Admin Portal
                </Link>)}
              <button onClick={() => navigate("/shop")} className="btn btn-ghost btn-sm">
                Shop Catalog
              </button>
            </div>
          </div>

          {/* Card 2: Profile Details Form */}
          <div style={{ background: "#FFFFFF", borderRadius: 24, padding: "32px", border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)" }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#23201D" }}>Personal Information</h3>
              <p style={{ fontSize: 12.5, color: "#9C968D", marginTop: 2 }}>Update your name, primary email address, and contact number.</p>
            </div>

            <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>FULL NAME *</label>
                <input type="text" required value={name} onChange={e => setName(e.target.value)} className="field field-sm" placeholder="e.g. Ritika Sharma"/>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>EMAIL ADDRESS *</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="field field-sm" placeholder="name@example.com"/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>PHONE NUMBER</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="field field-sm" placeholder="9876543210"/>
                </div>
              </div>

              <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" disabled={savingProfile} className="btn btn-teal btn-md">
                  {savingProfile ? "Saving..." : "Save Profile Details"}
                </button>
              </div>
            </form>
          </div>

          {/* Card 3: Password & Security */}
          <div style={{ background: "#FFFFFF", borderRadius: 24, padding: "32px", border: "1px solid #EAE3D9", boxShadow: "0 8px 24px rgba(35,32,29,0.03)" }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#23201D" }}>Security & Password</h3>
              <p style={{ fontSize: 12.5, color: "#9C968D", marginTop: 2 }}>Change your password to keep your account safe.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>CURRENT PASSWORD *</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="field field-sm" placeholder="Enter current password"/>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>NEW PASSWORD *</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="field field-sm" placeholder="At least 6 characters"/>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 700, color: "#23201D", display: "block", marginBottom: 6 }}>CONFIRM NEW PASSWORD *</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="field field-sm" placeholder="Repeat new password"/>
                </div>
              </div>

              <div style={{ marginTop: 8, display: "flex", justifyContent: "flex-end" }}>
                <button type="submit" disabled={savingPassword} className="btn btn-dark btn-md">
                  {savingPassword ? "Updating Password..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>);
}
