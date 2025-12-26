// src/pages/Home.tsx

import { AppTour } from "@/components/tour/Apptour";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { differenceInDays, format, parseISO } from "date-fns";
import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    Bolt,
    Calendar,
    CheckCircle2,
    FolderOpen,
    Folders,
    GitBranch,
    Package,
    TrendingUp,
    Users
} from "lucide-react";
import { useGetDashboardDataQuery } from "../../features/dashboardApi";

export const Home = () => {
    const { data, isLoading, isError, refetch } = useGetDashboardDataQuery();

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
            case 'medium': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
            case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
            default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
            case 'in progress': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20';
            case 'review': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/20';
            case 'to do': return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
            default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
        }
    };

    const formatDueDate = (dateString: string | null) => {
        if (!dateString) return 'No due date';
        try {
            return format(parseISO(dateString), 'MMM dd');
        } catch {
            return dateString;
        }
    };

    const getDaysLeft = (dateString: string) => {
        try {
            const dueDate = parseISO(dateString);
            return differenceInDays(dueDate, new Date());
        } catch {
            return 0;
        }
    };

    // Loading State
    if (isLoading) {
        return (
            <div className="bg-transparent text-gray-900 dark:text-white">
                <div className="max-w-7xl mx-auto space-y-6">
                    <Skeleton className="h-20 w-full rounded-lg" />
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-32 w-full rounded-lg" />
                        ))}
                    </div>
                    <div className="grid gap-6 lg:grid-cols-3">
                        <Skeleton className="lg:col-span-2 h-96 w-full rounded-lg" />
                        <Skeleton className="h-96 w-full rounded-lg" />
                    </div>
                </div>
            </div>
        );
    }

    // Error State
    if (isError) {
        return (
            <div className="bg-transparent text-gray-900 dark:text-white">
                <div className="max-w-7xl mx-auto">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription className="flex items-center justify-between">
                            <span>Failed to load dashboard data. Please try again.</span>
                            <Button onClick={() => refetch()} size="sm" variant="outline">
                                Retry
                            </Button>
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    const dashboardData = data?.data;
    const hasProjects = dashboardData && dashboardData.totalProjects > 0;

    // Stats Data with Real API Data
    const statsData = [
        {
            label: "Total Projects",
            value: dashboardData?.totalProjects || 0,
            icon: Package,
            iconBg: "bg-blue-100 dark:bg-blue-900/20",
            iconColor: "text-primary",
            trend: `${dashboardData?.completedProjects || 0} completed`,
            trendPositive: true
        },
        {
            label: "Completed",
            value: dashboardData?.completedProjects || 0,
            icon: CheckCircle2,
            iconBg: "bg-green-100 dark:bg-green-900/20",
            iconColor: "text-primary",
            trend: `${Math.round(((dashboardData?.completedProjects || 0) / (dashboardData?.totalProjects || 1)) * 100)}% completion rate`,
            trendPositive: true
        },
        {
            label: "Team Members",
            value: dashboardData?.totalTeamMembers || 0,
            icon: Users,
            iconBg: "bg-purple-100 dark:bg-purple-900/20",
            iconColor: "text-primary",
            subtext: "Active collaborators",
            trendPositive: false
        }
    ];

    return (
        <div className="bg-gray-50 bg-transparent text-gray-900 dark:text-white">
            <AppTour />

            {!hasProjects ? (
                <div className="flex flex-col items-center justify-center min-h-[600px] px-4 text-gray-700 dark:text-slate-200">
                    <h2 className="text-3xl font-bold mb-8 text-center">Getting Started with Your Project</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 w-full max-w-3xl">
                        <div
                            id="step-create-project"
                            className="flex flex-col p-6 border rounded-xl shadow-sm dark:bg-[#1a1a1a] transition-shadow bg-white hover:shadow-md"
                        >
                            <div className="flex relative items-center mb-4 gap-3">
                                <div className="absolute h-20 w-20 rounded-full bg-primary/80 blur-3xl"></div>
                                <FolderOpen className="text-primary h-6 w-6" />
                                <div className="font-semibold text-lg">1. Create Project</div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Start by creating your first project. Organize your work into manageable projects.
                            </div>
                        </div>

                        <div
                            id="step-create-tasks"
                            className="flex flex-col p-6 border rounded-xl shadow-sm dark:bg-[#1a1a1a] transition-shadow bg-white hover:shadow-md"
                        >
                            <div className="flex items-center mb-4 gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                    <Folders className="text-primary h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-lg">2. Create Tasks</h3>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">
                                Add and organize tasks for your projects. Keep track of progress easily.
                            </div>
                        </div>

                        <div
                            id="step-plan-schedule"
                            className="flex flex-col p-6 border rounded-xl dark:bg-[#1a1a1a] shadow-sm transition-shadow bg-white hover:shadow-md"
                        >
                            <div className="flex items-center mb-4 gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                    <Calendar className="text-primary h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-lg">3. Plan Your Schedule</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Visualize deadlines and milestones with a calendar view to stay on track.
                            </p>
                        </div>

                        <div
                            id="step-define-workflow"
                            className="flex relative flex-col p-6 border rounded-xl dark:bg-[#1a1a1a] shadow-sm transition-shadow bg-white hover:shadow-md"
                        >
                            <div className="flex items-center mb-4 gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                    <GitBranch className="text-primary h-5 w-5" />
                                </div>
                                <h3 className="font-semibold text-lg">4. Define Workflow</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Customize workflows and connect tasks to visualize project flow.
                            </p>
                            <div className="absolute h-20 w-20 rounded-full bg-primary/50 blur-3xl"></div>
                        </div>
                    </div>

                    <Button
                        id="start-project-button"
                        variant="outline"
                        size="lg"
                        className="mt-10 px-8 py-3 gap-2 text-sm font-medium transition-colors"
                        onClick={() => {
                            window.location.href = '/projects';
                        }}
                    >
                        Start your first project
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="w-full flex items-center justify-between px-6 py-4 bg-primary/10 rounded-lg border border-primary/20">
                        <div className="flex gap-4">
                            <div className="flex mt-1 justify-center rounded-lg">
                                <Bolt size={20} className="text-primary" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-sm font-semibold text-gray-900 dark:text-slate-200">
                                    Dashboard Overview
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400">
                                    Manage and organize your projects efficiently
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={() => refetch()}
                            size="sm"
                            variant="ghost"
                            className="text-xs"
                        >
                            Refresh
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {statsData.map((stat, index) => (
                            <Card key={index} className="bg-white shadow-sm dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] hover:shadow-md transition-shadow">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                                                {stat.label}
                                            </div>
                                            <div className="text-3xl font-bold text-gray-900 dark:text-slate-200">
                                                {stat.value}
                                            </div>
                                        </div>
                                        <div className="relative flex items-center justify-center w-14 h-14 rounded-lg">
                                            <div className="absolute inset-0 rounded-full bg-primary/15 blur-md"></div>
                                            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                                                <stat.icon className={`relative z-10 h-6 w-6 ${stat.iconColor}`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-4 text-xs">
                                        {stat.trend ? (
                                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1 font-medium">
                                                <TrendingUp className="h-3 w-3" />
                                                {stat.trend}
                                            </span>
                                        ) : (
                                            <span className="text-gray-600 dark:text-gray-400">{stat.subtext}</span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <Card className="bg-white dark:bg-[#1a1a1a] shadow-sm border-gray-200 dark:border-[#2a2a2a]">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                            Recent Tasks
                                        </CardTitle>
                                        <Button
                                            variant="link"
                                            className="text-blue-600 dark:text-blue-400 p-0 h-auto text-sm hover:underline"
                                            onClick={() => window.location.href = '/tasks'}
                                        >
                                            View All <ArrowRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {dashboardData?.recentTasks.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                            <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-sm">No recent tasks found</p>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="mt-4"
                                                onClick={() => window.location.href = '/tasks'}
                                            >
                                                Create Task
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {dashboardData?.recentTasks.slice(0, 5).map((task) => (
                                                <div
                                                    key={task.task_id}
                                                    className="flex items-center gap-4 p-4 border border-gray-200 dark:border-[#2a2a2a] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a]/50 transition-all cursor-pointer group"
                                                >
                                                    <div className="h-5 w-5 rounded border-2 border-gray-400 dark:border-gray-600 group-hover:border-primary cursor-pointer transition-colors" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                                            {task.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1.5">
                                                            <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                                {task.project?.name || 'No project'}
                                                            </span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getPriorityColor(task.priority)}`}>
                                                                {task.priority}
                                                            </span>
                                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(task.status)}`}>
                                                                {task.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                                                            <Calendar className="h-3.5 w-3.5" />
                                                            <span className="font-medium">{formatDueDate(task.due_date)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card className="bg-white dark:bg-[#1a1a1a] shadow-sm border-gray-200 dark:border-[#2a2a2a]">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                                        Upcoming Deadlines
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {dashboardData?.upcomingDeadlines.length === 0 ? (
                                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                                            <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                                            <p className="text-sm">No upcoming deadlines</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {dashboardData?.upcomingDeadlines.slice(0, 5).map((item) => {
                                                const daysLeft = item.due_date ? getDaysLeft(item.due_date) : 0;
                                                const isUrgent = daysLeft <= 1;

                                                return (
                                                    <div key={item.task_id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a]/50 transition-colors">
                                                        <div className="mt-1">
                                                            <div className={`h-6 w-6 rounded-full flex items-center justify-center ${isUrgent
                                                                ? 'bg-red-100 dark:bg-red-900/20'
                                                                : 'bg-orange-100 dark:bg-orange-900/20'
                                                                }`}>
                                                                <AlertCircle className={`h-3.5 w-3.5 ${isUrgent
                                                                    ? 'text-red-600 dark:text-red-400'
                                                                    : 'text-orange-600 dark:text-orange-400'
                                                                    }`} />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <p className="text-sm font-semibold text-gray-900 dark:text-white leading-snug">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                                {item.project?.name || 'No project'}
                                                            </p>
                                                            <div className="flex items-center gap-2 pt-1">
                                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                    {item.due_date ? format(parseISO(item.due_date), 'MMM dd, yyyy') : 'No date'}
                                                                </span>
                                                                {item.due_date && (
                                                                    <span className={`text-xs font-semibold ${isUrgent
                                                                        ? 'text-red-600 dark:text-red-400'
                                                                        : 'text-orange-600 dark:text-orange-400'
                                                                        }`}>
                                                                        {daysLeft === 0
                                                                            ? 'Today'
                                                                            : daysLeft === 1
                                                                                ? '1 day left'
                                                                                : `${daysLeft} days left`
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};