import { BadgeCheckIcon, CircleDashed, Hexagon } from 'lucide-react';
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
            icon: Hexagon,
        },
        'Off track': {
            text: 'text-yellow-400',
            iconBg: 'bg-yellow-500/20',
            icon: CircleDashed,
        },
        'At risk': {

            text: 'text-red-400',
            iconBg: 'bg-red-500/20',
            icon: Hexagon,
        },
        'Completed': {
            text: 'text-green-400',
            iconBg: 'bg-green-500/20',
            icon: BadgeCheckIcon,
        },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <span
            className={`
        inline-flex items-center gap-2
            ${padding ? ' py-[3px]' : 'py-1'}
        text-xs    
        rounded-sm
     

        ${className}
      `}
        >
            <span
                className={`
          flex items-center justify-center
          w-5 h-5 rounded-full
        ${config.text}

        `}
            >
                <Icon strokeWidth={3} size={13} />
            </span>

            {status}
        </span>
    );
};
