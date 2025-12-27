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
import CalendarPage from "@/pages/calendar/calendar";
import { Landing } from "@/pages/landing/landing";
// import { Flow } from "@/pages/projectFlows/flow";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
    // 🌟 Landing page (public, no auth required)
    {
        path: "/",
        element: <Landing />,
    },

    // 🔐 Public pages (authentication routes)
    {
        element: <AuthLayout />,
        children: [
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },

    // 🏠 Protected routes (require authentication)
    {
        element: (
            <div className="">
                <TitleProvider />
                <GlobalLayout />
            </div>
        ),
        children: [
            { path: "/home", element: <Home />, handle: { title: "Home" } },
            { path: "/projects", element: <Projects />, handle: { title: "Projects" } },
            { path: "/calendar", element: <CalendarPage />, handle: { title: "Calendar" } },
            { path: "/settings", element: <Settings />, handle: { title: "Settings" } },
            { path: "/project-flow", element: <ProjectFlow />, handle: { title: "Project Flow" } },
            // { path: "/flow", element: <Flow />, handle: { title: "Project Flow" } },

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

    // Redirect unknown routes to landing page
    { path: "*", element: <Navigate to="/" replace /> },
]);