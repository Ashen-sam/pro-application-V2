import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash } from "lucide-react";
import { ProjectStatusCommon, type StatusType } from "./ProjectStatusCommon";
import { ProjectPriorityCommon, type PriorityType } from "./projectPriorityCommon";

export interface Task {
    id: number;
    name: string;
    assignee?: string;
    status?: StatusType;
    dueDate?: string;
    priority?: PriorityType;
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
    const newTaskRef = React.useRef<HTMLInputElement | null>(null);

    const handleAddTask = () => {
        onTaskAdd?.();
        setTimeout(() => {
            newTaskRef.current?.focus();
        }, 50);
    };

    const columnCount =
        (showNumbering ? 1 : 0) +
        (columns.name ? 1 : 0) +
        (columns.assignee ? 1 : 0) +
        (columns.status ? 1 : 0) +
        (columns.dueDate ? 1 : 0) +
        (columns.priority ? 1 : 0) +
        1;

    const statusOptions: StatusType[] = ["Expired", "In review", "In progress", "Submitted", "Success"];
    const priorityOptions: PriorityType[] = ["Low", "Medium", "High", "Critical"];

    return (
        <div className="w-full mx-auto">
            <div className="border rounded-sm overflow-hidden">
                <Table className="overflow-hidden [&>thead>tr>th]:border [&>thead>tr>th]:border-border [&>tbody>tr>td]:border [&>tbody>tr>td]:border-border">
                    <TableHeader>
                        <TableRow>
                            {showNumbering && <TableHead className="w-10"></TableHead>}
                            {columns.name && (
                                <TableHead className="w-[35%]">Name</TableHead>
                            )}
                            {columns.assignee && (
                                <TableHead className="w-[20%]">Assignee</TableHead>
                            )}
                            {columns.status && (
                                <TableHead className="w-[15%]">Status</TableHead>
                            )}
                            {columns.dueDate && (
                                <TableHead className="w-[12%]">Due date</TableHead>
                            )}
                            {columns.priority && (
                                <TableHead className="w-[10%]">Priority</TableHead>
                            )}
                            <TableHead className="w-[60px] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {tasks.map((task, index) => (
                            <TableRow key={task.id} className="hover:bg-zinc-800">
                                {showNumbering && (
                                    <TableCell className="text-center text-gray-400">
                                        {index + 1}
                                    </TableCell>
                                )}
                                {columns.name && (
                                    <TableCell>
                                        <Input
                                            ref={
                                                index === tasks.length - 1
                                                    ? newTaskRef
                                                    : undefined
                                            }
                                            value={task.name}
                                            placeholder="Enter task name..."
                                            onChange={(e) =>
                                                onTaskChange?.(task.id, "name", e.target.value)
                                            }
                                            className="border-0 shadow-none focus-visible:ring-1"
                                        />
                                    </TableCell>
                                )}
                                {columns.assignee && (
                                    <TableCell>
                                        <Input
                                            value={task.assignee}
                                            placeholder="Assignee"
                                            onChange={(e) =>
                                                onTaskChange?.(task.id, "assignee", e.target.value)
                                            }
                                            className="border-0 shadow-none focus-visible:ring-1"
                                        />
                                    </TableCell>
                                )}
                                {columns.status && (
                                    <TableCell>
                                        <Select
                                            value={task.status}
                                            onValueChange={(value) =>
                                                onTaskChange?.(task.id, "status", value)
                                            }
                                        >
                                            <SelectTrigger className="border-0 shadow-none focus:ring-1">
                                                <SelectValue>
                                                    <ProjectStatusCommon
                                                        status={task.status ?? "Expired"}
                                                    />
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        <ProjectStatusCommon status={status} />
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                )}
                                {columns.dueDate && (
                                    <TableCell>
                                        <Input
                                            type="date"
                                            value={task.dueDate}
                                            placeholder="Due date"
                                            onChange={(e) =>
                                                onTaskChange?.(task.id, "dueDate", e.target.value)
                                            }
                                            className="border-0 shadow-none focus-visible:ring-1 text-sm"
                                        />
                                    </TableCell>
                                )}
                                {columns.priority && (
                                    <TableCell>
                                        <Select
                                            value={task.priority}
                                            onValueChange={(value) =>
                                                onTaskChange?.(task.id, "priority", value)
                                            }
                                        >
                                            <SelectTrigger className="border-0 shadow-none focus:ring-1">
                                                <SelectValue>
                                                    <ProjectPriorityCommon
                                                        priority={task.priority ?? "Medium"}
                                                    />
                                                </SelectValue>
                                            </SelectTrigger>
                                            <SelectContent>
                                                {priorityOptions.map((priority) => (
                                                    <SelectItem key={priority} value={priority}>
                                                        <ProjectPriorityCommon priority={priority} />
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                )}
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onTaskDelete?.(task.id)}
                                        className="h-8 w-8 text-gray-400 hover:text-red-600"
                                    >
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}

                        {/* Add New Row Button */}
                        <TableRow className="hover:bg-zinc-800">
                            <TableCell colSpan={columnCount} className="p-0">
                                <Button
                                    onClick={handleAddTask}
                                    variant="ghost"
                                    className="w-full justify-start text-gray-400 hover:text-gray-600 rounded-none h-12"
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add task
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}