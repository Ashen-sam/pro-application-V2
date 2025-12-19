import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Calendar, CalendarDays, CalendarPlus, ChevronLeft, ChevronRight, Clock, PackagePlus } from "lucide-react";
import { useState } from "react";
import { CommonDialog } from "./commonDialog";
import { CommonDialogFooter } from "./commonDialogFooter";

export interface CalendarEvent {
    id: string;
    title: string;
    date: Date;
    time: string;
    color: string;
    description?: string;
}

export interface CalendarProps {
    events?: CalendarEvent[];
    initialDate?: Date;
    onEventClick?: (event: CalendarEvent) => void;
    onAddEvent?: (event: Omit<CalendarEvent, 'id'>) => void;
    onDateChange?: (date: Date) => void;
    showAddButton?: boolean;
    showTodayButton?: boolean;
    className?: string;
    highlightToday?: boolean;
    maxEventsPerDay?: number;
    showHeader?: boolean;
    headerTitle?: string;
    headerDescription?: string;
    showHeaderIcon?: boolean;
}

// Enhanced Reusable Calendar Component
export const CalendarCommon = ({
    events = [],
    initialDate = new Date(),
    onEventClick,
    onAddEvent,
    onDateChange,
    showAddButton = true,
    showTodayButton = true,
    className = "",
    highlightToday = true,
    maxEventsPerDay = 3,
    showHeader = true,
    headerTitle = "Calendar",
    headerDescription = "Manage and organize your projects",
    showHeaderIcon = true,
}: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    // Form states
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventDate, setNewEventDate] = useState("");
    const [newEventTime, setNewEventTime] = useState("");
    const [newEventColor, setNewEventColor] = useState("text-blue-600");
    const [newEventDescription, setNewEventDescription] = useState("");

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month, 1).getDay();
    };

    const dayNames = ["Mon", "Tues", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const previousMonth = () => {
        const newDate = new Date(year, month - 1, 1);
        setCurrentDate(newDate);
        onDateChange?.(newDate);
    };

    const nextMonth = () => {
        const newDate = new Date(year, month + 1, 1);
        setCurrentDate(newDate);
        onDateChange?.(newDate);
    };

    const goToToday = () => {
        const today = new Date();
        setCurrentDate(today);
        onDateChange?.(today);
    };

    const getEventsForDay = (day: number, targetMonth: number, targetYear: number) => {
        return events.filter(
            (event) =>
                event.date.getFullYear() === targetYear &&
                event.date.getMonth() === targetMonth &&
                event.date.getDate() === day
        );
    };

    const isToday = (day: number, checkMonth: number, checkYear: number) => {
        if (!highlightToday) return false;
        const today = new Date();
        return (
            day === today.getDate() &&
            checkMonth === today.getMonth() &&
            checkYear === today.getFullYear()
        );
    };

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setIsViewDialogOpen(true);
        onEventClick?.(event);
    };

    const handleOpenAddDialog = () => {
        // Reset form
        setNewEventTitle("");
        setNewEventDate("");
        setNewEventTime("");
        setNewEventColor("text-blue-600");
        setNewEventDescription("");
        setIsAddDialogOpen(true);
    };

    const handleAddEventSubmit = () => {
        if (!newEventTitle || !newEventDate || !newEventTime) {
            alert("Please fill in all required fields");
            return;
        }

        const newEvent = {
            title: newEventTitle,
            date: new Date(newEventDate),
            time: newEventTime,
            color: newEventColor,
            description: newEventDescription,
        };

        onAddEvent?.(newEvent);
        setIsAddDialogOpen(false);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderCalendarDays = () => {
        const days = [];
        const totalCells = 35;

        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        const prevMonthDays = getDaysInMonth(new Date(year, month - 1, 1));
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;

        for (let i = adjustedFirstDay - 1; i >= 0; i--) {
            const prevDay = prevMonthDays - i;
            const prevEvents = getEventsForDay(prevDay, prevMonth, prevYear);

            days.push(
                <div
                    key={`prev-${i}`}
                    className="min-h-[120px] border-r border-b p-3 bg-gray-50/50 dark:bg-[#282828]"
                >
                    <span className="text-sm text-gray-400 font-medium">{prevDay}</span>
                    <div className="mt-2 space-y-1">
                        {prevEvents.slice(0, maxEventsPerDay).map((event) => (
                            <div
                                key={event.id}
                                onClick={() => handleEventClick(event)}
                                className="text-xs px-2 py-1 rounded bg-white border truncate opacity-60 cursor-pointer"
                            >
                                <span className={cn("font-medium", event.color)}>
                                    {event.title}
                                </span>
                                <span className="text-gray-500 ml-1">{event.time}</span>
                            </div>
                        ))}
                        {prevEvents.length > maxEventsPerDay && (
                            <div className="text-xs text-gray-400 px-2">
                                {prevEvents.length - maxEventsPerDay} more...
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEvents = getEventsForDay(day, month, year);
            const isTodayDate = isToday(day, month, year);

            days.push(
                <div
                    key={day}
                    className={cn(
                        "min-h-[120px] border-r border-b p-3  hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors relative",
                        isTodayDate && "bg-blue-50/30"
                    )}
                >
                    <span
                        className={cn(
                            "text-sm font-medium inline-flex items-center justify-center",
                            isTodayDate && "bg-blue-600 text-white rounded-full w-6 h-6"
                        )}
                    >
                        {day}
                    </span>
                    <div className="mt-2 space-y-1">
                        {dayEvents.slice(0, maxEventsPerDay).map((event) => (
                            <div
                                key={event.id}
                                onClick={() => handleEventClick(event)}
                                className="text-xs px-2 py-1 rounded bg-white dark:bg-[#282828] border truncate cursor-pointer hover:shadow-sm transition-shadow"
                            >
                                <span className={cn("font-medium", event.color)}>
                                    <PackagePlus className="w-3 h-3 mr-1 inline" />{event.title}
                                </span>
                            </div>
                        ))}
                        {dayEvents.length > maxEventsPerDay && (
                            <div className="text-xs text-gray-500 px-2">
                                {dayEvents.length - maxEventsPerDay} more...
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        const remainingCells = totalCells - days.length;
        for (let day = 1; day <= remainingCells; day++) {
            days.push(
                <div
                    key={`next-${day}`}
                    className="min-h-[120px] border-r border-b p-3 dark:bg-[#282828]"
                >
                    <span className="text-sm text-gray-400 font-medium">{day}</span>
                </div>
            );
        }

        return days;
    };

    const colorOptions = [
        { value: "text-blue-600", label: "Blue", bgClass: "bg-blue-600" },
        { value: "text-red-600", label: "Red", bgClass: "bg-red-600" },
        { value: "text-green-600", label: "Green", bgClass: "bg-green-600" },
        { value: "text-purple-600", label: "Purple", bgClass: "bg-purple-600" },
        { value: "text-orange-600", label: "Orange", bgClass: "bg-orange-600" },
        { value: "text-gray-600", label: "Gray", bgClass: "bg-gray-600" },
    ];

    return (
        <div className={cn("flex flex-col ", className)}>
            {showHeader && (
                <div className="mb-4">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {showHeaderIcon && (
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                    <CalendarDays className="h-5 w-5 text-primary" />
                                </div>
                            )}
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight">{headerTitle}</h1>
                                <p className="text-sm text-muted-foreground">{headerDescription}</p>
                            </div>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            {showAddButton && (
                                <Button size="sm" className="h-9 text-sm" onClick={handleOpenAddDialog}>
                                    <CalendarPlus className="h-4 w-4" />
                                    Event
                                </Button>
                            )}
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border rounded-lg">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-r-none"
                                        onClick={previousMonth}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>
                                    {showTodayButton && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-9 px-4 rounded-none border-x"
                                            onClick={goToToday}
                                        >
                                            Today
                                        </Button>
                                    )}
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 rounded-l-none"
                                        onClick={nextMonth}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-auto border rounded-sm">
                <div className="grid grid-cols-7 border-b dark:border-b-zinc-700 sticky top-0 z-10">
                    {dayNames.map((day) => (
                        <div
                            key={day}
                            className="text-left px-3 py-3 text-xs font-medium text-gray-600 dark:text-gray-200 border-r bg-[#fcfcfc] dark:bg-[#282828] last:border-r-0"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7">{renderCalendarDays()}</div>
            </div>


            <CommonDialog
                icon={<CalendarPlus className="text-primary" size={20} />}
                open={isViewDialogOpen}
                onOpenChange={setIsViewDialogOpen}
                title={selectedEvent ? selectedEvent.title : "Event Details"}
                size="sm"
                footer={
                    <CommonDialogFooter
                        onCancel={() => setIsViewDialogOpen(false)}
                        onConfirm={() => setIsViewDialogOpen(false)}
                        cancelText="Close"
                        confirmText="Edit Event"
                    />
                }
            >
                {selectedEvent && (
                    <div className="space-y-4">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Date</p>
                                <p className="text-sm text-muted-foreground">
                                    {formatDate(selectedEvent.date)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Time</p>
                                <p className="text-sm text-muted-foreground">
                                    {selectedEvent.time}
                                </p>
                            </div>
                        </div>
                        {selectedEvent.description && (
                            <div className="flex items-start gap-3">
                                <div className="h-5 w-5 flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Description</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedEvent.description}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CommonDialog>


            <CommonDialog
                icon={<CalendarPlus className="text-primary" size={20} />}
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                title="Add New Event"
                size="sm"
                note="Add calendar events"
                footer={
                    <CommonDialogFooter
                        onCancel={() => setIsAddDialogOpen(false)}
                        onConfirm={handleAddEventSubmit}
                        cancelText="Cancel"
                        confirmText="Add Event" />
                }
            >
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                            id="title"
                            placeholder="Enter event title"
                            value={newEventTitle}
                            onChange={(e) => setNewEventTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={newEventDate}
                                onChange={(e) => setNewEventDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="time">Time *</Label>
                            <Input
                                id="time"
                                type="time"
                                value={newEventTime}
                                onChange={(e) => setNewEventTime(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="color">Color</Label>
                        <Select value={newEventColor} onValueChange={setNewEventColor}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a color" />
                            </SelectTrigger>
                            <SelectContent>
                                {colorOptions.map((color) => (
                                    <SelectItem key={color.value} value={color.value}>
                                        <div className="flex items-center gap-2">
                                            <div className={cn("w-3 h-3 rounded-full", color.bgClass)} />
                                            {color.label}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>


                </div>
            </CommonDialog>
        </div >
    );
};