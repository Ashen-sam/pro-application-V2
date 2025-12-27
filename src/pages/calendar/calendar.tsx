import { CalendarCommon, type CalendarEvent } from "@/components/common/calendarCommon";
import { LinearLoader } from "@/components/common/CommonLoader";
import { useMemo, useState } from "react";
import { useGetCalendarDataQuery } from "../../features/calendarApi";

// Color storage key
const COLOR_STORAGE_KEY = "calendar_project_colors";

// Get color from localStorage
// Update getStoredColor to accept number | string
const getStoredColor = (projectId: number | string, type: 'start' | 'end'): string | null => {
    try {
        const stored = localStorage.getItem(COLOR_STORAGE_KEY);
        if (stored) {
            const colors = JSON.parse(stored);
            return colors[`project-${type}-${projectId}`] || null;
        }
    } catch (error) {
        console.error("Error reading colors from localStorage:", error);
    }
    return null;
};

// Save color to localStorage
const saveColor = (eventId: string, color: string) => {
    try {
        const stored = localStorage.getItem(COLOR_STORAGE_KEY);
        const colors = stored ? JSON.parse(stored) : {};
        colors[eventId] = color;
        localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(colors));
    } catch (error) {
        console.error("Error saving color to localStorage:", error);
    }
};

export default function CalendarPage() {
    // Fetch calendar data from API
    const { data: calendarData, isLoading, error } = useGetCalendarDataQuery();
    console.log("ashensam", calendarData);

    // State to trigger re-render when colors change
    const [colorVersion, setColorVersion] = useState(0);

    // Function to handle color change
    // Modify the handleColorChange function
    const handleColorChange = (eventId: string, color: string) => {
        // ✅ Updated regex to handle UUIDs with hyphens
        // Matches: "project-start-123" OR "project-start-uuid-with-hyphens"
        const match = eventId.match(/^project-(start|end)-(.+)$/);

        if (match) {
            const projectId = match[2]; // This will be either numeric ID or UUID
            // Save color for both start and end events of this project
            saveColor(`project-start-${projectId}`, color);
            saveColor(`project-end-${projectId}`, color);
        } else {
            // For non-project events, just save normally
            saveColor(eventId, color);
        }

        setColorVersion(prev => prev + 1);
    };
    // Transform API data to CalendarEvent format
    const events: CalendarEvent[] = useMemo(() => {
        if (!calendarData) return [];

        const transformedEvents: CalendarEvent[] = [];

        // Transform projects to calendar events
        calendarData.projects.forEach((project) => {
            // Normalize priority to lowercase for comparison
            const priorityLower = project.priority.toLowerCase();

            // Default color based on priority
            const defaultColor = priorityLower === "high" || priorityLower === "critical"
                ? "text-red-600"
                : priorityLower === "medium"
                    ? "text-orange-600"
                    : "text-blue-600";

            // Add start date event
            if (project.start_date) {
                const eventId = `project-start-${project.project_uuid || project.project_id}`;
                const storedColor = getStoredColor(project.project_uuid || project.project_id, 'start');


                transformedEvents.push({
                    id: eventId,
                    title: `${project.name} (Start)`,
                    date: new Date(project.start_date),
                    time: "All Day",
                    color: storedColor || defaultColor,
                    description: project.description || `Project: ${project.name} - ${project.status}`,
                });
            }

            // Add end date event
            if (project.end_date) {
                const eventId = `project-end-${project.project_uuid || project.project_id}`;
                const storedColor = getStoredColor(project.project_uuid || project.project_id, 'end');

                transformedEvents.push({
                    id: eventId,
                    title: `${project.name} (End)`,
                    date: new Date(project.end_date),
                    time: "All Day",
                    color: storedColor || defaultColor,
                    description: project.description || `Project: ${project.name} - ${project.status}`,
                });
            }
        });

        // Transform tasks to calendar events
        calendarData.tasks.forEach((task) => {
            if (task.due_date) {
                // Normalize priority to lowercase for comparison
                const priorityLower = task.priority.toLowerCase();

                transformedEvents.push({
                    id: `task-${task.task_id}`,
                    title: task.name,
                    date: new Date(task.due_date),
                    time: "All Day",
                    color: priorityLower === "high" || priorityLower === "critical"
                        ? "text-purple-700"
                        : priorityLower === "medium"
                            ? "text-green-600"
                            : "text-gray-600",
                    description: task.description || `Task: ${task.name} - ${task.status}${task.projects ? ` (${task.projects.name})` : ''}`,
                });
            }
        });

        return transformedEvents;
    }, [calendarData, colorVersion]); // Add colorVersion to dependencies

    const handleEventClick = (event: CalendarEvent) => {
        console.log("Event clicked:", event);
    };

    const handleDateChange = (date: Date) => {
        console.log("Date changed to:", date);
    };

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-[500px] flex items-center justify-center">
                <div className="text-center">
                    <LinearLoader />
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg font-semibold">Failed to load calendar data</p>
                    <p className="mt-2 text-gray-600">Please try refreshing the page</p>
                </div>
            </div>
        );
    }

    return (
        <div className="">

            <CalendarCommon
                events={events}
                initialDate={new Date()}
                onEventClick={handleEventClick}
                onDateChange={handleDateChange}
                onColorChange={handleColorChange}
                showAddButton={false}
                showTodayButton={true}
                highlightToday={true}
                maxEventsPerDay={3}
            />
        </div>
    );
}