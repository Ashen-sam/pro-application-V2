// File: CalendarPage.tsx

import { CalendarCommon, type CalendarEvent } from "@/components/common/calendarCommon";
import { useState } from "react";

export default function CalendarPage() {
    const initialEvents: CalendarEvent[] = [
        {
            id: "1",
            title: "One-on-one with John",
            date: new Date(2025, 0, 2),
            time: "10:00 AM",
            color: "text-red-600",
            description: "Weekly sync meeting to discuss project progress and roadblocks."
        },
        {
            id: "2",
            title: "All-hands meeting",
            date: new Date(2025, 0, 2),
            time: "4:00 PM",
            color: "text-purple-700",
            description: "Monthly company-wide meeting with leadership updates."
        },
        {
            id: "3",
            title: "Dinner with Client",
            date: new Date(2025, 0, 2),
            time: "6:30 PM",
            color: "text-green-600",
            description: "Business dinner at The Riverside Restaurant."
        },
        {
            id: "4",
            title: "Friday standup",
            date: new Date(2025, 0, 3),
            time: "9:00 AM",
            color: "text-blue-600",
            description: "Daily team standup to share updates and blockers."
        },
        {
            id: "5",
            title: "House inspection",
            date: new Date(2025, 0, 4),
            time: "10:30 AM",
            color: "text-orange-600",
            description: "Property inspection with real estate agent."
        },
        {
            id: "6",
            title: "Morning standup",
            date: new Date(2025, 0, 1),
            time: "9:00 AM",
            color: "text-gray-600",
            description: "Daily team sync-up meeting."
        },
        {
            id: "7",
            title: "Coffee with Alex",
            date: new Date(2025, 0, 1),
            time: "11:00 AM",
            color: "text-blue-600",
            description: "Casual catch-up at the local coffee shop."
        },
        {
            id: "8",
            title: "Marketing afternoon",
            date: new Date(2025, 0, 1),
            time: "2:30 PM",
            color: "text-purple-600",
            description: "Marketing strategy session for Q1 campaigns."
        },
        {
            id: "9",
            title: "Morning standup",
            date: new Date(2024, 11, 30),
            time: "9:00 AM",
            color: "text-gray-600",
            description: "Team standup meeting."
        },
        {
            id: "10",
            title: "Monday standup",
            date: new Date(2025, 0, 6),
            time: "9:00 AM",
            color: "text-gray-600",
            description: "Weekly kickoff meeting."
        },
        {
            id: "11",
            title: "One-on-one with Sarah",
            date: new Date(2025, 0, 7),
            time: "9:00 AM",
            color: "text-red-600",
            description: "Performance review and career development discussion."
        },
        {
            id: "12",
            title: "Content planning",
            date: new Date(2025, 0, 6),
            time: "11:00 AM",
            color: "text-blue-600",
            description: "Plan social media content calendar for the month."
        },
    ];

    // State to manage events - THIS IS THE KEY CHANGE
    const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

    const handleEventClick = (event: CalendarEvent) => {
        console.log("Event clicked:", event);
    };

    // THIS IS THE CRITICAL FUNCTION - It adds new events to state
    const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
        // Generate unique ID using timestamp and random string
        const eventWithId: CalendarEvent = {
            ...newEvent,
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };

        // Add new event to existing events array
        setEvents(prevEvents => [...prevEvents, eventWithId]);

        console.log("Event added:", eventWithId);
    };

    const handleDateChange = (date: Date) => {
        console.log("Date changed to:", date);
    };

    return (
        <div className="min-h-screen">
            <CalendarCommon
                events={events}
                initialDate={new Date()}
                onEventClick={handleEventClick}
                onAddEvent={handleAddEvent}
                onDateChange={handleDateChange}
                showAddButton={true}
                showTodayButton={true}
                highlightToday={true}
                maxEventsPerDay={3}
            />
        </div>
    );
}