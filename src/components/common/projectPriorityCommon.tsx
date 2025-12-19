import { ArrowDown, ArrowUp, Minus } from 'lucide-react';
import React from 'react';

export type PriorityType = 'Low' | 'Medium' | 'High' | 'Critical';

export interface PriorityBadgeProps {
    priority: PriorityType;
    className?: string;
    padding?: boolean;
}

export const ProjectPriorityCommon: React.FC<PriorityBadgeProps> = ({
    priority,
    className = '',
    padding = true,
}) => {
    const priorityConfig = {
        Low: {
            text: 'text-blue-400',
            iconBg: 'bg-blue-500/20',
            icon: ArrowDown,
        },
        Medium: {
            text: 'text-yellow-400',
            iconBg: 'bg-yellow-500/20',
            icon: Minus,
        },
        High: {
            text: 'text-red-400',
            iconBg: 'bg-red-500/20',
            icon: ArrowUp,
        },
    };

    const config = priorityConfig[priority];
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
                <Icon size={12} className={config.text} />
            </span>

            {priority}
        </span>
    );
};
