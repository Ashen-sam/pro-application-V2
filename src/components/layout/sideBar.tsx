import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/clerk-react";
import {
    Bolt,
    Calendar,
    ChevronLeft,
    ChevronRight,
    FolderArchive,
    FolderOpen,
    Settings
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "../common/mode-toggle";
import type { SidebarProps } from "./types";

const topNavItems = [
    { to: "/home", icon: Bolt, label: "Overview", id: "nav-overview" },
];

const workspaceItems = [
    { to: "/projects", icon: FolderOpen, label: "Projects", id: "nav-projects" },
    { to: "/calendar", icon: Calendar, label: "Calendar", id: "nav-calendar" },
    { to: "/project-flow", icon: FolderArchive, label: "Flow", id: "nav-flow" },
];

export const Sidebar = ({ className }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const isActive = (path: string) =>
        path === "/"
            ? location.pathname === "/"
            : location.pathname === path || location.pathname.startsWith(path + "/");


    const { user } = useUser();
    return (
        <div
            id="sidebar-navigation"
            className={cn(
                "relative flex flex-col bg-transparent dark:bg-transparent transition-all duration-300",
                "text-gray-700 dark:text-muted-foreground",
                isCollapsed ? "w-16" : "w-[300px]",
                className
            )}
        >
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow"
            >
                {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                ) : (
                    <ChevronLeft className="h-3 w-3" />
                )}
            </Button>

            {!isCollapsed && (
                <div className="px-4 py-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-slate-200">
                        {user?.fullName || user?.firstName || 'Guest User'}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-muted-foreground">
                        Free Plan · {user?.primaryEmailAddress?.emailAddress || 'No email'}
                    </div>
                </div>
            )}

            <Separator className="bg-gray-200 dark:bg-white/10" />

            <div
                id="theme-toggle"
                className={cn("px-3 py-3", isCollapsed && "flex justify-center")}
            >
                <ModeToggle />
            </div>
            <ScrollArea className="flex-1">
                <div className="px-2 py-2 space-y-1">
                    {topNavItems.map((item) => (
                        <Link key={item.to} to={item.to}>
                            <div
                                id={item.id}
                                className={cn(
                                    "group flex h-9 items-center gap-3 rounded-md px-3 text-sm transition",
                                    isCollapsed ? "justify-center px-0" : "justify-start",
                                    isActive(item.to)
                                        ? "bg-gray-900/10  dark:bg-white/10 dark:text-slate-200 text-gray-700"
                                        : "hover:bg-gray-900/5 dark:hover:bg-white/5"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon
                                    size={16}
                                    className="transition-colors duration-200 group-hover:text-gray-900 dark:group-hover:text-white"
                                />
                                {!isCollapsed && <span className="text-xs font-medium">{item.label}</span>}
                            </div>
                        </Link>
                    ))}
                </div>
                <Separator className="my-3 bg-gray-200 dark:bg-white/10" />
                <div className="px-2">
                    {!isCollapsed && (
                        <p className="px-3 pb-2 text-xs font-semibold  tracking-wide text-gray-500 dark:text-muted-foreground">
                            Work Space
                        </p>
                    )}

                    <div className="space-y-1">
                        {workspaceItems.map((item) => (
                            <Link key={item.to} to={item.to}>
                                <div
                                    id={item.id}
                                    className={cn(
                                        "group flex h-9 items-center gap-3 rounded-md px-3 text-sm transition",
                                        isCollapsed ? "justify-center px-0" : "justify-start",
                                        isActive(item.to)
                                            ? "bg-gray-900/10  dark:bg-white/10 dark:text-slate-200 text-gray-700"
                                            : "hover:bg-gray-900/5 dark:hover:bg-white/5"
                                    )}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <item.icon
                                        size={16}
                                        className="transition-colors duration-200 group-hover:text-gray-900 dark:group-hover:text-white"
                                    />
                                    {!isCollapsed && <span className="text-xs font-medium">{item.label}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <Separator className="my-3 bg-gray-200 dark:bg-white/10" />
                <div className="px-2 pb-4">
                    <Link to="/settings">
                        <div
                            id="nav-settings"
                            className={cn(
                                "group flex h-9 items-center gap-3 rounded-md px-3 text-sm transition",
                                isCollapsed ? "justify-center px-0" : "justify-start",
                                "hover:bg-gray-900/5 dark:hover:bg-white/5"
                            )}
                        >
                            <Settings
                                size={18}
                                className="transition-colors duration-200 group-hover:text-gray-900 dark:group-hover:text-white"
                            />
                            {!isCollapsed && <span className="text-xs">Settings</span>}
                        </div>
                    </Link>
                </div>
            </ScrollArea>
        </div>
    );
};