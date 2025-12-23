import { CommonDialog } from "@/components/common/commonDialog";
import { CommonDialogFooter } from "@/components/common/commonDialogFooter";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useGetUserByIdQuery } from "@/features/auth/authApi";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export const ProfileTop = () => {
    const navigate = useNavigate();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [userName, setUserName] = useState("");
    const [initials, setInitials] = useState("");

    const userId = localStorage.getItem("userId");
    const { data: user } = useGetUserByIdQuery(Number(userId), {
        skip: !userId,
    });

    useEffect(() => {
        if (user) {
            setUserName(user.name);
            const userInitials = user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();
            setInitials(userInitials);
        }
    }, [user]);

    const handleLogoutClick = () => {
        setShowLogoutDialog(true);
    };

    const handleLogoutConfirm = () => {
        localStorage.clear();
        setShowLogoutDialog(false);
        navigate("/login", { replace: true });
    };

    const handleLogoutCancel = () => {
        setShowLogoutDialog(false);
    };

    return (
        <>
            <div className=" bg-background dark:bg-transparent">
                <div className="px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Popover>
                            <PopoverTrigger asChild>
                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/40 border text-white text-sm font-semibold shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
                                    {initials}
                                </div>
                            </PopoverTrigger>

                            <PopoverContent className="w-40 p-2" align="start">
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-sm"
                                    onClick={handleLogoutClick}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </Button>
                            </PopoverContent>
                        </Popover>

                        <div>
                            {/* <div className="text-sm font-semibold text-foreground">
                                {userName}
                            </div> */}
                            {/* <div className="text-xs text-muted-foreground">Free Plan</div> */}
                        </div>
                    </div>

                    {/* <div className="flex items-center gap-4">
                        <div className="text-xs text-muted-foreground">
                            {new Date().toLocaleString("en-US", {
                                weekday: "long",
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                            })}
                        </div>
                    </div> */}
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
                        confirmText="Logout"
                    />
                }
            >
                <div className="text-sm text-muted-foreground">
                    Are you sure you want to logout? Logging out will end your current session, and you will need to sign in again to continue using your account.
                </div>
            </CommonDialog>
        </>
    );
};