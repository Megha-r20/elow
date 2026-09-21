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
            return localStorage.getItem("elow_token");
        } catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const refreshSession = useCallback(async () => {
        try {
            const res = await fetch(getApiUrl("/api/auth/refresh"), {
                method: "POST",
                credentials: "include",
            });
            if (res.ok) {
                const data = await res.json();
                setToken(data.token);
                setUser(data.user);
                localStorage.setItem("elow_token", data.token);
                localStorage.setItem("elow_user", JSON.stringify(data.user));
                return data.token;
            }
        } catch (err) {
            console.error("Refresh session error:", err);
        }
        return null;
    }, []);

    // Check current authenticated user on load or token change
    useEffect(() => {
        async function fetchMe() {
            if (!token) {
                const newToken = await refreshSession();
                if (!newToken) {
                    setUser(null);
                    localStorage.removeItem("elow_user");
                }
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(getApiUrl("/api/auth/me"), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                    localStorage.setItem("elow_user", JSON.stringify(data.user));
                } else if (res.status === 401) {
                    const newToken = await refreshSession();
                    if (!newToken) {
                        localStorage.removeItem("elow_token");
                        localStorage.removeItem("elow_user");
                        setToken(null);
                        setUser(null);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user auth state:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchMe();
    }, [token, refreshSession]);

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
            localStorage.setItem("elow_token", data.token);
            localStorage.setItem("elow_user", JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || "Network error. Please try again." };
        }
    }, []);

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
            localStorage.setItem("elow_token", data.token);
            localStorage.setItem("elow_user", JSON.stringify(data.user));
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || "Network error. Please try again." };
        }
    }, []);

    const updateProfile = useCallback(async (data) => {
        if (!token)
            return { success: false, error: "Not authenticated" };
        try {
            const res = await fetch(getApiUrl("/api/auth/profile"), {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                credentials: "include",
                body: JSON.stringify(data),
            });
            const resData = await res.json();
            if (!res.ok) {
                return { success: false, error: resData.error || "Failed to update profile" };
            }
            setUser(resData.user);
            localStorage.setItem("elow_user", JSON.stringify(resData.user));
            return { success: true };
        } catch (err) {
            return { success: false, error: err.message || "Network error updating profile" };
        }
    }, [token]);

    const logout = useCallback(async () => {
        try {
            await fetch(getApiUrl("/api/auth/logout"), {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error("Logout network error:", err);
        }
        localStorage.removeItem("elow_token");
        localStorage.removeItem("elow_user");
        setToken(null);
        setUser(null);
    }, []);

    const authFetch = useCallback(async (url, options = {}) => {
        const headers = { ...(options.headers || {}) };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
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
    return (<AuthContext.Provider value={{
            user,
            token,
            isAdmin,
            loading,
            login,
            register,
            updateProfile,
            logout,
            authFetch,
            refreshSession,
        }}>
      {children}
    </AuthContext.Provider>);
}
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}
