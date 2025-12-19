import {
    Loader
} from "lucide-react";
import { useEffect, useState } from "react";

interface ProgressProps {
    value: number;
    showLabel?: boolean;
    className?: string;
}

export const CircularProgress = ({
    value,
    showLabel = true,
    className = "",
}: ProgressProps) => {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedValue(value);
        }, 1);
        return () => clearTimeout(timer);
    }, [value]);

    const getConfig = (val: number) => {
        if (val >= 75)
            return {
                icon: Loader,
                text: "text-emerald-400",
                iconBg: "bg-emerald-500/20",
            };
        if (val >= 50)
            return {
                icon: Loader,
                text: "text-blue-400",
                iconBg: "bg-blue-500/20",
            };
        if (val >= 25)
            return {
                icon: Loader,
                text: "text-amber-400",
                iconBg: "bg-amber-500/20",
            };
        return {
            icon: Loader,
            text: "text-rose-400",
            iconBg: "bg-rose-500/20",
        };
    };

    const config = getConfig(animatedValue);
    const Icon = config.icon;

    return (
        <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full  ${className}`}
        >
            <span
                className={`flex items-center justify-center w-5 h-5 rounded-full ${config.iconBg} border border-${config.iconBg}`}
            >
                <Icon size={12} className={config.text} />
            </span>

            {showLabel && (
                <span
                    className={`text-xs font-medium tabular-nums ${config.text}`}
                >
                    {Math.round(animatedValue)}%
                </span>
            )}
        </div>
    );
};
