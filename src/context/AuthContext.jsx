import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [authLoaded, setAuthLoaded] = useState(false);
    const [redirectTo, setRedirectTo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            logout();
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const isValid = decoded?.exp * 1000 > Date.now();

            if (isValid) {
                setIsLoggedIn(true);
                setUserInfo(decoded);
            } else {
                logout();
            }
        } catch {
            logout();
        } finally {
            setAuthLoaded(true);
        }
    }, []);

    useEffect(() => {
        if (redirectTo) {
            navigate(redirectTo);
            setRedirectTo(null);
        }
    }, [redirectTo, navigate]);

    const login = (token) => {
        try {
            const decoded = jwtDecode(token);
            localStorage.setItem("token", token);
            setIsLoggedIn(true);
            setUserInfo(decoded);

            if (decoded.isEmployed) {
                setRedirectTo("/employee-home");
            } else {
                setRedirectTo("/customer-home");
            }
        } catch (error) {
            console.error("Failed to decode token on login:", error);
        }
    };

    const logout = (redirectPath = "/login") => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserInfo(null);
        setAuthLoaded(true);
        setRedirectTo(redirectPath);
    };

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, userInfo, login, logout, authLoaded }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
