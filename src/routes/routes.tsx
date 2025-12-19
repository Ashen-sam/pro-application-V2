import { GlobalLayout } from "@/components";
import TitleProvider from "@/components/common/TitleProvider";
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
import { ClerkCallback } from "@/pages/auth/ClerkCallback";
import CalendarPage from "@/pages/calendar/calendar";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
    // 🔐 Public pages (authentication routes)
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
            { path: "/auth/callback", element: <ClerkCallback /> },
        ],
    },

    // 🏠 Protected routes (require authentication)
    {
        element: (
            <>
                <TitleProvider />
                <GlobalLayout />
            </>
        ),
        children: [
            { index: true, element: <Navigate to="/home" replace /> },
            { path: "/home", element: <Home />, handle: { title: "Home" } },
            { path: "/projects", element: <Projects />, handle: { title: "Projects" } },
            { path: "/calendar", element: <CalendarPage />, handle: { title: "Calendar" } },
            { path: "/settings", element: <Settings />, handle: { title: "Settings" } },
            { path: "/project-flow", element: <ProjectFlow />, handle: { title: "Project Flow" } },
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