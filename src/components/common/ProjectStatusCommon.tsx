import { ActivityIcon, CircleCheck, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';

export type StatusType = 'On track' | 'Off track' | 'At risk' | "Completed";

interface StatusBadgeProps {
    status: StatusType;
    className?: string;
    size?: boolean;
    padding?: boolean;
}

export const ProjectStatusCommon: React.FC<StatusBadgeProps> = ({
    status,
    className = '',
    padding = true,
}) => {
    const statusConfig = {
        'On track': {
            text: 'text-blue-400',
            iconBg: 'bg-blue-500/20',
            icon: TrendingUp,
        },
        'Off track': {
            text: 'text-yellow-400',
            iconBg: 'bg-yellow-500/20',
            icon: TrendingDown,
        },
        'At risk': {

            text: 'text-red-400',
            iconBg: 'bg-red-500/20',
            icon: ActivityIcon,
        },
        'Completed': {
            text: 'text-green-400',
            iconBg: 'bg-green-500/20',
            icon: CircleCheck,
        },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <span
            className={`
        inline-flex items-center gap-2
            ${padding ? 'px-3 py-1' : 'py-1'}
        text-xs font-semibold   
        rounded-full
        ${config.text}

        ${className}
      `}
        >
            <span
                className={`
          flex items-center justify-center
          w-5 h-5 rounded-full
          ${config.iconBg}
          border border-${config.iconBg}

        `}
            >
                <Icon strokeWidth={3} size={10} className={config.text} />
            </span>

            {status}
        </span>
    );
};
