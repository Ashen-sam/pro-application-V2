import { CommonDialog } from '@/components/common/commonDialog';
import { CommonDialogFooter } from '@/components/common/commonDialogFooter';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from '@/components/ui/card';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Box, Check, ChevronsUpDown, Edit, Eye, FolderArchive, FolderPlus, List, MoreVertical, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useListProjectsQuery } from '../../features/projectsApi';
import { SectionToolbar } from '@/components/common/SectionToolbar';

interface FlowProject {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'completed' | 'on-hold' | 'planning';
    startDate: string;
    dueDate: string;
    teamMembers: number;
    progress: number;
    projectId: number;
}

const statusColors = {
    active: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
    completed: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
    'on-hold': 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    planning: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
};

const normalizeStatus = (status?: string): 'active' | 'completed' | 'on-hold' | 'planning' => {
    if (!status) return 'planning';
    const normalized = status.toLowerCase();
    if (normalized === 'completed' || normalized === 'complete') return 'completed';
    if (normalized === 'active' || normalized === 'in-progress' || normalized === 'in progress') return 'active';
    if (normalized === 'on-hold' || normalized === 'on hold' || normalized === 'paused') return 'on-hold';
    return 'planning';
};

export const ProjectFlow = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [projects, setProjects] = useState<FlowProject[]>([]);
    const [flowName, setFlowName] = useState('');
    const [selectedProject, setSelectedProject] = useState<string>('');
    const [open, setOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'box' | 'list'>('box');

    const { data: apiProjects = [], isLoading, isError } = useListProjectsQuery();

    const handleDelete = (id: string) => {
        setProjects(projects.filter((p) => p.id !== id));
    };

    const handleSaveFlow = () => {
        if (flowName && selectedProject) {
            const apiProject = apiProjects.find(p => p.project_id.toString() === selectedProject);
            if (apiProject) {
                const newFlowProject: FlowProject = {
                    id: Date.now().toString(),
                    name: apiProject.name || 'Untitled Project',
                    description: apiProject.description || 'No description available',
                    status: normalizeStatus(apiProject.status),
                    startDate: apiProject.start_date || new Date().toISOString().split('T')[0],
                    dueDate: apiProject.end_date || new Date().toISOString().split('T')[0],
                    teamMembers: apiProject.memberEmails?.length || 0,
                    progress: apiProject.status?.toLowerCase() === 'completed' ? 100 :
                        apiProject.status?.toLowerCase() === 'active' ? 50 :
                            apiProject.status?.toLowerCase() === 'on-hold' ? 30 : 15,
                    projectId: apiProject.project_id
                };
                setProjects([...projects, newFlowProject]);
            }
            setIsAddDialogOpen(false);
            setFlowName('');
            setSelectedProject('');
        }
    };

    const handleCancel = () => {
        setIsAddDialogOpen(false);
        setFlowName('');
        setSelectedProject('');
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

                    <SectionToolbar
                        title="Manage and organize your projects"
                        subtitle="Manage projects efficiently"
                        icon={<FolderArchive size={18} />}
                        primaryDisabled={isLoading}
                        children={
                            <div className="flex items-center gap-2">
                                <Tabs value={viewMode} className='' onValueChange={(v) => setViewMode(v as 'box' | 'list')}>
                                    <TabsList className="h-9 bg-transparent" >
                                        <TabsTrigger value="box" className="gap-1.5 text-xs">
                                            <Box className="h-3.5 w-3.5" />
                                            Box
                                        </TabsTrigger>
                                        <TabsTrigger value="list" className="gap-1.5 text-xs">
                                            <List className="h-3.5 w-3.5" />
                                            List
                                        </TabsTrigger>
                                    </TabsList>
                                </Tabs>
                                <Button
                                    variant="outline"
                                    className="gap-2 text-xs bg-transparent hover:bg-gray-800"
                                    onClick={() => setIsAddDialogOpen(true)}
                                >
                                    <FolderPlus size={16} />
                                    Flow
                                </Button>
                            </div>
                        }
                    />

                    {viewMode === 'box' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {projects.map((project) => (
                                <Card
                                    key={project.id}
                                    className="hover:shadow-sm shadow-xs transition-shadow  relative overflow-hidden"
                                >
                                    {/* Grid Pattern Background with Gradient Mask */}
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            backgroundImage: `
      radial-gradient(currentColor 0.8px, transparent 0.8px)
    `,
                                            backgroundSize: '10px 10px',
                                            opacity: 0.06,
                                            maskImage: 'radial-gradient(ellipse at center, transparent 25%, black 75%)',
                                            WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 25%, black 75%)'
                                        }}
                                    />

                                    {/* Content with relative positioning to appear above pattern */}
                                    <CardHeader className="relative">
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
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
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
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {projects.map((project) => (
                                <Card key={project.id} className="hover:shadow-sm p-3 shadow-xs transition-shadow dark:bg-[#1a1a1a]">
                                    <CardHeader className="">
                                        <div className="flex items-center justify-between gap-4"
                                        >
                                            <div className="flex items-center gap-4 flex-1 min-w-0">
                                                <div className="space-y-1 flex-1 min-w-0">
                                                    <CardTitle className="text-base">{project.name}</CardTitle>
                                                    <CardDescription className="line-clamp-1 text-xs">
                                                        {project.description}
                                                    </CardDescription>
                                                </div>
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
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem className="gap-2">
                                                        <Eye className="h-4 w-4" />
                                                        View
                                                    </DropdownMenuItem>
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
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            )}

            <CommonDialog
                className="min-w-[500px]"
                icon={<FolderArchive size={20} className="text-primary" />}
                note="Add a new project flow to your workspace"
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                title="Create New Flow"
                size="sm"
                footer={
                    <CommonDialogFooter
                        onCancel={handleCancel}
                        onConfirm={handleSaveFlow}
                        cancelText="Cancel"
                        confirmText="Save Flow"
                        confirmDisabled={!flowName || !selectedProject}
                    />
                }
            >
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="flowName" className="text-sm font-medium">
                            Flow Name
                        </Label>
                        <Input
                            id="flowName"
                            value={flowName}
                            onChange={(e) => setFlowName(e.target.value)}
                            placeholder="Enter project flow name"
                            className="text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-sm font-medium">
                            Select Project
                        </Label>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    size={'lg'}
                                    aria-expanded={open}
                                    className="w-full justify-between text-xs p-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Loading projects..." :
                                        isError ? "Error loading projects" :
                                            selectedProject
                                                ? apiProjects.find((project) => project.project_id.toString() === selectedProject)?.name
                                                : "Search and select project..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[456px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search project..." className="text-sm" />
                                    <CommandEmpty>
                                        {isLoading ? "Loading..." : isError ? "Error loading projects" : "No project found."}
                                    </CommandEmpty>
                                    <CommandGroup className="max-h-64 overflow-auto">
                                        {apiProjects.map((project) => (
                                            <CommandItem
                                                key={project.project_id}
                                                value={project.name || `Project ${project.project_id}`}
                                                onSelect={() => {
                                                    setSelectedProject(project.project_id.toString());
                                                    setOpen(false);
                                                }}
                                                className="text-sm"
                                            >
                                                <Check
                                                    className={`mr-2 h-4 w-4 ${selectedProject === project.project_id.toString() ? "opacity-100" : "opacity-0"
                                                        }`}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{project.name || 'Untitled Project'}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {project.description || 'No description'}
                                                    </span>
                                                </div>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </CommonDialog>
        </>
    );
}