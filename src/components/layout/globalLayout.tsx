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
import { Sidebar } from "./sideBar";

const breadcrumbLabels: Record<string, string> = {
    "/": "Home",
    "/home": "Overview",
    "/projects": "Projects",
    "/board": "Board",
    "/calendar": "Calendar",
    "/reports": "Reports",
    "/tasks": "Tasks",
    "/milestones": "Milestones",
    "/timeline": "Timeline",
    "/settings": "Settings",
    "/project-flow": "Flow",
};

export const GlobalLayout = () => {
    const location = useLocation();
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

    const pathnames = location.pathname.split("/").filter((x) => x);

    return (
        <div className="items-center justify-center min-h-screen  flex-col w-full   dark:bg-[#141414] ">
            <div className="flex justify-center gap-5   pt-32   overflow-hidden bg-background  dark:bg-[#141414]  max-w-7xl m-auto">
                {/* Sidebar */}
                <Sidebar />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col overflow-hidden ">
                    {/* <div className="border-b bg-background dark:bg-[#1a1a1a]">
                    <div className="px-6 py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white text-sm font-semibold shrink-0 cursor-pointer hover:opacity-90 transition-opacity">
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
                                <div className="text-sm font-semibold text-foreground">{userName}</div>
                                <div className="text-xs text-muted-foreground">Free Plan</div>
                            </div>
                        </div>

                <div className="flex items-center gap-4">
                    <div className="text-xs text-muted-foreground">
                        {new Date().toLocaleString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                        })}
                    </div>
                </div>
            </div>
        </div> */}

                    {/* <div className="border-b bg-background dark:bg-[#1a1a1a]">
                    <div className="px-6 py-2.5">
                        <Breadcrumb>
                            <BreadcrumbList className="flex items-center">
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/home" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
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
                                                    <BreadcrumbPage className="text-xs font-semibold text-foreground">
                                                        {label}
                                                    </BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink asChild>
                                                        <Link to={routeTo} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
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
                    </div>
                </div> */}

                    {/* Main Content */}
                    <main className="flex-1 overflow-auto bg-background dark:bg-[#141414] ">
                        <div className="p-3">
                            <Outlet />
                        </div>
                    </main>
                </div >

                {/* Logout Dialog */}
                <CommonDialog
                    className="min-w-[400px]"
                    open={showLogoutDialog}
                    onOpenChange={setShowLogoutDialog}
                    title="Confirm Logout"
                    icon={< LogOut className="text-primary" size={20} />}
                    size="sm"
                    footer={
                        < CommonDialogFooter
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
                </CommonDialog >
            </div >
        </div>
    );
};