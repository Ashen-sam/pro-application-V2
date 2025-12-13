import { createBrowserRouter, Navigate } from "react-router-dom";
import { GlobalLayout } from "@/components";
import {
    Calendar as CalendarNew,
    Home,
    Overview,
    ProjectFlow,
    ProjectInfo,
    Projects,
    Settings,
    Task,
} from "@/pages";
import { AuthLayout, Login, Register } from "@/pages/auth";
import { ProtectedRoute } from "@/pages/auth/ProtectedRoute";
import { CalendarPage } from "@/pages/calendar/calendar";

export const router = createBrowserRouter([
    // 🔐 Public pages
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },

    // 🏠 Protected after login
    {
        element: (
            <ProtectedRoute>
                <GlobalLayout />
            </ProtectedRoute>
        ),
        children: [
            { index: true, element: <Navigate to="/home" replace /> },
            { path: "/home", element: <Home /> },
            { path: "/projects", element: <Projects /> },
            { path: "/calendar", element: <CalendarPage /> },
            { path: "/settings", element: <Settings /> },
            { path: "/project-flow", element: <ProjectFlow /> },

            // Nested project routes
            {
                path: "/projects/:projectId",
                element: <ProjectInfo />,
                children: [
                    { index: true, element: <Overview /> },
                    { path: "tasks", element: <Task /> },
                    { path: "calendar", element: <CalendarNew /> },
                ],
            },
        ],
    },

    // Redirect unknown routes to login
    { path: "*", element: <Navigate to="/login" replace /> },
]);
