import React from "react";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthGuard = ({ allowedPositions, children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        const isEmployed = decodedToken.isEmployed || false; // true -> Employee, false -> Customer
        const isAdmin = decodedToken.isAdmin || false; // Boolean
        const userPosition = decodedToken.position || null; // "WORKER", "MANAGER", "DIRECTOR", "HR", "NONE"
                                                            // "SUPERVISOR", "AGENT"
        const permissions = decodedToken.permissions || []; // List of permissions

        // Check if the customer has trade permissions
        const hasTradePermission = permissions.includes("user.customer.trade"); //MOZDA SE DRUGACIJE BUDE ZVALA PERMISIJA

        console.log(
            "User employed:", isEmployed,
            "Admin status:", isAdmin,
            "Position:", userPosition,
            "Trade Permission:", hasTradePermission
        );

        // The page is accessible to All Users
        if (!allowedPositions || allowedPositions.length === 0) {
            return children;
        }

        // If the user is Employee, check allowed positions
        if (isEmployed) {
            if (isAdmin && allowedPositions.includes("ADMIN")) {
                return children;
            }
            if (userPosition && allowedPositions.includes(userPosition)) {
                return children;
            }
            return <Navigate to="/home" replace />;
        }

        // If the user is Customer
        if (!isEmployed) {

            // If the Customer has Trade Permission and the route allows Trade Customers
            if (hasTradePermission && allowedPositions.includes("TRADE_CUSTOMER")) {
                return children;
            }

            // If Customer tries to access a restricted page
            return <Navigate to="/home" replace />;
        }

        return <Navigate to="/home" replace />;

    } catch (error) {
        console.error("Invalid token", error);
        return <Navigate to="/home" replace />;
    }
};

export default AuthGuard;
