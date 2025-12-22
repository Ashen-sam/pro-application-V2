import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertCircle,
    ArrowRight,
    Bolt,
    Calendar,
    CheckCircle2,
    FolderOpen,
    Package,
    TrendingUp,
    Users,
    ListTodo,
    GitBranch,
    Folders
} from "lucide-react";

export const Home = () => {
    const statsData = [
        {
            label: "Total Projects",
            value: 12,
            icon: Package,
            iconBg: "bg-blue-100 dark:bg-blue-900/20",
            iconColor: "text-blue-600 dark:text-blue-400",
            trend: "+12% from last month",
            trendPositive: true
        },
        {
            label: "Completed",
            value: 156,
            icon: CheckCircle2,
            iconBg: "bg-green-100 dark:bg-green-900/20",
            iconColor: "text-green-600 dark:text-green-400",
            trend: "+8% efficiency",
            trendPositive: true
        },
        {
            label: "Team Members",
            value: 8,
            icon: Users,
            iconBg: "bg-purple-100 dark:bg-purple-900/20",
            iconColor: "text-purple-600 dark:text-purple-400",
            subtext: "2 new this month",
            trendPositive: false
        }
    ];

    const recentTasks = [
        {
            id: 1,
            name: "Design homepage mockups",
            project: "E-Commerce Platform",
            status: "In progress",
            priority: "High",
            dueDate: "Nov 25",
            assignee: { name: "Jane Doe", initials: "JD" }
        },
        {
            id: 2,
            name: "API integration testing",
            project: "Mobile App Development",
            status: "In progress",
            priority: "Medium",
            dueDate: "Nov 24",
            assignee: { name: "John Doe", initials: "JD" }
        },
        {
            id: 3,
            name: "Content review and approval",
            project: "Marketing Campaign Q4",
            status: "Review",
            priority: "Low",
            dueDate: "Nov 26",
            assignee: { name: "Sarah Miller", initials: "SM" }
        },
        {
            id: 4,
            name: "Database optimization",
            project: "E-Commerce Platform",
            status: "To do",
            priority: "Medium",
            dueDate: "Nov 28",
            assignee: { name: "Mike Wilson", initials: "MW" }
        }
    ];

    const upcomingDeadlines = [
        { task: "Homepage redesign review", project: "E-Commerce Platform", dueDate: "Nov 24, 2025", daysLeft: 1 },
        { task: "API documentation", project: "Mobile App Development", dueDate: "Nov 25, 2025", daysLeft: 2 },
        { task: "Client presentation", project: "Marketing Campaign Q4", dueDate: "Nov 27, 2025", daysLeft: 4 }
    ];

    const getPriorityColor = (priority) => {
        switch (priority.toLowerCase()) {
            case 'high': return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
            case 'medium': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20';
            case 'low': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
            default: return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
        }
    };

    return (
        <div className="bg-gray-50 bg-transparent text-gray-900 dark:text-white">


            {recentTasks.length !== 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[600px] px-4">
                    <h2 className="text-2xl font-bold mb-8 text-center">Getting Started with Your Project</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 w-full max-w-3xl">
                        <div className="flex flex-col p-6 border rounded-xl shadow-xs dark:bg-[#1a1a1a] transition-shadow bg-white">
                            <div className="flex relative items-center mb-4 gap-3">
                                <div className="absolute h-20 w-20 rounded-full bg-primary/80 blur-3xl">
                                    <Package className="text-primary " />
                                </div>
                                <h3 className="font-semibold text-lg">1. Create Project</h3>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                                Add and organize tasks for your projects. Keep track of progress easily.
                            </div>
                        </div>

                        <div className="flex flex-col p-6 border rounded-xl shadow-xs dark:bg-[#1a1a1a] transition-shadow bg-white">
                            <div className="flex items-center mb-4 gap-3">

                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                    <Folders className="text-primary " />

                                </div>
                                <h3 className="font-semibold text-lg">2. Create Tasks</h3>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-300">
                                Add and organize tasks for your projects. Keep track of progress easily.
                            </div>
                        </div>

                        <div className="flex flex-col p-6 border rounded-xl dark:bg-[#1a1a1a] shadow-xs transition-shadow bg-white">
                            <div className="flex items-center mb-4 gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                    <Calendar className="text-primary " />
                                </div>
                                <h3 className="font-semibold text-lg">3. Plan Your Schedule</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Visualize deadlines and milestones with a calendar view to stay on track.
                            </p>
                        </div>

                        <div className="flex relative flex-col p-6 border rounded-xl dark:bg-[#1a1a1a] shadow-xs transition-shadow bg-white">
                            <div className="flex items-center mb-4 gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                    <GitBranch className="text-primary " />
                                </div>
                                <h3 className="font-semibold text-lg">4. Define Workflow</h3>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                                Customize workflows and connect tasks to visualize project flow.
                            </p>
                            <div className="absolute  h-20 w-20 rounded-full bg-primary/50 blur-3xl"></div>

                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="mt-10 px-6 py-3 gap-2 text-sm font-medium transition-colors"
                        onClick={() => {
                            // Navigate to projects page
                            window.location.href = '/projects';
                        }}
                    >
                        Start your project
                    </Button>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto space-y-3 ">
                    <div className="w-full flex items-center justify-between px-4 py-3 bg-primary/10 rounded-lg border border-primary/12">
                        <div className="flex gap-3">
                            <div className="flex mt-px justify-center rounded-lg">
                                <Bolt size={18} className="text-primary" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-xs font-medium text-white">
                                    Manage and organize your projects
                                </div>
                                <div className="text-xs font-medium text-gray-400">
                                    Manage projects efficiently
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                        {statsData.map((stat, index) => (
                            <Card key={index} className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a]">
                                <CardContent className="">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{stat.label}</p>
                                            <p className="text-2xl font-bold mt-2 text-gray-900 dark:text-white">{stat.value}</p>
                                        </div>
                                        <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${stat.iconBg}`}>
                                            <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mt-3 text-xs">
                                        {stat.trend ? (
                                            <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
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
                            <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a]">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Recent Tasks</CardTitle>
                                        <Button variant="link" className="text-blue-600 dark:text-blue-400 p-0 h-auto text-sm">
                                            View All <ArrowRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recentTasks.map((task) => (
                                            <div key={task.id} className="flex items-center gap-3 p-3 border border-gray-200 dark:border-[#2a2a2a] rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a]/50 transition-colors">
                                                <div className="h-5 w-5 rounded border-2 border-gray-400 dark:border-gray-600 hover:border-blue-500 cursor-pointer" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{task.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-gray-600 dark:text-gray-400">{task.project}</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{task.dueDate}</span>
                                                    </div>
                                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-semibold text-white">
                                                        {task.assignee.initials}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card className="bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a]">
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-white">Upcoming Deadlines</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {upcomingDeadlines.map((item, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    <div className={`h-5 w-5 rounded-full flex items-center justify-center ${item.daysLeft <= 1 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-orange-100 dark:bg-orange-900/20'
                                                        }`}>
                                                        <AlertCircle className={`h-3 w-3 ${item.daysLeft <= 1 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
                                                            }`} />
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.task}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">{item.project}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-gray-600 dark:text-gray-400">{item.dueDate}</span>
                                                        <span className={`text-xs font-medium ${item.daysLeft <= 1 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'
                                                            }`}>
                                                            {item.daysLeft} day{item.daysLeft !== 1 ? 's' : ''} left
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};