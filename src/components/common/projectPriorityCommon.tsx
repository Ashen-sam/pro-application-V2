import { ArrowBigDown, ArrowBigRight, ArrowBigUp } from 'lucide-react';
import React from 'react';

export type PriorityType = 'Low' | 'Medium' | 'High' | 'Critical';

export interface PriorityBadgeProps {
    priority: PriorityType;
    className?: string;
    padding?: boolean;
}

export const ProjectPriorityCommon: React.FC<PriorityBadgeProps> = ({
    priority,
    padding = true,
}) => {
    const priorityConfig = {
        Low: {
            text: 'text-blue-400',
            iconBg: 'bg-blue-500/20',
            icon: ArrowBigDown,
        },
        Medium: {
            text: 'text-yellow-400',
            iconBg: 'bg-yellow-500/20',
            icon: ArrowBigRight,
        },
        High: {
            text: 'text-red-400',
            iconBg: 'bg-red-500/20',
            icon: ArrowBigUp,
        },
        Critical: {
            text: 'text-purple-400',
            iconBg: 'bg-purple-500/20',
            icon: ArrowBigUp,
        },
    };

    const config = priorityConfig[priority];
    const Icon = config.icon;

    return (
        <span
            className={`
        inline-flex items-center gap-2
        ${padding ? ' py-1' : 'py-1'}
        text-xs 
        
      `}
        >
            <span
                className={`
          flex items-center justify-center
          w-5 h-5 rounded-full
 ${config.text}
        `}
            >
                <Icon size={16} />
            </span>

            {priority}
        </span>
    );
};
