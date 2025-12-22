import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Calendar,
    FolderArchive,
    Inbox,
    Package,
    Settings
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "../common/mode-toggle";

const topNavItems = [
    { to: "/", icon: Inbox, label: "Home" },
];

const workspaceItems = [
    { to: "/projects", icon: Package, label: "Projects" },
    { to: "/calendar", icon: Calendar, label: "Calendar" },
    { to: '/project-flow', icon: FolderArchive, label: 'Flow' }
];

export const Header = () => {
    const location = useLocation();

    const isActive = (path: string) =>
        path === "/"
            ? location.pathname === "/"
            : location.pathname === path || location.pathname.startsWith(path + "/");


    return (
        <div className="w-full border-b bg-[#fcfcfc] dark:bg-[#282828]" >
            <div className="flex items-center justify-between px-4 ">
                < div className="flex items-center gap-1" >
                    {
                        topNavItems.map((item) => (
                            <Link key={item.to} to={item.to}>
                                <div
                                    className={cn(
                                        "flex  items-center gap-2 h-9 px-3 text-[11px] transition-all font-medium duration-300",
                                        isActive(item.to)
                                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                                            : "hover:bg-primary/5"
                                    )}
                                >
                                    <item.icon size={16} className="shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </div>
                            </Link>
                        ))
                    }

                    < Separator orientation="vertical" className="mx-2 h-6" />


                    {/* Workspace Items */}
                    {
                        workspaceItems.map((item) => (
                            <Link key={item.to} to={item.to}>
                                <div
                                    className={cn(
                                        "flex  items-center gap-2 h-9 px-3 text-[11px] transition-all font-medium duration-300",
                                        isActive(item.to)
                                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                                            : "hover:bg-primary/5"
                                    )}
                                >
                                    <item.icon size={16} className="shrink-0" />
                                    <span className="truncate">{item.label}</span>
                                </div>
                            </Link>
                        ))
                    }


                    {/* Settings */}
                    <Link to="/settings">
                        <div
                            className={cn(
                                "flex  items-center gap-2 h-9 px-3 text-[11px] transition-all font-medium duration-300",
                                isActive("/settings")
                                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                                    : "hover:bg-primary/5"
                            )}
                        >
                            <Settings size={16} className="shrink-0" />
                            <span className="truncate">Settings</span>
                        </div>
                    </Link>
                </ div>

                {/* Right Section - Mode Toggle */}
                < div className="flex items-center" >
                    <ModeToggle />
                </div >
            </div >
        </div >
    );
};