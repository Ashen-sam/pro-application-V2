import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader2 } from "lucide-react";
import { showToast } from "@/components/common/commonToast";

export const ClerkCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoaded, isSignedIn } = useAuth();
    const { user } = useUser();

    // Preserve original page
    const fromPath = (location.state as any)?.from?.pathname || "/home";

    useEffect(() => {
        if (!isLoaded) return;

        if (!isSignedIn || !user) {
            navigate("/login", { replace: true });
            return;
        }

        const syncUser = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

                const response = await fetch(`${apiUrl}/api/auth/sync-clerk-user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        clerkUserId: user.id,
                        email: user.primaryEmailAddress?.emailAddress,
                        name: user.fullName || "User",
                    }),
                });

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error("User sync failed");
                }

                showToast.success("Login successful ✅", "Welcome back!");

                // Navigate to the original page user tried to visit
                navigate(fromPath, { replace: true });
            } catch (err) {
                showToast.error("Authentication failed", "Please try again");
                navigate("/login", { replace: true });
            }
        };

        // Only sync if user exists
        if (user) syncUser();
    }, [isLoaded, isSignedIn, user, navigate, fromPath]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center space-y-3">
                <Loader2 className="h-10 w-10 animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">
                    Setting up your account…
                </p>
            </div>
        </div>
    );
};
