// TaskTable.tsx
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { CalendarPlus, CirclePlus, Trash2, UserRoundPlus, X } from "lucide-react";
import * as React from "react";
import { ProjectStatusCommon, type StatusType } from "./ProjectStatusCommon";
import { ProjectPriorityCommon, type PriorityType } from "./projectPriorityCommon";

export interface Task {
    id: number;
    name: string;
    assignee?: string;
    status?: StatusType;
    dueDate?: string | null;
    priority?: PriorityType | "Medium";
}

interface TaskTableProps {
    title?: string;
    tasks: Task[];
    onTaskChange?: (taskId: number, field: keyof Task, value: string) => void;
    onTaskAdd?: () => void;
    onTaskDelete?: (taskId: number) => void;
    showNumbering?: boolean;
    columns?: {
        name?: boolean;
        assignee?: boolean;
        status?: boolean;
        dueDate?: boolean;
        priority?: boolean;
    };
}

interface TaskRowProps {
    task: Task;
    index: number;
    showNumbering: boolean;
    columns: Required<NonNullable<TaskTableProps['columns']>>;
    onTaskChange?: (taskId: number, field: keyof Task, value: string) => void;
    onTaskDelete?: (taskId: number) => void;
    isLastRow: boolean;
    newTaskRef: React.RefObject<HTMLInputElement | null>;
}

// Status Popover Component
const StatusPopover = React.memo<{
    value: StatusType;
    onChange: (value: string) => void;
}>(({ value, onChange }) => {
    const [open, setOpen] = React.useState(false);
    const statusOptions: StatusType[] = ["On track", "At risk", "Off track", "Completed"];

    const handleSelect = React.useCallback((status: StatusType) => {
        onChange(status);
        setOpen(false);
    }, [onChange]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="text-xs rounded-sm hover:bg-accent"
                >
                    <ProjectStatusCommon status={value} />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[150px] p-1 rounded-sm" align="start">
                <div className="flex flex-col">
                    {statusOptions.map((status) => (
                        <button
                            key={status}
                            className="flex border-b last:border-b-0 w-full items-center py-1 text-sm rounded-none hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer"
                            onClick={() => {
                                handleSelect(status);
                            }}
                        >
                            <ProjectStatusCommon status={status} />
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
});

StatusPopover.displayName = 'StatusPopover';

// Priority Popover Component
const PriorityPopover = React.memo<{
    value: PriorityType | "Medium";
    onChange: (value: string) => void;
}>(({ value, onChange }) => {
    const [open, setOpen] = React.useState(false);
    const priorityOptions: PriorityType[] = ["Low", "Medium", "High"];

    const handleSelect = React.useCallback((priority: PriorityType) => {
        onChange(priority);
        setOpen(false);
    }, [onChange]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    className="text-xs rounded-sm hover:bg-accent"
                >
                    <ProjectPriorityCommon priority={value} />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[140px] p-1" align="start">
                <div className="flex flex-col gap-1">
                    {priorityOptions.map((priority) => (
                        <button
                            key={priority}
                            className="flex border-b last:border-b-0 w-full items-center py-1 text-sm rounded-none hover:bg-accent hover:text-accent-foreground outline-none cursor-pointer"
                            onClick={() => handleSelect(priority)}
                        >
                            <ProjectPriorityCommon priority={priority} />
                        </button>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
});

PriorityPopover.displayName = 'PriorityPopover';

// Modified DatePopover Component with Date Range Selection
const DatePopover = React.memo<{
    value: string | null | undefined;
    onChange: (value: string) => void;
}>(({ value, onChange }) => {
    const [open, setOpen] = React.useState(false);

    // Parse the date range from value (format: "YYYY-MM-DD to YYYY-MM-DD")
    const parseValue = (val: string | null | undefined) => {
        if (!val) return { from: undefined, to: undefined };
        if (val.includes(' to ')) {
            const [start, end] = val.split(' to ');
            return {
                from: start ? new Date(start) : undefined,
                to: end ? new Date(end) : undefined
            };
        }
        return { from: new Date(val), to: undefined };
    };

    const [dateRange, setDateRange] = React.useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>(parseValue(value));

    const handleSelect = React.useCallback((range: { from: Date | undefined; to: Date | undefined } | undefined) => {
        if (!range) return;

        setDateRange(range);

        // Only close and save when both dates are selected
        if (range.from && range.to) {
            const fromStr = range.from.toISOString().split('T')[0];
            const toStr = range.to.toISOString().split('T')[0];
            onChange(`${fromStr} to ${toStr}`);
            setOpen(false);
        } else if (range.from && !range.to) {
            // First date selected, keep open for second selection
            setDateRange(range);
        }
    }, [onChange]);

    const handleClear = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setDateRange({ from: undefined, to: undefined });
        onChange('');
        setOpen(false);
    }, [onChange]);

    const formatDateRange = () => {
        if (dateRange.from && dateRange.to) {
            return `${dateRange.from.toLocaleDateString()} - ${dateRange.to.toLocaleDateString()}`;
        } else if (dateRange.from) {
            return `${dateRange.from.toLocaleDateString()} - ...`;
        }
        return 'Select date range';
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-2 text-sm hover:bg-accent px-2 py-1 rounded-sm w-full justify-start">
                    <CalendarPlus size={16} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                        {formatDateRange()}
                    </span>
                    {dateRange.from && (
                        <X
                            size={14}
                            className="ml-auto text-gray-400 hover:text-gray-600"
                            onClick={handleClear}
                        />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={handleSelect}
                    numberOfMonths={2}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
    );
});

DatePopover.displayName = 'DatePopover';

// Assignee Popover Component
const AssigneePopover = React.memo<{
    value: string | undefined;
    onChange: (value: string) => void;
}>(({ value, onChange }) => {
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value || '');

    // Sample assignees list - you can replace with your own data
    const assignees = ['John Doe', 'Jane Smith', 'Bob Johnson', 'Alice Williams', 'Charlie Brown'];

    React.useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const handleSelect = React.useCallback((assignee: string) => {
        setInputValue(assignee);
        onChange(assignee);
        setOpen(false);
    }, [onChange]);

    const handleInputChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange(newValue);
    }, [onChange]);

    const handleClear = React.useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setInputValue('');
        onChange('');
    }, [onChange]);

    const filteredAssignees = assignees.filter(assignee =>
        assignee.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button className="flex items-center gap-2 text-sm hover:bg-accent px-2 py-1 rounded-sm w-full justify-start">
                    <UserRoundPlus size={16} className="text-gray-400" />
                    <span className="text-gray-600 dark:text-gray-400 truncate">
                        {inputValue || 'Assign to'}
                    </span>
                    {inputValue && (
                        <X
                            size={14}
                            className="ml-auto text-gray-400 hover:text-gray-600"
                            onClick={handleClear}
                        />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-[220px] p-2" align="start">
                <div className="space-y-2">
                    <Input
                        placeholder="Search or add assignee..."
                        value={inputValue}
                        onChange={handleInputChange}
                        className="h-8"
                    />
                    {filteredAssignees.length > 0 && (
                        <div className="flex flex-col">
                            {filteredAssignees.map((assignee) => (
                                <button
                                    key={assignee}
                                    className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm text-left"
                                    onClick={() => handleSelect(assignee)}
                                >
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                                        {assignee.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    {assignee}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
});

AssigneePopover.displayName = 'AssigneePopover';

// Optimized Input Component with debouncing
const DebouncedInput = React.memo<{
    defaultValue: string | undefined;
    placeholder: string;
    type?: string;
    onChange: (value: string) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
    className?: string;
}>(({ defaultValue, placeholder, type = "text", onChange, inputRef, className }) => {
    const [value, setValue] = React.useState(defaultValue || "");
    const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

    React.useEffect(() => {
        setValue(defaultValue || "");
    }, [defaultValue]);

    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValue(newValue);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        const delay = type === "date" ? 0 : 300;
        timeoutRef.current = setTimeout(() => {
            onChange(newValue);
        }, delay);
    }, [onChange, type]);

    React.useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
        <Input
            ref={inputRef}
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={handleChange}
            className={className}
        />
    );
});

DebouncedInput.displayName = 'DebouncedInput';

// Memoized task row component
const TaskRow = React.memo<TaskRowProps>(({
    task,
    index,
    showNumbering,
    columns,
    onTaskChange,
    onTaskDelete,
    isLastRow,
    newTaskRef
}) => {
    const handleInputChange = React.useCallback((field: keyof Task) => (value: string) => {
        onTaskChange?.(task.id, field, value);
    }, [task.id, onTaskChange]);

    const handleDelete = React.useCallback(() => {
        onTaskDelete?.(task.id);
    }, [task.id, onTaskDelete]);

    return (
        <TableRow className="dark:hover:bg-zinc-900 cursor-pointer hover:bg-zinc-100 dark:bg-[#191919]">
            {showNumbering && (
                <TableCell className="text-center text-gray-400">
                    {index + 1}
                </TableCell>
            )}
            {columns.name && (
                <TableCell>
                    <DebouncedInput
                        inputRef={isLastRow ? newTaskRef : undefined}
                        defaultValue={task.name}
                        placeholder="Enter task name..."
                        onChange={handleInputChange('name')}
                        className="border-0 shadow-none focus-visible:ring-1"
                    />
                </TableCell>
            )}
            {columns.assignee && (
                <TableCell>
                    <AssigneePopover
                        value={task.assignee}
                        onChange={handleInputChange('assignee')}
                    />
                </TableCell>
            )}
            {columns.status && (
                <TableCell>
                    <StatusPopover
                        value={task.status ?? "At risk"}
                        onChange={handleInputChange('status')}
                    />
                </TableCell>
            )}
            {columns.dueDate && (
                <TableCell>
                    <DatePopover
                        value={task.dueDate}
                        onChange={handleInputChange('dueDate')}
                    />
                </TableCell>
            )}
            {columns.priority && (
                <TableCell>
                    <PriorityPopover
                        value={task.priority ?? "Medium"}
                        onChange={handleInputChange('priority')}
                    />
                </TableCell>
            )}
            <TableCell className="text-center">
                <button
                    onClick={handleDelete}
                    className="text-gray-400 hover:text-red-400"
                >
                    <Trash2 size={16} />
                </button>
            </TableCell>
        </TableRow>
    );
});

TaskRow.displayName = 'TaskRow';

export const TaskTable: React.FC<TaskTableProps> = ({
    tasks,
    onTaskChange,
    onTaskAdd,
    onTaskDelete,
    showNumbering = true,
    columns = {
        name: true,
        assignee: true,
        status: true,
        dueDate: true,
        priority: true,
    },
}) => {
    const newTaskRef = React.useRef<HTMLInputElement>(null);

    const normalizedColumns = React.useMemo<Required<NonNullable<TaskTableProps['columns']>>>(() => ({
        name: columns.name ?? true,
        assignee: columns.assignee ?? true,
        status: columns.status ?? true,
        dueDate: columns.dueDate ?? true,
        priority: columns.priority ?? true,
    }), [columns]);

    const handleAddTask = React.useCallback(() => {
        onTaskAdd?.();
        requestAnimationFrame(() => {
            newTaskRef.current?.focus();
        });
    }, [onTaskAdd]);

    const columnCount = React.useMemo(() =>
        (showNumbering ? 1 : 0) +
        (normalizedColumns.name ? 1 : 0) +
        (normalizedColumns.assignee ? 1 : 0) +
        (normalizedColumns.status ? 1 : 0) +
        (normalizedColumns.dueDate ? 1 : 0) +
        (normalizedColumns.priority ? 1 : 0) +
        1,
        [showNumbering, normalizedColumns]
    );

    return (
        <div className="w-full mx-auto">
            <div className="border rounded-sm overflow-hidden">
                <Table className="overflow-hidden">
                    <TableHeader>
                        <TableRow>
                            {showNumbering && <TableHead className="w-10"></TableHead>}
                            {normalizedColumns.name && (
                                <TableHead className="w-[35%]">
                                    <div className="flex items-center gap-2">
                                        Task
                                    </div>
                                </TableHead>
                            )}
                            {normalizedColumns.assignee && (
                                <TableHead className="w-[20%]">
                                    <div className="flex items-center gap-2">
                                        Assignee
                                    </div>
                                </TableHead>
                            )}
                            {normalizedColumns.status && (
                                <TableHead className="w-[15%]">
                                    <div className="flex items-center gap-2">
                                        Status
                                    </div>
                                </TableHead>
                            )}
                            {normalizedColumns.dueDate && (
                                <TableHead className="w-[12%]">
                                    <div className="flex items-center gap-2">
                                        Due date
                                    </div>
                                </TableHead>
                            )}
                            {normalizedColumns.priority && (
                                <TableHead className="w-[10%]">
                                    <div className="flex items-center gap-2">
                                        Priority
                                    </div>
                                </TableHead>
                            )}
                            <TableHead className="w-[60px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {tasks.map((task, index) => (
                            <TaskRow
                                key={task.id}
                                task={task}
                                index={index}
                                showNumbering={showNumbering}
                                columns={normalizedColumns}
                                onTaskChange={onTaskChange}
                                onTaskDelete={onTaskDelete}
                                isLastRow={index === tasks.length - 1}
                                newTaskRef={newTaskRef}
                            />
                        ))}

                        <TableRow className="dark:hover:bg-zinc-900 hover:bg-zinc-100 border-none dark:bg-[#202020]">
                            <TableCell colSpan={columnCount} className=" ">
                                <button
                                    onClick={handleAddTask}
                                    className="w-full bg-transparent!  border-0 justify-start text-gray-400 hover:text-gray-600 rounded-none "
                                >
                                    <CirclePlus size={20} />
                                </button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};