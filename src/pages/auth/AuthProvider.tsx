import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { setClerkToken } from "./clerkToken";

export const ClerkTokenSync = () => {
    const { isSignedIn, getToken } = useAuth();

    useEffect(() => {
        const syncToken = async () => {
            if (isSignedIn) {
                const token = await getToken();
                setClerkToken(token);
                localStorage.setItem("authMethod", "clerk");
            } else {
                setClerkToken(null);
            }
        };

        syncToken();
    }, [isSignedIn, getToken]);

    return null;
};
