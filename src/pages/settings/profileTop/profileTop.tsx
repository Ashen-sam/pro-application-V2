import { CommonDialog } from "@/components/common/commonDialog";
import { CommonDialogFooter } from "@/components/common/commonDialogFooter";
import { Button } from "@/components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { showToast } from "@/components/common/commonToast";
import { useGetCurrentUserQuery } from "@/features/auth/authApi";

export const ProfileTop = () => {
    const navigate = useNavigate();
    const { user: clerkUser, isLoaded } = useUser();
    const { signOut } = useClerk();
    const { data: dbUser } = useGetCurrentUserQuery();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const userName = dbUser?.name || clerkUser?.fullName || clerkUser?.username || "";
    const userEmail = dbUser?.email || clerkUser?.primaryEmailAddress?.emailAddress || "";

    const initials = userName
        ? userName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "??";

    const handleLogoutClick = () => {
        setShowLogoutDialog(true);
    };

    const handleLogoutConfirm = async () => {
        setIsLoggingOut(true);

        try {
            // Sign out from Clerk
            await signOut();

            // Clear any local storage
            localStorage.clear();

            // Clear session storage as well
            sessionStorage.clear();

            // Show success message
            showToast.success("Logged out successfully", "See you next time!");

            // Close dialog
            setShowLogoutDialog(false);

            // Redirect to login page
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout error:", error);
            showToast.error("Logout failed", "Please try again");
            setIsLoggingOut(false);
        }
    };

    const handleLogoutCancel = () => {
        setShowLogoutDialog(false);
    };

    const handleProfileClick = () => {
        navigate("/profile");
    };

    if (!isLoaded) {
        return (
            <div className="bg-background dark:bg-transparent">
                <div className="px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
                        <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-background dark:bg-transparent">
                <div className="px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Popover>

                            <PopoverTrigger asChild>
                                <Avatar className="w-9 h-9 cursor-pointer hover:opacity-90 transition-opacity border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500">
                                    {(clerkUser?.imageUrl || dbUser?.avatar_url) ? (
                                        <AvatarImage
                                            src={clerkUser?.imageUrl || dbUser?.avatar_url}
                                            alt={userName}
                                        />
                                    ) : (
                                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                                            {initials}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-2 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-800" align="start">
                                <div className="px-3 py-2.5 mb-1">
                                    <div className="text-sm font-semibold text-foreground truncate">
                                        {userName}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {userEmail}
                                    </div>
                                    {dbUser?.user_id && (
                                        <div className="text-xs text-muted-foreground mt-1 font-mono">
                                            ID: {dbUser.user_id}
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-neutral-200 dark:border-neutral-700 my-1.5" />

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-sm rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
                                    onClick={handleProfileClick}
                                >
                                    <User className="mr-2 h-4 w-4" />
                                    View Profile
                                </Button>

                                <div className="border-t border-neutral-200 dark:border-neutral-700 my-1.5" />

                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-sm text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 dark:text-red-400 dark:hover:text-red-300 rounded-lg"
                                    onClick={handleLogoutClick}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            </PopoverContent>
                        </Popover>

                        <div>
                            <div className="text-sm font-semibold text-foreground">
                                {userName}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <CommonDialog
                className="min-w-[400px]"
                open={showLogoutDialog}
                onOpenChange={setShowLogoutDialog}
                title="Confirm Logout"
                icon={<LogOut className="text-primary" size={20} />}
                size="sm"
                footer={
                    <CommonDialogFooter
                        info="You will need to sign in again to access your account."
                        onCancel={handleLogoutCancel}
                        onConfirm={handleLogoutConfirm}
                        cancelText="Cancel"
                        confirmText={isLoggingOut ? "Logging out..." : "Logout"}
                        isLoading={isLoggingOut}
                    />
                }
            >
                <div className="text-sm text-muted-foreground space-y-3">
                    <p>
                        Are you sure you want to logout? Logging out will end your current session, and you will need to sign in again to continue using your account.
                    </p>
                    {isLoggingOut && (
                        <div className="flex items-center justify-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Signing out securely...</span>
                        </div>
                    )}
                </div>
            </CommonDialog>
        </>
    );
};