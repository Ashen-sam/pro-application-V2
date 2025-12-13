import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    FolderArchive,
    Inbox,
    Package,
    Settings
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "../common/mode-toggle";
import type { SidebarProps } from "./types";

const topNavItems = [
    { to: "/", icon: Inbox, label: "Home" },
    // { to: "/tasks", icon: CheckSquare, label: "My Tasks" }
];

const workspaceItems = [
    { to: "/projects", icon: Package, label: "Projects" },
    { to: "/calendar", icon: Calendar, label: "Calendar" },
    // { to: "/todo", icon: ListTodo, label: "Todo" },
    // { to: "/goals", icon: Target, label: "Goals" },
    { to: '/project-flow', icon: FolderArchive, label: 'Flow' }
];

export const Sidebar = ({ className }: SidebarProps) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <div
            className={cn(
                "flex flex-col border-r transition-all duration-300 ease-in-out bg-[#fcfcfc] dark:bg-[#282828]  relative",
                isCollapsed ? "w-[60px]" : "w-[180px]",
                className
            )}
        >
            {/* Collapse/Expand Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="absolute -right-3 top-6 z-10 h-6 w-6 rounded-full border bg-background shadow-md hover:bg-accent"
            >
                {isCollapsed ? (
                    <ChevronRight className="h-3 w-3" />
                ) : (
                    <ChevronLeft className="h-3 w-3" />
                )}
            </Button>

            {/* User Header */}


            {/* Mode Toggle */}
            <div className={cn(
                "px-2 py-2 transition-all duration-300",
                isCollapsed && "flex justify-center"
            )}>
                <ModeToggle />
            </div>

            <ScrollArea className="flex-1">
                <div className="px-2 py-2 space-y-0.5">
                    {topNavItems.map((item) => (
                        <Link key={item.to} to={item.to} >
                            <div
                                // variant="ghost"
                                // size="sm"
                                className={cn(
                                    "w-full flex rounded-sm items-center  gap-2 h-8 px-2 text-[13px] my-1 transition-all font-medium duration-300 shadow-none border-none outline-none ring-0 focus:ring-0 focus:outline-none",
                                    isCollapsed ? "justify-center px-0" : "justify-start",
                                    isActive(item.to)
                                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                                        : "hover:bg-primary/5 "
                                )}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <item.icon size={18} className="shrink-0" />
                                {!isCollapsed && <span className="truncate">{item.label}</span>}
                            </div>
                        </Link>
                    ))}
                </div>

                <Separator className="my-2" />

                {/* Workspace Section */}
                <div className="px-2 py-2">
                    {!isCollapsed && (
                        <div className="flex items-center gap-1 px-2 py-1">
                            <span className="text-xs font-semibold  text-primary">Work Space</span>
                        </div>
                    )}
                    <div className="mt-1 space-y-0.5">
                        {workspaceItems.map((item) => (
                            <Link key={item.to} to={item.to}>
                                <div

                                    className={cn(
                                        "w-full rounded-sm flex items-center gap-2 my-1 h-8 px-2 text-[13px]  transition-all duration-300 font-medium ",
                                        isCollapsed ? "justify-center px-0" : "justify-start",
                                        isActive(item.to)
                                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                                            : "hover:bg-primary/5 "
                                    )}
                                    title={isCollapsed ? item.label : undefined}
                                >
                                    <item.icon size={18} className=" shrink-0" />
                                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                <Separator className="my-2" />

                {/* Settings */}
                <div className="px-2 py-2">
                    <Link to={'/settings'}>
                        <div
                            className={cn(
                                "w-full flex items-center gap-2 h-8 px-2 text-sm font-normal transition-all duration-300",
                                isCollapsed ? "justify-center px-0" : "justify-start",
                                "hover:bg-primary/5 hover:text-primary"
                            )}
                            title={isCollapsed ? "Settings" : undefined}
                        >
                            <Settings size={18} className="shrink-0" />
                            {!isCollapsed && <span className="truncate">Settings</span>}
                        </div></Link>
                </div>
            </ScrollArea >
        </div >
    );
};