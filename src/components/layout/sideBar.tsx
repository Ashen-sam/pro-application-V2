import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    FolderArchive,
    Inbox,
    Package,
    Settings,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "../common/mode-toggle";
import type { SidebarProps } from "./types";

const topNavItems = [
    { to: "/home", icon: Inbox, label: "Overview" },
];

const workspaceItems = [
    { to: "/projects", icon: Package, label: "Projects" },
    { to: "/calendar", icon: Calendar, label: "Calendar" },
    { to: "/project-flow", icon: FolderArchive, label: "Flow" },
];

export const Sidebar = ({ className }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <div
            className={cn(
                "relative flex flex-col bg-transparent dark:bg-transparent  transition-all duration-300 ",
                " text-muted-foreground",
                isCollapsed ? "w-[64px]" : "w-[300px]",
                className
            )}
        >
            {/* Collapse Button */}
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

            {/* User Header */}
            {!isCollapsed && (
                <div className="px-4 py-4">
                    <p className="text-sm font-semibold text-white">
                        Ashen Samarasekera
                    </p>
                    <p className="text-xs text-muted-foreground">
                        Free Plan · iamashen27@gmail.com
                    </p>
                </div>
            )}

            <Separator className="bg-white/10" />

            {/* Mode Toggle */}
            <div className={cn("px-3 py-3", isCollapsed && "flex justify-center")}>
                <ModeToggle />
            </div>

            <ScrollArea className="flex-1">
                {/* Top Nav */}
                <div className="px-2 py-2 space-y-1">
                    {topNavItems.map((item) => (
                        <Link key={item.to} to={item.to}>
                            <div
                                className={cn(
                                    "group flex h-9 items-center gap-3 rounded-md px-3 text-sm transition",
                                    isCollapsed ? "justify-center px-0" : "justify-start",
                                    isActive(item.to)
                                        ? "bg-white/10 text-white"
                                        : "hover:bg-white/5"
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon
                                    size={16}
                                    className="transition-colors duration-200 group-hover:text-white"
                                />
                                {!isCollapsed && <span className="text-xs font-medium">{item.label}</span>}
                            </div>
                        </Link>
                    ))}
                </div>

                <Separator className="my-3 bg-white/10" />

                {/* Workspace */}
                <div className="px-2">
                    {!isCollapsed && (
                        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Work Space
                        </p>
                    )}

                    <div className="space-y-1">
                        {workspaceItems.map((item) => (
                            <Link key={item.to} to={item.to}>
                                <div
                                    className={cn(
                                        "group flex h-9 items-center gap-3 rounded-md px-3 text-sm transition",
                                        isCollapsed ? "justify-center px-0" : "justify-start",
                                        isActive(item.to)
                                            ? "bg-white/10 text-white"
                                            : "hover:bg-white/5"
                                    )}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <item.icon
                                        size={16}
                                        className="transition-colors duration-200 group-hover:text-white"
                                    />
                                    {!isCollapsed && <span className="text-xs font-medium">{item.label}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <Separator className="my-3 bg-white/10" />

                {/* Settings */}
                <div className="px-2 pb-4">
                    <Link to="/settings">
                        <div
                            className={cn(
                                "group flex h-9 items-center gap-3 rounded-md px-3 text-sm transition",
                                isCollapsed ? "justify-center px-0" : "justify-start",
                                "hover:bg-white/5"
                            )}
                        >
                            <Settings
                                size={18}
                                className="transition-colors duration-200 group-hover:text-white"
                            />
                            {!isCollapsed && <span>Settings</span>}
                        </div>
                    </Link>
                </div>
            </ScrollArea>
        </div>
    );
};