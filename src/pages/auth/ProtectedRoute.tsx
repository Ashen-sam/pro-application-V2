import React from "react";
import { Navigate } from "react-router-dom";

type Props = { children: React.ReactElement };

export const ProtectedRoute = ({ children }: Props) => {
    // use the same key name as Login
    const isLoggedIn = localStorage.getItem("isAuthenticated") === "true";

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
