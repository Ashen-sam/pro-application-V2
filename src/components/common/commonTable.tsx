import type { PriorityType, StatusType } from "@/components";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuSub,
    ContextMenuSubContent,
    ContextMenuSubTrigger,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useTableSearch, useTableSort } from "@/hooks";
import { ActivityIcon, ArrowDown, ArrowUp, BarChart2, CheckCheck, CircleArrowOutUpRight, CircleCheck, CirclePlus, Hexagon, Minus, SquarePen, Trash, TrendingDown, TrendingUp, Users, type LucideIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { TableHeaderRow } from "./tableHeader";
import { TableSearch } from "./tableSearch";
import type { CommonTableProps } from "./tableTypes";
import { cn } from "@/lib/utils";

export function CommonTable<T extends Record<string, unknown>>({
    data,
    columns,
    searchable = false,
    searchPlaceholder = "Search...",
    emptyMessage = "No data available",
    className,
    selectable = false,
    onSelectionChange,
    rowKey = "id" as keyof T,
    onUpdateProject,
    onDeleteRow,
    onViewRow,
    onAddDescription,
    onEditTitle,
}: CommonTableProps<T>) {
    const { searchTerm, setSearchTerm, filterData } = useTableSearch<T>();
    const { sortConfig, handleSort, sortData } = useTableSort<T>();

    const [selectedRows, setSelectedRows] = useState<Set<unknown>>(new Set());
    const [hoveredRow, setHoveredRow] = useState<unknown | null>(null);

    // Popover states with row tracking
    const [statusPopover, setStatusPopover] = useState<{ open: boolean; rowId: unknown | null }>({ open: false, rowId: null });
    const [priorityPopover, setPriorityPopover] = useState<{ open: boolean; rowId: unknown | null }>({ open: false, rowId: null });
    const [membersPopover, setMembersPopover] = useState<{ open: boolean; rowId: unknown | null }>({ open: false, rowId: null });
    const [datePopover, setDatePopover] = useState<{ open: boolean; rowId: unknown | null }>({ open: false, rowId: null });

    const [emailInput, setEmailInput] = useState("");

    const filteredData = searchable ? filterData(data, columns) : data;
    const sortedData = sortData(filteredData, columns);

    const EMAIL_DOMAINS = [
        "gmail.com",
        "yahoo.com",
        "outlook.com",
        "icloud.com",
        "proton.me",
        "yopmail.com",
    ];
    const statusIcons: Record<
        string,
        { icon: LucideIcon; color: string }
    > = {
        "On track": { icon: TrendingUp, color: "text-blue-400" },
        "Off track": { icon: TrendingDown, color: "text-yellow-400" },
        "At risk": { icon: ActivityIcon, color: "text-red-400" },
        "Completed": { icon: CircleCheck, color: "text-green-400" },
    };

    // Priority options with icons only
    const priorityIcons: Record<
        string,
        { icon: LucideIcon; color: string }
    > = {
        "Low": { icon: ArrowDown, color: "text-blue-500" },
        "Medium": { icon: Minus, color: "text-yellow-500" },
        "High": { icon: ArrowUp, color: "text-red-400" },
    };
    const getEmailSuggestions = (value: string): string[] => {
        if (!value.includes("@")) return [];
        const [local, domain = ""] = value.split("@");
        return EMAIL_DOMAINS.filter(d => d.startsWith(domain)).map(d => `${local}@${d}`);
    };

    const emailSuggestions = getEmailSuggestions(emailInput);

    useEffect(() => {
        setSelectedRows(new Set());
    }, [data]);

    useEffect(() => {
        if (onSelectionChange) {
            const selected = sortedData.filter((row) =>
                selectedRows.has(row[rowKey])
            );
            onSelectionChange(selected);
        }
    }, [selectedRows, sortedData, onSelectionChange, rowKey]);

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedRows(new Set(sortedData.map((r) => r[rowKey])));
        } else {
            setSelectedRows(new Set());
        }
    };

    const handleSelectRow = (rowId: unknown, checked: boolean) => {
        const next = new Set(selectedRows);
        if (checked) {
            next.add(rowId);
        } else {
            next.delete(rowId);
        }
        setSelectedRows(next);
    };

    const handleUpdateField = async (row: T, field: string, value: unknown) => {
        if (!onUpdateProject) return;

        const updatedRow = { ...row, [field]: value };
        await onUpdateProject(updatedRow);
    };

    const isAllSelected =
        sortedData.length > 0 &&
        sortedData.every((row) => selectedRows.has(row[rowKey]));

    const isSomeSelected =
        sortedData.some((row) => selectedRows.has(row[rowKey])) &&
        !isAllSelected;

    const statusOptions: StatusType[] = ["On track", "At risk", "Off track", "Completed"];
    const priorityOptions: PriorityType[] = ["Low", "Medium", "High"];

    // Get column width based on key
    const getColumnWidth = (key: string) => {
        switch (key) {
            case "name":
                return "min-w-[400px] w-[80%]";
            case "status":
                return "min-w-[140px] w-[140px]";
            case "priority":
                return "min-w-[120px] w-[120px]";
            case "progress":
                return "min-w-[100px] w-[100px]";
            case "dueDate":
                return "min-w-[130px] w-[130px]";
            case "members":
                return "min-w-[150px] w-[150px]";
            default:
                return "min-w-[120px]";
        }
    };

    return (
        <div className={`w-full space-y-4 ${className || ""}`}>
            {searchable && (
                <TableSearch
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder={searchPlaceholder}
                />
            )}

            <div className="w-full overflow-hidden ">
                <div className="overflow-x-auto  border rounded-sm  ">
                    <Table className="table-fixed" >
                        <TableHeader className="" >
                            <TableRow className="" >
                                {selectable && (
                                    <TableCell className="w-12 min-w-12 ">
                                        <Checkbox
                                            checked={isAllSelected}
                                            onCheckedChange={handleSelectAll}
                                            aria-label="Select all"
                                            className={cn(
                                                "h-3.5 w-3.5 ",
                                                isSomeSelected && "data-[state=checked]:bg-primary"
                                            )}
                                        />

                                    </TableCell>
                                )}
                                <TableHeaderRow
                                    columns={columns}
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                    hasActions={false}
                                />
                            </TableRow>
                        </TableHeader>

                        <TableBody className="text-xs ">
                            {sortedData.length === 0 ? (
                                <TableRow className="">
                                    <TableCell
                                        colSpan={columns.length + (selectable ? 1 : 0)}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        {emptyMessage}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                sortedData.map((row) => {
                                    const rowId = row[rowKey];
                                    const isSelected = selectedRows.has(rowId);
                                    const isHovered = hoveredRow === rowId;

                                    return (
                                        <ContextMenu key={String(rowId)}>
                                            <ContextMenuTrigger asChild>
                                                <TableRow
                                                    className={`border-none
                                                        ${isSelected ? "bg-muted/40" : ""}
                                                        hover:bg-muted/20
                                                    `}
                                                    onMouseEnter={() => setHoveredRow(rowId)}
                                                    onMouseLeave={() => setHoveredRow(null)}
                                                >
                                                    {selectable && (
                                                        <TableCell className="w-12 min-w-[48px] ">
                                                            <div className={`transition-opacity duration-150 ${isHovered || isSelected ? "opacity-100" : "opacity-0"}`}>
                                                                <Checkbox
                                                                    checked={isSelected}
                                                                    onCheckedChange={(checked) =>
                                                                        handleSelectRow(rowId, checked as boolean)
                                                                    }
                                                                    onClick={(e) => e.stopPropagation()}
                                                                    className={cn(
                                                                        "h-3.5 w-3.5 ",
                                                                        isSomeSelected && "data-[state=checked]:bg-primary"
                                                                    )}
                                                                />
                                                            </div>
                                                        </TableCell>
                                                    )}

                                                    {columns.map((column) => {
                                                        const cellContent = column.accessor(row);
                                                        const columnWidth = getColumnWidth(column.key);

                                                        if (column.key === "status") {
                                                            return (
                                                                <TableCell key={column.key} className={columnWidth}>
                                                                    <Popover
                                                                        open={statusPopover.open && statusPopover.rowId === rowId}
                                                                        onOpenChange={(open) => setStatusPopover({ open, rowId: open ? rowId : null })}
                                                                    >
                                                                        <PopoverTrigger asChild>
                                                                            <div
                                                                                className="cursor-pointer inline-flex"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setStatusPopover({ open: true, rowId });
                                                                                }}
                                                                            >
                                                                                {cellContent}
                                                                            </div>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-42 p-1  rounded-lg" align="start">
                                                                            <div className="flex flex-col space-y-1 p-1">
                                                                                {statusOptions.map((status) => (
                                                                                    <button
                                                                                        key={status}
                                                                                        className="flex w-full items-center py-1 rounded-sm text-sm  hover:bg-accent outline-none cursor-pointer"
                                                                                        onClick={async () => {
                                                                                            await handleUpdateField(row, "status", status);
                                                                                            setStatusPopover({ open: false, rowId: null });
                                                                                        }}
                                                                                    >
                                                                                        <div className="flex items-center justify-between w-full">
                                                                                            <span className="flex items-center gap-2 px-2  text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors "><div>
                                                                                                {React.createElement(statusIcons[status].icon, {
                                                                                                    className: `h-4 w-4  ${statusIcons[status].color}`,
                                                                                                })}
                                                                                            </div><span className="dark:text-white ml-2">{status}</span></span>
                                                                                            {status === row.status && (
                                                                                                <div className="text-muted-foreground pr-4 text-xs">
                                                                                                    <CheckCheck size={16} />
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </TableCell>
                                                            );
                                                        }

                                                        // Priority column - clickable with popover
                                                        if (column.key === "priority") {
                                                            return (
                                                                <TableCell key={column.key} className={columnWidth}>
                                                                    <Popover
                                                                        open={priorityPopover.open && priorityPopover.rowId === rowId}
                                                                        onOpenChange={(open) => setPriorityPopover({ open, rowId: open ? rowId : null })}
                                                                    >
                                                                        <PopoverTrigger asChild>
                                                                            <div
                                                                                className="cursor-pointer inline-flex"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setPriorityPopover({ open: true, rowId });
                                                                                }}
                                                                            >
                                                                                {cellContent}
                                                                            </div>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-35 p-1  rounded-lg dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" align="start">
                                                                            <div className="flex flex-col space-y-1 p-1">
                                                                                {priorityOptions.map((priority) => (
                                                                                    <button
                                                                                        key={priority}
                                                                                        className="flex items-center px-2 text-sm py-1 rounded-sm hover:bg-accent outline-none cursor-pointer"
                                                                                        onClick={async () => {
                                                                                            await handleUpdateField(row, "priority", priority);
                                                                                            setPriorityPopover({ open: false, rowId: null });
                                                                                        }}
                                                                                    >
                                                                                        <div className="flex items-center justify-between w-full">
                                                                                            <span className="flex items-center gap-2    dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors "><div>
                                                                                                {React.createElement(priorityIcons[priority].icon, {
                                                                                                    className: `h-4 w-4 ${priorityIcons[priority].color}`,
                                                                                                })}
                                                                                            </div><span className="dark:text-white">{priority}</span></span>
                                                                                            {priority === row.priority && (
                                                                                                <div className="text-muted-foreground pr-3 text-xs">
                                                                                                    <CheckCheck size={16} />
                                                                                                </div>
                                                                                            )}
                                                                                        </div>
                                                                                    </button>
                                                                                ))}
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </TableCell>
                                                            );
                                                        }
                                                        if (column.key === "members") {
                                                            return (
                                                                <TableCell key={column.key} className={columnWidth}>
                                                                    <Popover
                                                                        open={membersPopover.open && membersPopover.rowId === rowId}
                                                                        onOpenChange={(open) => {
                                                                            setMembersPopover({ open, rowId: open ? rowId : null });
                                                                            if (!open) setEmailInput("");
                                                                        }}
                                                                    >
                                                                        <PopoverTrigger asChild>
                                                                            <div
                                                                                className="cursor-pointer inline-flex"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setMembersPopover({ open: true, rowId });
                                                                                }}
                                                                            >
                                                                                {cellContent}
                                                                            </div>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-[280px] p-3 rounded-sm" align="start">
                                                                            <div className="text-xs font-medium mb-2">Invite Members</div>

                                                                            <div className="flex flex-wrap gap-1 mb-2">
                                                                                {(row.memeberEmails as string[] || []).map((email: string) => (
                                                                                    <span
                                                                                        key={email}
                                                                                        className="flex bg-primary/20 items-center gap-1 px-2 py-1 text-xs rounded"
                                                                                    >
                                                                                        {email}
                                                                                        <button
                                                                                            onClick={async () => {
                                                                                                const updated = (row.memeberEmails as string[]).filter(e => e !== email);
                                                                                                await handleUpdateField(row, "memeberEmails", updated);
                                                                                            }}
                                                                                        >
                                                                                            ×
                                                                                        </button>
                                                                                    </span>
                                                                                ))}
                                                                            </div>

                                                                            <Input
                                                                                placeholder="Type email..."
                                                                                value={emailInput}
                                                                                onChange={(e) => setEmailInput(e.target.value)}
                                                                                onKeyDown={async (e) => {
                                                                                    if (e.key === "Enter" && emailInput) {
                                                                                        const updated = [...(row.memeberEmails as string[] || []), emailInput];
                                                                                        await handleUpdateField(row, "memeberEmails", updated);
                                                                                        setEmailInput("");
                                                                                    }
                                                                                }}
                                                                                className="h-8 text-sm"
                                                                            />

                                                                            {emailSuggestions.length > 0 && (
                                                                                <div className="mt-2 space-y-1 border rounded-sm">
                                                                                    {emailSuggestions.map((email) => (
                                                                                        <button
                                                                                            key={email}
                                                                                            className="w-full text-left px-2 py-1 text-sm hover:bg-accent"
                                                                                            onClick={async () => {
                                                                                                const updated = [...(row.memeberEmails as string[] || []), email];
                                                                                                await handleUpdateField(row, "memeberEmails", updated);
                                                                                                setEmailInput("");
                                                                                            }}
                                                                                        >
                                                                                            {email}
                                                                                        </button>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </TableCell>
                                                            );
                                                        }

                                                        if (column.key === "dueDate") {
                                                            return (
                                                                <TableCell key={column.key} className={columnWidth}>
                                                                    <Popover
                                                                        open={datePopover.open && datePopover.rowId === rowId}
                                                                        onOpenChange={(open) => setDatePopover({ open, rowId: open ? rowId : null })}
                                                                    >
                                                                        <PopoverTrigger asChild>
                                                                            <div
                                                                                className="cursor-pointer inline-flex items-center gap-2"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    setDatePopover({ open: true, rowId });
                                                                                }}
                                                                            >
                                                                                {cellContent as React.ReactNode}
                                                                            </div>
                                                                        </PopoverTrigger>
                                                                        <PopoverContent className="w-auto p-0" align="start">
                                                                            <div className="flex flex-col">
                                                                                <Calendar
                                                                                    mode="range"
                                                                                    selected={
                                                                                        row.dateRange && typeof row.dateRange === 'object'
                                                                                            ? {
                                                                                                from: row.dateRange.from ? new Date(row.dateRange.from) : undefined,
                                                                                                to: row.dateRange.to ? new Date(row.dateRange.to) : undefined
                                                                                            }
                                                                                            : undefined
                                                                                    }
                                                                                    onSelect={async (dateRange) => {
                                                                                        if (dateRange?.from && dateRange?.to) {
                                                                                            // Update both dueDate AND dateRange fields
                                                                                            await handleUpdateField(row, "dateRange", {
                                                                                                from: new Date(dateRange.from),
                                                                                                to: new Date(dateRange.to)
                                                                                            });
                                                                                            setDatePopover({ open: false, rowId: null });
                                                                                        } else if (dateRange?.from) {
                                                                                            // Store partial selection
                                                                                            await handleUpdateField(row, "dateRange", {
                                                                                                from: new Date(dateRange.from),
                                                                                                to: undefined
                                                                                            });
                                                                                        }
                                                                                    }}
                                                                                    numberOfMonths={2}
                                                                                    initialFocus
                                                                                />
                                                                                {row.dateRange && (
                                                                                    <div className="p-3 border-t">
                                                                                        <button
                                                                                            onClick={async () => {
                                                                                                await handleUpdateField(row, "dateRange", null);
                                                                                                setDatePopover({ open: false, rowId: null });
                                                                                            }}
                                                                                            className="w-full text-sm px-3 py-2 text-center hover:bg-accent rounded-sm"
                                                                                        >
                                                                                            Clear dates
                                                                                        </button>
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                        </PopoverContent>
                                                                    </Popover>
                                                                </TableCell>
                                                            );
                                                        }
                                                        return (
                                                            <TableCell
                                                                key={column.key}
                                                                className={`${columnWidth} truncate`}
                                                                title={String(cellContent)}
                                                            >
                                                                {cellContent}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            </ContextMenuTrigger>

                                            <ContextMenuContent className="text-xs w-52 space-y-1 p-2 bg-white dark:bg-[#191919]  border-gray-200 dark:border-[#383b42]">
                                                {/* View */}
                                                <ContextMenuItem className="group gap-3  text-[13px]" onSelect={() => onViewRow?.(row)}>
                                                    <CircleArrowOutUpRight
                                                        className=" h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors"
                                                    />
                                                    View
                                                </ContextMenuItem>
                                                <ContextMenuItem className="group gap-3 text-[13px]" onSelect={() => onEditTitle?.(row)}>
                                                    <SquarePen
                                                        className=" text-gray-500  dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors"
                                                    />
                                                    Rename
                                                </ContextMenuItem>

                                                {/* Description */}
                                                <ContextMenuItem className="group gap-3  text-[13px]" onSelect={() => onAddDescription?.(row)}>
                                                    <CirclePlus
                                                        className=" h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors"
                                                    />
                                                    Description
                                                </ContextMenuItem>

                                                <ContextMenuSeparator />

                                                {/* Status submenu */}
                                                <ContextMenuSub>
                                                    <ContextMenuSubTrigger className="group gap-3  text-[13px]">
                                                        <Hexagon className=" h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" />
                                                        Status
                                                    </ContextMenuSubTrigger>
                                                    <ContextMenuSubContent>
                                                        {statusOptions.map((status) => (
                                                            <ContextMenuItem
                                                                key={status}
                                                                onClick={async () => {
                                                                    await handleUpdateField(row, "status", status);
                                                                }}
                                                            >
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span className="flex items-center text-xs gap-2">
                                                                        <div>
                                                                            {React.createElement(statusIcons[status].icon, {
                                                                                className: `h-4 w-4 ${statusIcons[status].color}`,
                                                                            })}</div>{status}</span>
                                                                    {status === row.status && (
                                                                        <CheckCheck className="ml-2 " />
                                                                    )}
                                                                </div>
                                                            </ContextMenuItem>
                                                        ))}
                                                    </ContextMenuSubContent>
                                                </ContextMenuSub>

                                                <ContextMenuSub >
                                                    <ContextMenuSubTrigger className="group gap-3 text-[13px]">
                                                        <BarChart2 className=" h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" />
                                                        Priority
                                                    </ContextMenuSubTrigger>
                                                    <ContextMenuSubContent>
                                                        {priorityOptions.map((priority) => (
                                                            <ContextMenuItem
                                                                key={priority}
                                                                onClick={async () => {
                                                                    await handleUpdateField(row, "priority", priority);
                                                                }}
                                                            >
                                                                <div className="flex items-center justify-between w-full">
                                                                    <span className="flex items-center gap-2  text-xs"><div>
                                                                        {React.createElement(priorityIcons[priority].icon, {
                                                                            className: `h-4 w-4 ${priorityIcons[priority].color}`,
                                                                        })}
                                                                    </div>{priority}</span>
                                                                    {priority === row.priority && (
                                                                        <CheckCheck className="ml-2 " />
                                                                    )}
                                                                </div>
                                                            </ContextMenuItem>
                                                        ))}
                                                    </ContextMenuSubContent>
                                                </ContextMenuSub>

                                                <ContextMenuSub>
                                                    <ContextMenuSubTrigger className="group gap-3 text-[13px]">
                                                        <Users className="  h-4 w-4 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors" />
                                                        Members
                                                    </ContextMenuSubTrigger>
                                                    <ContextMenuSubContent className="w-56">
                                                        <div className="p-2 space-y-2">
                                                            <div className="text-xs font-medium text-muted-foreground mb-2">
                                                                Current Members
                                                            </div>
                                                            {(row.memeberEmails as string[] || []).length > 0 ? (
                                                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                                                    {(row.memeberEmails as string[] || []).map((email: string) => (
                                                                        <div
                                                                            key={email}
                                                                            className="flex items-center justify-between text-xs bg-muted/50 rounded px-2 py-1"
                                                                        >
                                                                            <span className="truncate">{email}</span>
                                                                            <button
                                                                                onClick={async (e) => {
                                                                                    e.stopPropagation();
                                                                                    const updated = (row.memeberEmails as string[]).filter(
                                                                                        (e) => e !== email
                                                                                    );
                                                                                    await handleUpdateField(row, "memeberEmails", updated);
                                                                                }}
                                                                                className="ml-2 text-muted-foreground hover:text-destructive"
                                                                            >
                                                                                ×
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="text-xs text-muted-foreground">No members yet</div>
                                                            )}
                                                        </div>
                                                    </ContextMenuSubContent>
                                                </ContextMenuSub>

                                                <ContextMenuSeparator />

                                                <ContextMenuItem className="group gap-3 text-[13px]" onSelect={() => onDeleteRow?.(row)}>
                                                    <Trash
                                                        className=" text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-white transition-colors"
                                                    />
                                                    Delete
                                                </ContextMenuItem>
                                            </ContextMenuContent>



                                        </ContextMenu>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div >

            {/* {sortedData.length > 0 && (
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div>
                        Showing {sortedData.length} of {data.length} results
                    </div>
                    {selectable && selectedRows.size > 0 && (
                        <div className="font-medium text-primary">
                            {selectedRows.size} row
                            {selectedRows.size !== 1 ? "s" : ""} selected
                        </div>
                    )}
                </div>
            )} */}
        </div >
    );
}