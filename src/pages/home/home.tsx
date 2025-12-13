import { UserAvatar } from "@/components/common/avatar";
import { ProjectPriorityCommon } from "@/components/common/projectPriorityCommon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    AlertCircle,
    ArrowRight,
    Calendar,
    Check,
    CheckCircle2,
    Clock,
    GitBranch,
    House,
    ListTodo,
    Package,
    PackagePlus,
    TrendingUp,
    Users
} from "lucide-react";
import { Link } from "react-router";

export const Home = () => {
    const statsData = {
        totalProjects: 12,
        activeTasks: 34,
        completedTasks: 156,
        teamMembers: 8
    };
    const recentTasks = [
        {
            id: 1,
            name: "Design homepage mockups",
            project: "E-Commerce Platform",
            status: "In progress",
            priority: "High",
            dueDate: "Nov 25",
            assignee: { name: "Jane Doe", image: "", initials: "JD" }
        },
        {
            id: 2,
            name: "API integration testing",
            project: "Mobile App Development",
            status: "In progress",
            priority: "Medium",
            dueDate: "Nov 24",
            assignee: { name: "John Doe", image: "", initials: "JD" }
        },
        {
            id: 3,
            name: "Content review and approval",
            project: "Marketing Campaign Q4",
            status: "Review",
            priority: "Low",
            dueDate: "Nov 26",
            assignee: { name: "Sarah Miller", image: "", initials: "SM" }
        },
        {
            id: 4,
            name: "Database optimization",
            project: "E-Commerce Platform",
            status: "To do",
            priority: "Medium",
            dueDate: "Nov 28",
            assignee: { name: "Mike Wilson", image: "", initials: "MW" }
        }
    ];

    const upcomingDeadlines = [
        { task: "Homepage redesign review", project: "E-Commerce Platform", dueDate: "Nov 24, 2025", daysLeft: 1 },
        { task: "API documentation", project: "Mobile App Development", dueDate: "Nov 25, 2025", daysLeft: 2 },
        { task: "Client presentation", project: "Marketing Campaign Q4", dueDate: "Nov 27, 2025", daysLeft: 4 }
    ];

    const recentActivity = [
        { action: "Task 'Design homepage' completed", user: "Jane Doe", time: "2 hours ago" },
        { action: "New comment on 'API Integration'", user: "John Doe", time: "4 hours ago" },
        { action: "Project 'Marketing Q4' status updated", user: "Sarah Miller", time: "5 hours ago" },
        { action: "File uploaded to 'E-Commerce Platform'", user: "Mike Wilson", time: "Yesterday" }
    ];

    return (

        <>
            {recentTasks.length == 0 ? <div className="flex flex-col items-center justify-center min-h-[700px] px-4">
                <h2 className="text-2xl font-bold mb-8 text-center">Getting Started with Your Project</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 w-full max-w-3xl">

                    <div className="flex flex-col p-6 border rounded-xl shadow-xs dark:bg-[#282828]  transition-shadow bg-white ">
                        <div className="flex items-center mb-4 gap-3">
                            <div className=" flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <Package className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-lg">1. Create Project</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Add and organize tasks for your projects. Keep track of progress easily.
                        </p>
                    </div>
                    <div className="flex flex-col p-6 border rounded-xl shadow-xs dark:bg-[#282828]   transition-shadow bg-white ">
                        <div className="flex items-center mb-4 gap-3">
                            <div className=" flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <ListTodo className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-lg">2. Create Tasks</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Add and organize tasks for your projects. Keep track of progress easily.
                        </p>
                    </div>

                    {/* Step 2: Calendar */}
                    <div className="flex flex-col p-6 border rounded-xl dark:bg-[#282828]  shadow-xs  transition-shadow bg-white ">
                        <div className="flex items-center mb-4 gap-3">
                            <div className=" flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <Calendar className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-lg">3. Plan Your Schedule</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Visualize deadlines and milestones with a calendar view to stay on track.
                        </p>
                    </div>

                    {/* Step 3: Project Flow */}
                    <div className="flex flex-col p-6 border rounded-xl dark:bg-[#282828]  shadow-xs  transition-shadow bg-white ">
                        <div className="flex items-center mb-4 gap-3">
                            <div className=" flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <GitBranch className="text-primary w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-lg">4. Define Workflow</h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Customize workflows and connect tasks to visualize project flow.
                        </p>
                    </div>
                </div>

                {/* CTA Button */}
                <Button
                    variant="outline"
                    className="mt-10 px-6 py-3 gap-2 text-sm font-medium  transition-colors"
                    onClick={() => { }}
                >
                    <Link className="text-xs" to={'/projects'}>
                        Start your project</Link>

                </Button>
            </div>
                :
                <div className="space-y-4">
                    <div className="w-full flex items-center justify-between  ">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <House className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight">Home</h1>
                                <p className="text-sm text-muted-foreground">Manage and organize your projects</p>
                            </div>
                        </div>
                        <Button variant={'outline'} className="gap-2 text-xs  " onClick={() => { }}>
                            <PackagePlus />
                            Create Project
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="shadow-none rounded-sm dark:bg-[#282828]">
                            <CardContent className="">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Total Projects</p>
                                        <p className="text-2xl font-bold mt-2">{statsData.totalProjects}</p>
                                    </div>
                                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                                        <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-3 text-xs text-green-600 dark:text-green-400">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>+12% from last month</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-none rounded-sm dark:bg-[#282828]">
                            <CardContent className="">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active Tasks</p>
                                        <p className="text-2xl font-bold mt-2">{statsData.activeTasks}</p>
                                    </div>
                                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                                        <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                                    <span>8 due this week</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-none rounded-sm dark:bg-[#282828]">
                            <CardContent className="">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Completed</p>
                                        <p className="text-2xl font-bold mt-2">{statsData.completedTasks}</p>
                                    </div>
                                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/20">
                                        <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-3 text-xs text-green-600 dark:text-green-400">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>+8% efficiency</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="shadow-none rounded-sm dark:bg-[#282828]">
                            <CardContent className="">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Team Members</p>
                                        <p className="text-2xl font-bold mt-2">{statsData.teamMembers}</p>
                                    </div>
                                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                                        <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                                    <span>2 new this month</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-6">

                            <Card className="shadow-none rounded-sm dark:bg-[#282828]">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-base font-semibold">Recent Tasks</CardTitle>
                                        <Button variant="link" className="text-primary p-0 h-auto text-sm">
                                            View All <ArrowRight className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recentTasks.map((task) => (
                                            <div key={task.id} className="flex items-center gap-3 p-3 border rounded-sm hover:bg-accent/50 transition-colors">
                                                <div className="h-5 w-5 rounded border-2 border-muted-foreground/30 hover:border-primary cursor-pointer" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{task.name}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-xs text-muted-foreground">{task.project}</span>
                                                        <ProjectPriorityCommon priority={'High'} />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>{task.dueDate}</span>
                                                    </div>
                                                    <UserAvatar
                                                        name={task.assignee.name}
                                                        image={task.assignee.image}
                                                        size="sm"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Deadlines & Activity */}
                        <div className="space-y-6">
                            {/* Upcoming Deadlines */}
                            <Card className="shadow-none rounded-sm dark:bg-[#282828]">
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold">Upcoming Deadlines</CardTitle>
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
                                                    <p className="text-sm font-medium">{item.task}</p>
                                                    <p className="text-xs text-muted-foreground">{item.project}</p>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-muted-foreground">{item.dueDate}</span>
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

                            {/* Recent Activity */}
                            <Card className="shadow-none rounded-sm dark:bg-[#282828]">
                                <CardHeader>
                                    <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {recentActivity.map((activity, index) => (
                                            <div key={index} className="flex items-start gap-3">
                                                <div className="mt-1">
                                                    <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                                                        <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                                                    </div>
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm">{activity.action}</p>
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-xs font-medium text-muted-foreground">{activity.user}</p>
                                                        <span className="text-xs text-muted-foreground">•</span>
                                                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <Button variant="link" className="text-primary p-0 h-auto text-sm w-full justify-start">
                                            View All Activity
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>}


        </>
    );
};