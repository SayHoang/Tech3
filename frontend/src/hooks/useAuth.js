import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Function to check authentication state
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const username = localStorage.getItem("username");
      const role = localStorage.getItem("role");

      if (token && username && role) {
        setIsAuthenticated(true);
        setUser({ username, role });
      } else {
        console.log("❌ User not authenticated");
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);

      console.log("✅ User authenticated:", { username, role });
    };

    // Check auth on component mount
    checkAuth();

    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e) => {
      if (e.key === "token" || e.key === "username" || e.key === "role") {
        console.log("🔄 Storage change detected, re-checking auth");
        checkAuth();
      }
    };

    // Listen for custom auth changes (same tab)
    const handleAuthChange = () => {
      console.log("🔄 Auth change event detected, re-checking auth");
      checkAuth();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const login = (token, username, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("role", role);
    setIsAuthenticated(true);
    setUser({ username, role });

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("authChange"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUser(null);

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("authChange"));
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
    getToken,
  };
};
