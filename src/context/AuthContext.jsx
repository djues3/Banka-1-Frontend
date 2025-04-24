import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [authLoaded, setAuthLoaded] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const fetchUserInfo = async () => {
        if (window.location.host.includes(`${process.env.REACT_APP_IDP_API_URL}`)) {
            console.log("IdP")
            return;
        }
        try {
            const response = await axios.get('/api/whoami', {
                withCredentials: true // Important for including cookies in the request
            });

            if (response.data && response.data.authenticated) {
                const info = response.data;
                info.isClient = !info.isEmployed
                setIsLoggedIn(true);
                setUserInfo(info);
                setError(null);
                setAuthLoaded(true);
                return response.data;
            } else {
                setIsLoggedIn(false);
                setUserInfo(null);
                setAuthLoaded(false);
                return null;
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
            setIsLoggedIn(false);
            setUserInfo(null);
            setError(error.message || "Failed to fetch user information");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // Check authentication status when the app loads
    useEffect(() => {
        const checkAuthStatus = async () => {
            await fetchUserInfo();
        };

        checkAuthStatus().then(_ => {});
    }, []);

    // Redirect based on the user type after login
    useEffect(() => {
        if (userInfo && isLoggedIn) {
            const currentPath = location.pathname;

            // Only redirect if we're on the login or home page
            if (currentPath === "/" || currentPath === "/login") {
                console.log("Redirecting to home page")
                if (userInfo.isEmployed) {
                    navigate("/employee-home");
                } else {
                    navigate("/customer-home");
                }
            }
        }
    }, [userInfo, isLoggedIn, navigate, location.pathname]);

    // Login is now just triggering the flow to the IdP
    const login = () => {
        // Redirect to the gateway's login endpoint
        window.location.href = "/api/login";
    };

    // Logout function - this should call your server's logout endpoint
    const logout = async () => {
        try {
            await axios.post('/api/logout', {}, { withCredentials: true });

            // Clear local state
            setIsLoggedIn(false);
            setUserInfo(null);

            // Redirect to home page
            navigate("/");
        } catch (error) {
            console.error("Logout error:", error);
            setError("Failed to logout properly");
        }
    };

    // Helper function to check if user has a specific permission
    const hasPermission = (permission) => {
        if (!userInfo || !userInfo.permissions) {
            return false;
        }
        return userInfo.permissions.includes(permission);
    };

    // Helper function to check if user is admin
    const isAdmin = () => {
        return userInfo?.isAdmin === true;
    };

    // Helper function to check if user is an employee
    const isEmployee = () => {
        return userInfo?.isEmployed === true;
    };

    const refreshUserInfo = async () => {
        return await fetchUserInfo();
    };

    return (
      <AuthContext.Provider
        value={{
            isLoggedIn,
            userInfo,
            loading,
            error,
            login,
            logout,
            hasPermission,
            isAdmin,
            isEmployee,
            refreshUserInfo,
            authLoaded,
        }}
      >
          {children}
      </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext)
