import { GlobalLayout } from "@/components";
import TitleProvider from "@/components/common/TitleProvider";
import {
    Calendar as CalendarNew,
    Home,
    Insights,
    Overview,
    ProjectFlow,
    ProjectInfo,
    Projects,
    Settings,
    Task,
} from "@/pages";
import { AuthLayout, Login, Register } from "@/pages/auth"; // Add SSOCallback import
import CalendarPage from "@/pages/calendar/calendar";
import { Landing } from "@/pages/landing/landing";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import ProtectedRoute from "@/components/protectedRoute";
import { SSOCallback } from "@/pages/auth/SSOCallback.";

export const router = createBrowserRouter([
    // 🌟 Landing page (public, no auth required)
    {
        path: "/",
        element: (
            <>
                <SignedIn>
                    <Navigate to="/home" replace />
                </SignedIn>
                <SignedOut>
                    <Landing />
                </SignedOut>
            </>
        ),
    },

    // 🔐 Public pages (authentication routes)
    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: (
                    <>
                        <SignedIn>
                            <Navigate to="/home" replace />
                        </SignedIn>
                        <SignedOut>
                            <Login />
                        </SignedOut>
                    </>
                )
            },
            {
                path: "/register",
                element: (
                    <>
                        <SignedIn>
                            <Navigate to="/home" replace />
                        </SignedIn>
                        <SignedOut>
                            <Register />
                        </SignedOut>
                    </>
                )
            },
            // ✨ ADD THIS - SSO Callback route
            {
                path: "/sso-callback",
                element: <SSOCallback />
            },
        ],
    },

    // 🏠 Protected routes (require authentication)
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: (
                    <div>
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

                    {
                        path: "/projects/:projectId",
                        element: <ProjectInfo />,
                        children: [
                            { index: true, element: <Overview /> },
                            { path: "tasks", element: <Task /> },
                            { path: "calendar", element: <CalendarNew /> },
                            { path: "insights", element: <Insights /> },

                        ],
                    },
                ],
            },
        ],
    },

    // Redirect unknown routes to landing page
    { path: "*", element: <Navigate to="/" replace /> },
]);