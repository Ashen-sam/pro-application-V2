import React, { type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface SectionToolbarProps {
    title: string;
    subtitle?: string;
    count?: number;
    icon?: React.ReactNode;
    primaryActionLabel?: string;
    primaryActionIcon?: React.ReactNode;
    onPrimaryAction?: () => void;
    primaryDisabled?: boolean;
    secondaryActionIcon?: React.ReactNode;
    onSecondaryAction?: () => void;
    secondaryDisabled?: boolean;
    children?: ReactNode
}

export const SectionToolbar: React.FC<SectionToolbarProps> = ({
    title,
    subtitle,
    count,
    icon,
    primaryActionLabel,
    primaryActionIcon,
    onPrimaryAction,
    primaryDisabled = false,
    secondaryActionIcon,
    onSecondaryAction,
    secondaryDisabled = false,
    children
}) => {
    return (
        <div className="relative w-full flex items-center justify-between px-4 py-3 rounded-lg border border-primary/20 bg-primary/6 overflow-hidden">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "radial-gradient(rgba(99,102,241,0.35) 1px, transparent 1px)",
                    backgroundSize: "10px 10px",
                    opacity: 0.45,
                    maskImage:
                        "linear-gradient(to right, black 0%, transparent 90%, transparent 60%, black 100%)",
                    WebkitMaskImage:
                        "linear-gradient(to right, black 0%, transparent 90%, transparent 60%, black 100%)"
                }}
            />

            {/* Content */}
            <div className="relative w-full flex items-center justify-between">
                {/* Left */}
                <div className="flex gap-3 items-start">
                    {icon && <div className="text-primary mt-0.5">{icon}</div>}

                    <div className="flex flex-col gap-1">
                        <div className="text-xs font-medium text-gray-700 dark:text-slate-200">
                            {title}
                            {typeof count === "number" && (
                                <span className="ml-1">({count})</span>
                            )}
                        </div>

                        {subtitle && (
                            <div className="text-xs font-medium text-gray-400">
                                {subtitle}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {primaryActionLabel && (
                        <Button
                            variant="outline"
                            className="gap-2 text-xs bg-transparent hover:bg-gray-800"
                            onClick={onPrimaryAction}
                            disabled={primaryDisabled}
                        >
                            {primaryActionIcon}
                            {primaryActionLabel}
                        </Button>
                    )}

                    {secondaryActionIcon && (
                        <Button
                            variant="outline"
                            className="gap-2 text-xs bg-transparent border-gray-700 text-white hover:bg-gray-800"
                            onClick={onSecondaryAction}
                            disabled={secondaryDisabled}
                        >
                            {secondaryActionIcon}
                        </Button>
                    )}
                    {children && (<div>{children}</div>)}
                </div>
            </div>
        </div>
    );
};
