import { createContext, useContext, useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_MUTATION, REGISTER_MUTATION } from "../graphql/auth.js";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loginMutation, { loading: loginLoading }] =
    useMutation(LOGIN_MUTATION);
  const [registerMutation, { loading: registerLoading }] =
    useMutation(REGISTER_MUTATION);

  useEffect(() => {
    // Check if user is logged in on initial load
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode JWT to get user info (simple decode, not verification)
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        const decodedToken = JSON.parse(jsonPayload);

        // Check if token is not expired
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp > currentTime) {
          setUser({
            username: decodedToken.username,
            role: decodedToken.role,
          });
        } else {
          // Token expired, remove it
          localStorage.removeItem("token");
        }
      } catch (error) {
        console.error("Failed to parse token", error);
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const handleLogin = async (username, password) => {
    try {
      const { data } = await loginMutation({
        variables: {
          input: {
            username,
            password,
          },
        },
      });

      if (data.login.success) {
        const { jwt } = data.login.data;

        // Save token
        localStorage.setItem("token", jwt);

        // Decode JWT to get user info
        const base64Url = jwt.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        );

        const decodedToken = JSON.parse(jsonPayload);

        setUser({
          username: decodedToken.username,
          role: decodedToken.role,
        });

        // Dispatch auth change event for other components (cart, etc.)
        window.dispatchEvent(new CustomEvent("authChange"));

        return { success: true, userRole: decodedToken.role };
      } else {
        return {
          success: false,
          message: data.login.message,
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const handleRegister = async (username, password) => {
    try {
      const { data } = await registerMutation({
        variables: {
          input: {
            username,
            password,
          },
        },
      });

      if (data.register.success) {
        return { success: true, message: data.register.message };
      } else {
        return {
          success: false,
          message: data.register.message,
        };
      }
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message: error.message,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);

    // Dispatch auth change event for other components (cart, etc.)
    window.dispatchEvent(new CustomEvent("authChange"));
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login: handleLogin,
        register: handleRegister,
        logout,
        getToken,
        loginLoading,
        registerLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
