import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Sidebar } from "../layout";
import { Header } from "./Header";

// Define breadcrumb labels for your routes
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

    // Generate breadcrumb items from current path
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
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white text-xs font-semibold shrink-0">
                                    AS
                                </div>
                            </div>

                        </div>
                    </div>
                    <Header />
                    <main className=" overflow-auto max-w-6xl m-auto  w-full dark:bg-[#191919]   h-full ">
                        <div className="py-10 px-6 overflow-auto ">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};