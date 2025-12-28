import { Bolt, CalendarDays, Folders } from "lucide-react";
import { useState, useRef } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

export const ProjectInfo = () => {
    const navigate = useNavigate();
    const { projectId } = useParams<{ projectId: string }>();
    const location = useLocation();
    const userId = parseInt(localStorage.getItem('userId') || '10');
    const [direction, setDirection] = useState<number>(0);
    const [hoverStyle, setHoverStyle] = useState<{
        opacity?: number;
        left?: number;
        width?: number;
    }>({});
    const tabsListRef = useRef<HTMLDivElement>(null);

    const tabs = ["overview", "tasks", "calendar"] as const;
    type TabValue = typeof tabs[number];

    // Determine active tab based on current route
    const getActiveTab = (): TabValue => {
        const path = location.pathname;
        if (path.includes("/tasks")) return "tasks";
        if (path.includes("/calendar")) return "calendar";
        return "overview";
    };

    const handleTabChange = (value: TabValue) => {
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

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
        const button = e.currentTarget;
        const tabsList = tabsListRef.current;

        if (tabsList) {
            const tabsListRect = tabsList.getBoundingClientRect();
            const buttonRect = button.getBoundingClientRect();

            setHoverStyle({
                opacity: 1,
                left: buttonRect.left - tabsListRect.left,
                width: buttonRect.width,
            });
        }
    };

    const handleMouseLeave = () => {
        setHoverStyle({ opacity: 0 });
    };

    const tabsConfig: Array<{ value: TabValue; icon: typeof Bolt; label: string }> = [
        { value: "overview", icon: Bolt, label: "Overview" },
        { value: "tasks", icon: Folders, label: "Tasks" },
        { value: "calendar", icon: CalendarDays, label: "Calendar" }
    ];

    return (
        <div className="">
            <div className="border-b">
                <div className="">
                    <div
                        ref={tabsListRef}
                        className="h-auto p-0 bg-transparent border-0 gap-1 relative inline-flex"
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Vercel-style hover indicator */}
                        <div
                            className="absolute bottom-0 h-full bg-muted/50 rounded-t-sm transition-all duration-200 ease-out pointer-events-none"
                            style={{
                                opacity: hoverStyle.opacity || 0,
                                left: `${hoverStyle.left || 0}px`,
                                width: `${hoverStyle.width || 0}px`,
                                zIndex: 0,
                            }}
                        />

                        {tabsConfig.map(({ value, icon: Icon, label }) => (
                            <button
                                key={value}
                                onClick={() => handleTabChange(value)}
                                onMouseEnter={handleMouseEnter}
                                className={`
                                    rounded-none px-4 py-3 
                                    ${getActiveTab() === value
                                        ? 'bg-transparent border-b-2 border-primary dark:border-primary'
                                        : 'bg-transparent text-muted-foreground border-b-2 border-transparent'
                                    }
                                    transition-all duration-200 
                                    gap-2 border-0 shadow-none relative z-10
                                    flex items-center
                                `}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="text-xs font-medium">{label}</span>
                            </button>
                        ))}
                    </div>
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
                    <Outlet context={{ userId, projectId }} />
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