import { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { useToast, useDocumentTitle } from "../hooks";
import { getApiUrl } from "../api/config";

export default function ResetPassword() {
  useDocumentTitle("Reset Password");
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const { addToast } = useToast();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(getApiUrl("/api/auth/reset-password"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      setLoading(false);

      if (res.ok && data.success) {
        setSuccess(true);
        addToast("Password reset successfully! Please sign in with your new password.", "success");
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch (_err) {
      setLoading(false);
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div className="min-h-[80vh] bg-cream-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full border border-warm-grey-200 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-soft-lavender-100 text-soft-lavender-700 rounded-2xl flex items-center justify-center text-2xl mx-auto border border-soft-lavender-200">
            🔐
          </div>
          <h1 className="text-2xl font-serif font-bold text-charcoal">Set New Password</h1>
          <p className="text-xs text-dusty-taupe">Enter a secure password for your Elow account.</p>
        </div>

        {success ? (
          <div className="text-center space-y-4 py-4">
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-sm font-medium">
              ✨ Your password has been successfully updated!
            </div>
            <Link
              to="/"
              className="block w-full py-3 bg-soft-lavender-600 text-white font-bold rounded-xl hover:bg-soft-lavender-700 transition-all text-center text-sm shadow-sm"
            >
              Back to Home & Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wider">
                New Password (Min 8 chars)
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1 uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-warm-grey-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-soft-lavender-400"
              />
            </div>

            {error && (
              <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded-xl text-xs font-semibold">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !token}
              className="w-full py-3 bg-soft-lavender-600 text-white font-bold rounded-xl hover:bg-soft-lavender-700 disabled:opacity-50 transition-all text-sm shadow-sm"
            >
              {loading ? "Updating Password..." : "Reset Password"}
            </button>

            <div className="text-center pt-2">
              <Link to="/" className="text-xs text-soft-lavender-600 hover:text-soft-lavender-700 font-semibold">
                ← Return to Storefront
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

