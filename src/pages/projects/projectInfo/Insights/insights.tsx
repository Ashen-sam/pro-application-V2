import { UserAvatar } from "@/components/common/avatar";
import { CircularProgress } from "@/components/common/cicularProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Folders } from "lucide-react";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from "recharts";

// Mock Data
const teamMembers = [
    {
        id: "1",
        name: "Sarah Johnson",
        email: "sarah.j@company.com",
        tasksCompleted: 24,
        tasksInProgress: 3,
        tasksPending: 2,
        totalTasks: 29,
        workload: 85,
        image: ""
    },
    {
        id: "2",
        name: "Michael Chen",
        email: "michael.c@company.com",
        tasksCompleted: 18,
        tasksInProgress: 5,
        tasksPending: 1,
        totalTasks: 24,
        workload: 72,
        image: ""
    },
    {
        id: "3",
        name: "Emma Davis",
        email: "emma.d@company.com",
        tasksCompleted: 31,
        tasksInProgress: 2,
        tasksPending: 3,
        totalTasks: 36,
        workload: 92,
        image: ""
    },
    {
        id: "4",
        name: "James Wilson",
        email: "james.w@company.com",
        tasksCompleted: 15,
        tasksInProgress: 4,
        tasksPending: 2,
        totalTasks: 21,
        workload: 65,
        image: ""
    },
    {
        id: "5",
        name: "Olivia Martinez",
        email: "olivia.m@company.com",
        tasksCompleted: 22,
        tasksInProgress: 3,
        tasksPending: 4,
        totalTasks: 29,
        workload: 78,
        image: ""
    }
];

const taskDistributionData = [
    { name: "Completed", value: 110, color: "#22c55e" },
    { name: "In Progress", value: 17, color: "#3b82f6" },
    { name: "Pending", value: 12, color: "#f59e0b" }
];




export const Insights = () => {
    const totalTasks = teamMembers.reduce((sum, member) => sum + member.totalTasks, 0);
    const completedTasks = teamMembers.reduce((sum, member) => sum + member.tasksCompleted, 0);
    const overallProgress = Math.round((completedTasks / totalTasks) * 100);

    return (
        <div className="space-y-6">


            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">


                    {/* Team Member Workload */}
                    <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a]">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">
                                Team Member Workload
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {teamMembers.map((member) => (
                                    <div key={member.id} className="space-y-3 border-b pb-2  ">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center justify-between gap-3">
                                                <UserAvatar
                                                    name={member.name}
                                                    image={member.image}
                                                    size="sm"
                                                />
                                                <div className="text-xs">
                                                    {member.name}

                                                </div>
                                            </div>
                                            <div className="text-xs text-muted-foreground flex  justify-end gap-2">
                                                <div>
                                                    {member.totalTasks} tasks total
                                                </div>
                                                <Folders size={14} />
                                            </div>

                                            <div className="text-right">
                                                <CircularProgress value={member.workload} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column - Summary Cards */}
                <div className="space-y-6">
                    {/* Overall Task Status */}
                    <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a]">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">
                                Overall Task Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center mb-4">
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={taskDistributionData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {taskDistributionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-3">
                                {taskDistributionData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: item.color }}
                                            />
                                            <span className="text-sm">{item.name}</span>
                                        </div>
                                        <span className="text-sm font-semibold">{item.value}</span>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Overall Progress</span>
                                    <span className="font-semibold">{overallProgress}%</span>
                                </div>
                                <Progress value={overallProgress} className="h-1" />
                            </div>
                        </CardContent>
                    </Card>


                    {/* Top Performers */}
                    <Card className="shadow-none rounded-sm dark:bg-[#1a1a1a]">
                        <CardHeader>
                            <CardTitle className="text-base font-semibold">
                                Top Performers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {teamMembers
                                    .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
                                    .slice(0, 3)
                                    .map((member, index) => (
                                        <div key={member.id} className="flex items-center gap-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                                                {index + 1}
                                            </div>
                                            <UserAvatar
                                                name={member.name}
                                                image={member.image}
                                                size="sm"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{member.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {member.tasksCompleted} tasks completed
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};