import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { Link, useLocation } from "react-router";

interface BreadcrumbCommonProps {
    customLabels?: Record<string, string>;
    separator?: React.ReactNode;
    hideHome?: boolean;
    homeLabel?: string;
    className?: string;
}

const defaultBreadcrumbLabels: Record<string, string> = {
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

export const BreadcrumbCommon = ({
    customLabels = {},
    separator,
    hideHome = false,
    homeLabel = "Home",
    className = "",
}: BreadcrumbCommonProps) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);
    const breadcrumbLabels = { ...defaultBreadcrumbLabels, ...customLabels };
    const defaultSeparator = <ChevronRight size={14} className="text-gray-400" />;
    return (
        <Breadcrumb className={className}>
            <BreadcrumbList className="flex items-center">
                {!hideHome && (
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link
                                to="/"
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            >
                                {homeLabel}
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                )}

                {pathnames.map((pathname, index) => {
                    const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathnames.length - 1;
                    const label = breadcrumbLabels[routeTo] || pathname;

                    return (
                        <Fragment key={routeTo}>
                            <BreadcrumbSeparator>
                                {separator || defaultSeparator}
                            </BreadcrumbSeparator>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="text-sm font-medium text-gray-900 dark:text-white">
                                        {label}
                                    </BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            to={routeTo}
                                            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                        >
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
    );
};