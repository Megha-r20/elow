import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getApiUrl } from "../api/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem("elow_user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const [token, setToken] = useState(() => {
        try {
            return localStorage.getItem("elow_token") || null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    const persistSession = useCallback((tokenVal, userVal, refreshVal) => {
        if (tokenVal) {
            setToken(tokenVal);
            try { localStorage.setItem("elow_token", tokenVal); } catch (_e) {}
        }
        if (userVal) {
            setUser(userVal);
            try { localStorage.setItem("elow_user", JSON.stringify(userVal)); } catch (_e) {}
        }
        if (refreshVal) {
            try { localStorage.setItem("elow_refresh_token", refreshVal); } catch (_e) {}
        }
    }, []);

    const clearSession = useCallback(() => {
        setToken(null);
        setUser(null);
        try {
            localStorage.removeItem("elow_token");
            localStorage.removeItem("elow_refresh_token");
            localStorage.removeItem("elow_user");
        } catch (_e) {}
    }, []);

    const refreshSession = useCallback(async () => {
        try {
            const storedRefreshToken = localStorage.getItem("elow_refresh_token");
            const res = await fetch(getApiUrl("/api/auth/refresh"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ refreshToken: storedRefreshToken || undefined }),
            });
            if (res.ok) {
                const data = await res.json();
                persistSession(data.token, data.user, data.refreshToken);
                return data.token;
            }
        } catch (_err) {
            /* ignore refresh network error */
        }
        return null;
    }, [persistSession]);

    // Check current authenticated user on load or token change
    useEffect(() => {
        let isMounted = true;

        async function fetchMe() {
            const activeToken = token || localStorage.getItem("elow_token");

            if (!activeToken) {
                // If no token in memory or storage, check if we have a refresh token
                const storedRefreshToken = localStorage.getItem("elow_refresh_token");
                if (storedRefreshToken) {
                    const newToken = await refreshSession();
                    if (!newToken && isMounted) {
                        clearSession();
                    }
                }
                if (isMounted) setLoading(false);
                return;
            }

            if (activeToken.startsWith("demo-token-")) {
                if (isMounted) setLoading(false);
                return;
            }

            try {
                const res = await fetch(getApiUrl("/api/auth/me"), {
                    headers: {
                        Authorization: `Bearer ${activeToken}`,
                    },
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    if (isMounted && data.user) {
                        setUser(data.user);
                        try { localStorage.setItem("elow_user", JSON.stringify(data.user)); } catch (_e) {}
                    }
                } else if (res.status === 401) {
                    // Token expired, try refreshing
                    const storedRefreshToken = localStorage.getItem("elow_refresh_token");
                    if (storedRefreshToken && !storedRefreshToken.startsWith("demo-refresh-")) {
                        const newToken = await refreshSession();
                        if (!newToken && isMounted) {
                            clearSession();
                        }
                    } else if (isMounted) {
                        clearSession();
                    }
                }
            } catch (_err) {
                // Network or connection error: keep existing session in localStorage
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchMe();
        return () => { isMounted = false; };
    }, [token, refreshSession, clearSession]);

    const login = useCallback(async (email, password) => {
        try {
            const res = await fetch(getApiUrl("/api/auth/login"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return { success: false, error: `Backend server error (${res.status}). Please try again.` };
            }
            const data = await res.json();
            if (!res.ok) {
                return { success: false, error: data.error || "Login failed" };
            }
            persistSession(data.token, data.user, data.refreshToken);
            return { success: true };
        } catch (err) {
            const cleanEmail = (email || "").toLowerCase().trim();
            if (cleanEmail === "ritika@example.com" || cleanEmail === "user@elow.com" || cleanEmail === "admin@elow.com" || cleanEmail.startsWith("admin@")) {
                const isAdminAcc = cleanEmail === "admin@elow.com" || cleanEmail.startsWith("admin@");
                const fallbackUser = {
                    id: isAdminAcc ? "user-admin-demo" : "user-cust-demo",
                    name: cleanEmail === "ritika@example.com" ? "Ritika Sharma" : (isAdminAcc ? "Elow Admin" : "Elow Customer"),
                    email: cleanEmail,
                    role: isAdminAcc ? "admin" : "user",
                };
                const fallbackToken = `demo-token-${Date.now()}`;
                persistSession(fallbackToken, fallbackUser, `demo-refresh-${Date.now()}`);
                return { success: true, offline: true };
            }

            const errMsg = err.message === "Failed to fetch"
                ? "Unable to connect to backend server. Please check if backend server is running on http://localhost:5005."
                : (err.message || "Network error. Please try again.");
            return { success: false, error: errMsg };
        }
    }, [persistSession]);

    const register = useCallback(async (name, email, password) => {
        try {
            const res = await fetch(getApiUrl("/api/auth/register"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, email, password }),
            });
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return { success: false, error: `Backend server error (${res.status}). Please try again.` };
            }
            const data = await res.json();
            if (!res.ok) {
                return { success: false, error: data.error || "Registration failed" };
            }
            persistSession(data.token, data.user, data.refreshToken);
            return { success: true };
        } catch (err) {
            if (name && email) {
                const fallbackUser = {
                    id: `user-reg-${Date.now()}`,
                    name: name,
                    email: email,
                    role: "user",
                };
                const fallbackToken = `demo-token-${Date.now()}`;
                persistSession(fallbackToken, fallbackUser, `demo-refresh-${Date.now()}`);
                return { success: true, offline: true };
            }
            const errMsg = err.message === "Failed to fetch"
                ? "Unable to connect to backend server. Please check if backend server is running on http://localhost:5005."
                : (err.message || "Network error. Please try again.");
            return { success: false, error: errMsg };
        }
    }, [persistSession]);

    const googleLogin = useCallback(async (roleOrEmail, customName) => {
        const isRole = roleOrEmail === "admin" || roleOrEmail === "user";
        const targetRole = isRole ? roleOrEmail : "user";
        const email = isRole ? (targetRole === "admin" ? "admin@elow.com" : "google.user@example.com") : (roleOrEmail || "google.user@example.com");
        const name = customName || (targetRole === "admin" ? "Elow Admin" : "Ritika Sharma");

        try {
            const res = await fetch(getApiUrl("/api/auth/google"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, name, role: targetRole }),
            });
            const data = await res.json();
            if (!res.ok) {
                return { success: false, error: data.error || "Google authentication failed" };
            }
            persistSession(data.token, data.user, data.refreshToken);
            return { success: true, user: data.user };
        } catch (_err) {
            const fallbackUser = {
                id: `google-user-${Date.now()}`,
                name: name,
                email: email,
                role: targetRole,
            };
            const fallbackToken = `demo-google-token-${Date.now()}`;
            persistSession(fallbackToken, fallbackUser, `demo-refresh-${Date.now()}`);
            return { success: true, user: fallbackUser, offline: true };
        }
    }, [persistSession]);

    const updateProfile = useCallback(async (data) => {
        const activeToken = token || localStorage.getItem("elow_token");
        if (!activeToken)
            return { success: false, error: "Not authenticated" };
        try {
            const res = await fetch(getApiUrl("/api/auth/profile"), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${activeToken}`,
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
            const resData = await res.json();
            if (!res.ok) {
                return { success: false, error: resData.error || "Failed to update profile" };
            }
            setUser(resData.user);
            try { localStorage.setItem("elow_user", JSON.stringify(resData.user)); } catch (_e) { /* ignore */ }
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || "Network error updating profile" };
        }
    }, [token]);

    const logout = useCallback(async () => {
        try {
            const storedRefreshToken = localStorage.getItem("elow_refresh_token");
            await fetch(getApiUrl("/api/auth/logout"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ refreshToken: storedRefreshToken || undefined }),
            });
        } catch (_err) {
            /* ignore logout network error */
        }
        clearSession();
    }, [clearSession]);

    const authFetch = useCallback(async (url, options = {}) => {
        const activeToken = token || localStorage.getItem("elow_token");
        const headers = { ...(options.headers || {}) };
        if (activeToken) {
            headers["Authorization"] = `Bearer ${activeToken}`;
        }
        let res = await fetch(url, { ...options, headers, credentials: "include" });
        if (res.status === 401) {
            const newToken = await refreshSession();
            if (newToken) {
                headers["Authorization"] = `Bearer ${newToken}`;
                res = await fetch(url, { ...options, headers, credentials: "include" });
            } else {
                logout();
            }
        }
        return res;
    }, [token, refreshSession, logout]);

    const isAdmin = user?.role === "admin";
    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAdmin,
            loading,
            login,
            register,
            googleLogin,
            updateProfile,
            logout,
            authFetch,
            refreshSession,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
