import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, FolderArchive, FolderPlus, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Project {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'completed' | 'on-hold' | 'planning';
    startDate: string;
    dueDate: string;
    teamMembers: number;
    progress: number;
}

const sampleProjects: Project[] = [
    {
        id: '1',
        name: 'E-Commerce Platform',
        description: 'Building a modern e-commerce platform with React and Node.js',
        status: 'active',
        startDate: '2024-01-15',
        dueDate: '2024-06-30',
        teamMembers: 5,
        progress: 65,
    },
    {
        id: '2',
        name: 'Mobile App Development',
        description: 'Cross-platform mobile application for task management',
        status: 'active',
        startDate: '2024-02-01',
        dueDate: '2024-08-15',
        teamMembers: 3,
        progress: 40,
    },
    {
        id: '3',
        name: 'Marketing Website',
        description: 'Corporate website redesign with modern UI/UX',
        status: 'completed',
        startDate: '2023-11-01',
        dueDate: '2024-01-31',
        teamMembers: 4,
        progress: 100,
    },
    {
        id: '4',
        name: 'AI Integration',
        description: 'Implementing AI-powered features for customer support',
        status: 'planning',
        startDate: '2024-04-01',
        dueDate: '2024-12-31',
        teamMembers: 6,
        progress: 15,
    },
    {
        id: '5',
        name: 'Dashboard Analytics',
        description: 'Real-time analytics dashboard for business intelligence',
        status: 'on-hold',
        startDate: '2024-03-01',
        dueDate: '2024-09-30',
        teamMembers: 2,
        progress: 30,
    },
];

const statusColors = {
    active: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    completed: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
    'on-hold': 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    planning: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
};

export const ProjectFlow = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);

    const handleDelete = (id: string) => {
        setProjects(projects.filter((p) => p.id !== id));
    };

    return (
        <>
            {projects.length === 0 ? (
                <div className="flex items-center justify-center min-h-[700px]">
                    <div className="flex flex-col items-center max-w-md text-center space-y-4 px-6">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute h-20 w-20 rounded-full bg-primary/80 blur-3xl"></div>
                            <FolderArchive className="h-10 w-10 text-primary" />
                        </div>

                        <div className="text-2xl text-zinc-800 dark:text-slate-200 font-semibold tracking-tight">
                            Project Flow
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Visualize and manage your project workflows with interactive flow diagrams.
                            Create nodes, connect processes, and track dependencies across your projects.
                        </p>

                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="gap-2 dark:text-white text-xs"
                                onClick={() => setIsAddDialogOpen(true)}
                            >
                                Create new flow
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="w-full flex items-center justify-between px-4 py-3 bg-primary/10 rounded-lg border border-primary/12">
                        <div className="flex gap-3">
                            <div className="flex mt-px justify-center rounded-lg">
                                <FolderArchive size={18} className="text-primary" />
                            </div>
                            <div className="flex flex-col gap-1">
                                <div className="text-xs font-medium text-gray-900 dark:text-slate-200">
                                    Manage and organize your project flows ({projects.length})
                                </div>
                                <div className="text-xs font-medium text-gray-400">
                                    Visualize project workflows efficiently
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="gap-2 text-xs bg-transparent hover:bg-gray-800"
                                onClick={() => setIsAddDialogOpen(true)}
                            >
                                <FolderPlus size={16} />
                                Flow
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {projects.map((project) => (
                            <Card key={project.id} className="hover:shadow-sm shadow-xs transition-shadow dark:bg-[#1a1a1a]">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1 flex-1">
                                            <CardTitle className="text-lg">{project.name}</CardTitle>
                                            <Badge
                                                variant="secondary"
                                                className={statusColors[project.status]}
                                            >
                                                {project.status.charAt(0).toUpperCase() +
                                                    project.status.slice(1).replace('-', ' ')}
                                            </Badge>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem className="gap-2">
                                                    <Edit className="h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="gap-2 text-destructive"
                                                    onClick={() => handleDelete(project.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <CardDescription className="line-clamp-2">
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}