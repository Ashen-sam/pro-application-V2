import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useGetUserByIdQuery } from "@/features/auth/authApi";
import { LogOut } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { CommonDialog } from "../common/commonDialog";
import { CommonDialogFooter } from "../common/commonDialogFooter";
import { Header } from "./Header";

const breadcrumbLabels: Record<string, string> = {
    "/": "Home",
    "/projects": "Projects",
    "/board": "Board",
    "/calendar": "Calendar",
    "/reports": "Reports",
    "/tasks": "Tasks",
    "/milestones": "Milestones",
    "/timeline": "Timeline",
    "/settings": "Settings",
};

export const GlobalLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [, setUserName] = useState("");
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

    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <div className="flex h-screen overflow-y-hidden dark:bg-[#191919] ">
            <div className="relative flex  border rounded-sm  w-full">
                <div className="flex-1 flex flex-col dark:bg-[#191919]">
                    <div className="border-b ">
                        <div className="px-8 py-3.5 flex justify-between">
                            <Breadcrumb>
                                <BreadcrumbList className="flex items-center">
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                Home
                                            </Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>

                                    {pathnames.map((pathname, index) => {
                                        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                                        const isLast = index === pathnames.length - 1;
                                        const label = breadcrumbLabels[routeTo] || pathname;

                                        return (
                                            <Fragment key={routeTo}>
                                                <BreadcrumbSeparator className="text-muted-foreground" />
                                                <BreadcrumbItem>
                                                    {isLast ? (
                                                        <BreadcrumbPage className="text-sm font-semibold text-foreground">
                                                            {label}
                                                        </BreadcrumbPage>
                                                    ) : (
                                                        <BreadcrumbLink asChild>
                                                            <Link to={routeTo} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                                                {label}
                                                            </Link>
                                                        </BreadcrumbLink>
                                                    )}
                                                </BreadcrumbItem>
                                            </Fragment>
                                        );
                                    })}
                                </BreadcrumbList>
                            </Breadcrumb>

                            <div className="flex items-center gap-4">
                                <div className="text-xs text-gray-400">
                                    {new Date().toLocaleString("en-US", {
                                        weekday: "long",
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-semibold shrink-0 cursor-pointer">
                                            {initials}
                                        </div>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-40 p-2">
                                        <Button
                                            variant="ghost"
                                            className="w-full justify-start text-sm"
                                            onClick={handleLogoutClick}
                                        >
                                            Logout
                                        </Button>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                    <Header />
                    <main className=" overflow-auto max-w-7xl m-auto  w-full dark:bg-[#191919]   h-full ">
                        <div className="py-10 px-6 overflow-auto ">
                            <Outlet />
                        </div>
                    </main>
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



        </div>
    );
};