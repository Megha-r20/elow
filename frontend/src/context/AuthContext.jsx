import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getApiUrl } from "../api/config";
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => {
        try {
            return localStorage.getItem("elow_token");
        }
        catch {
            return null;
        }
    });
    const [loading, setLoading] = useState(true);
    // Check current authenticated user on load or token change
    useEffect(() => {
        async function fetchMe() {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const res = await fetch(getApiUrl("/api/auth/me"), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
                else {
                    // Token invalid or expired
                    localStorage.removeItem("elow_token");
                    setToken(null);
                    setUser(null);
                }
            }
            catch (err) {
                console.error("Failed to fetch user auth state:", err);
            }
            finally {
                setLoading(false);
            }
        }
        fetchMe();
    }, [token]);
    const login = useCallback(async (email, password) => {
        try {
            const res = await fetch(getApiUrl("/api/auth/login"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        }
        catch (err) {
            return { success: false, error: err.message || "Network error. Please try again." };
        }
    }, []);
    const register = useCallback(async (name, email, password, role = "user") => {
        try {
            const res = await fetch(getApiUrl("/api/auth/register"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, role }),
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
            setToken(data.token);
            setUser(data.user);
            return { success: true };
        }
        catch (err) {
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
                body: JSON.stringify(data),
            });
            const resData = await res.json();
            if (!res.ok) {
                return { success: false, error: resData.error || "Failed to update profile" };
            }
            setUser(resData.user);
            return { success: true };
        }
        catch (err) {
            return { success: false, error: err.message || "Network error updating profile" };
        }
    }, [token]);
    const logout = useCallback(() => {
        localStorage.removeItem("elow_token");
        setToken(null);
        setUser(null);
    }, []);
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
