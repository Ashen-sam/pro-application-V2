import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bolt, CalendarDays, Folders } from "lucide-react";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

export const ProjectInfo = () => {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const location = useLocation();
    const userId = parseInt(localStorage.getItem('userId') || '10');
    const [direction, setDirection] = useState(0);

    const tabs = ["overview", "tasks", "calendar"];

    // Determine active tab based on current route
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes("/tasks")) return "tasks";
        if (path.includes("/calendar")) return "calendar";
        return "overview";
    };

    const handleTabChange = (value: string) => {
        const currentIndex = tabs.indexOf(getActiveTab());
        const newIndex = tabs.indexOf(value);
        setDirection(newIndex > currentIndex ? 1 : -1);

        switch (value) {
            case "overview":
                navigate(`/projects/${projectId}`);
                break;
            case "tasks":
                navigate(`/projects/${projectId}/tasks`);
                break;
            case "calendar":
                navigate(`/projects/${projectId}/calendar`);
                break;
        }
    };

    return (
        <div className=" ">
            <div className="border-b">
                <div className="">
                    <Tabs value={getActiveTab()} onValueChange={handleTabChange}>
                        <TabsList className="h-auto p-0 bg-transparent border-0  gap-1">
                            <TabsTrigger
                                value="overview"
                                className="rounded-none  px-4 py-3 dark:data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent hover:text-primary transition-all duration-200 gap-2 border-0 shadow-none"
                            >
                                <Bolt className="" />
                                <span className="text-xs font-medium">Overview</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="tasks"
                                className="rounded-none dark:data-[state=active]:border-primary px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent hover:text-primary transition-all duration-200 gap-2 border-0 shadow-none"
                            >
                                <Folders className="" />
                                <span className="text-xs font-medium">Tasks</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="calendar"
                                className="rounded-none dark:data-[state=active]:border-primary px-4 py-3 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground data-[state=inactive]:border-b-2 data-[state=inactive]:border-transparent hover:text-primary transition-all duration-200 gap-2 border-0 shadow-none"
                            >
                                <CalendarDays className="" />
                                <span className="text-xs font-medium">Calendar</span>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>
            </div>

            <div className="mt-3 relative overflow-hidden">
                <div
                    key={location.pathname}
                    className="animate-in fade-in slide-in-from-right-4 duration-300"
                    style={{
                        animation: direction === 1
                            ? 'slideInFromRight 0.3s ease-out'
                            : 'slideInFromLeft 0.3s ease-out'
                    }}
                >
                    <Outlet context={{ userId, projectId: Number(projectId) }} />
                </div>
            </div>

            <style>{`
                @keyframes slideInFromRight {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideInFromLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
};