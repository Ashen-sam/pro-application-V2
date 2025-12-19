import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: Props) => {
    const { isLoaded, isSignedIn } = useAuth();
    const location = useLocation();

    if (!isLoaded) {
        // Show loading spinner
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </div>
        );
    }

    if (!isSignedIn) {
        // Redirect to login, save where the user tried to go
        return <Navigate to="/auth/callback" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};
