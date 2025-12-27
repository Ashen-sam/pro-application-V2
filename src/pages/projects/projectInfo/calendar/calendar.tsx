import { CalendarCommon, type CalendarEvent } from "@/components/common/calendarCommon";
import { useGetCalendarDataQuery } from "../../../../features/calendarApi";
import { useMemo, useState } from "react";

export const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    // Calculate date range for API query (e.g., current month ± 1 month for context)
    const dateRange = useMemo(() => {
        const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1);
        const end = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 2, 0);

        return {
            start_date: start.toISOString().split('T')[0],
            end_date: end.toISOString().split('T')[0]
        };
    }, [selectedDate]);

    // Fetch calendar data from API
    const { data, isLoading, error } = useGetCalendarDataQuery(dateRange);

    // Transform API tasks into CalendarEvent format
    const events: CalendarEvent[] = useMemo(() => {
        if (!data?.tasks) return [];

        return data.tasks
            .filter(task => task.due_date) // Only include tasks with due dates
            .map(task => {
                // Determine color based on priority
                let color = "text-gray-600";
                switch (task.priority.toLowerCase()) {
                    case "high":
                    case "urgent":
                        color = "text-red-600";
                        break;
                    case "medium":
                        color = "text-orange-600";
                        break;
                    case "low":
                        color = "text-blue-600";
                        break;
                    default:
                        color = "text-gray-600";
                }

                // Parse the due_date string to Date object
                const dueDate = new Date(task.due_date!);

                return {
                    id: task.task_id.toString(),
                    title: task.name,
                    date: dueDate,
                    time: dueDate.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                    }),
                    color,
                    // Store additional data for reference
                    metadata: {
                        taskId: task.task_id,
                        projectId: task.project_uuid || task.project_id,
                        projectName: task.projects?.name,
                        status: task.status,
                        priority: task.priority,
                        description: task.description,
                        isAssigned: task.isAssigned
                    }
                } as CalendarEvent;
            });
    }, [data]);

    const handleEventClick = (event: CalendarEvent) => {
        const metadata = (event as any).metadata;
        if (metadata) {
            alert(
                `Task: ${event.title}\n` +
                `Project: ${metadata.projectName || 'N/A'}\n` +
                `Status: ${metadata.status}\n` +
                `Priority: ${metadata.priority}\n` +
                `Time: ${event.time}\n` +
                `${metadata.description ? `\nDescription: ${metadata.description}` : ''}`
            );
        } else {
            alert(`Clicked: ${event.title} at ${event.time}`);
        }
    };

    const handleAddEvent = () => {
        alert("Add event clicked! Implement task creation here.");
    };

    const handleDateChange = (date: Date) => {
        console.log("Date changed to:", date);
        setSelectedDate(date);
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading calendar...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center max-w-md">
                    <div className="text-red-600 mb-4">
                        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-gray-800 font-semibold mb-2">Failed to load calendar</p>
                    <p className="text-gray-600 text-sm">
                        {(error as any)?.data?.message || (error as any)?.message || "Please try again later"}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <CalendarCommon
            events={events}
            initialDate={selectedDate}
            onEventClick={handleEventClick}
            onAddEvent={handleAddEvent}
            onDateChange={handleDateChange}
            showAddButton={true}
            showTodayButton={true}
            highlightToday={true}
            maxEventsPerDay={3}
        />
    );
};