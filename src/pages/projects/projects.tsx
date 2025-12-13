import { CommonTable, ProjectPriorityCommon, ProjectStatusCommon, type PriorityType, type StatusType } from "@/components";
import { AvatarGroup } from "@/components/common/avatarCommon";
import { CircularProgress } from "@/components/common/cicularProgress";
import { CommonDialog } from "@/components/common/commonDialog";
import { CommonDialogFooter } from "@/components/common/commonDialogFooter";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, CircleArrowOutUpRight, Edit, Loader2, PackageCheck, PackagePlus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
    useCreateProjectMutation,
    useDeleteProjectMutation,
    useGetAllProjectsQuery,
    useUpdateProjectMutation,
    type Project as ApiProject,
} from "../../features/projectsApi";
import { Navigate, useNavigate } from "react-router";

export interface Project {
    id: string;
    name: string;
    description: string;
    status: StatusType;
    priority: PriorityType;
    progress: number;
    dueDate: string;
    members: Array<{ name: string; avatar?: string }>;
    teamMembers?: string;
    dateRange?: {
        from: Date | undefined;
        to: Date | undefined;
    };
}

interface FormData {
    name: string;
    description: string;
    status: StatusType;
    priority: PriorityType;
    teamMembers: string;
    dateRange: {
        from: Date | undefined;
        to: Date | undefined;
    };
}

const initialFormData: FormData = {
    name: "",
    description: "",
    status: "Pending",
    priority: "Medium",
    teamMembers: "",
    dateRange: {
        from: undefined,
        to: undefined,
    },
};

// Map API status to UI status
const mapApiStatusToUI = (apiStatus: ApiProject["status"]): StatusType => {
    const statusMap: Record<ApiProject["status"], StatusType> = {
        pending: "Pending",
        in_review: "In review",
        in_progress: "In progress",
        submitted: "Submitted",
        success: "Success",
    };
    return statusMap[apiStatus];
};

// Map UI status to API status
const mapUIStatusToApi = (uiStatus: StatusType): ApiProject["status"] => {
    const statusMap: Record<StatusType, ApiProject["status"]> = {
        "Pending": "pending",
        "In review": "in_review",
        "In progress": "in_progress",
        "Submitted": "submitted",
        "Success": "success",
        "Planning": "pending",
    };
    return statusMap[uiStatus];
};

// Map API priority to UI priority
const mapApiPriorityToUI = (apiPriority: ApiProject["priority"]): PriorityType => {
    const priorityMap: Record<ApiProject["priority"], PriorityType> = {
        low: "Low",
        medium: "Medium",
        high: "High",
        critical: "Critical",
    };
    return priorityMap[apiPriority];
};

// Map UI priority to API priority
const mapUIPriorityToApi = (uiPriority: PriorityType): ApiProject["priority"] => {
    const priorityMap: Record<PriorityType, ApiProject["priority"]> = {
        "Low": "low",
        "Medium": "medium",
        "High": "high",
        "Critical": "critical",
    };
    return priorityMap[uiPriority];
};

// Calculate progress based on dates
const calculateProgress = (startDate: string, endDate: string): number => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();

    if (now < start) return 0;
    if (now > end) return 100;

    const total = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / total) * 100);
};

// Format date
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

// ProjectForm component
interface ProjectFormProps {
    formData: FormData;
    setFormData: React.Dispatch<React.SetStateAction<FormData>>;
    isCalendarOpen: boolean;
    setIsCalendarOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isCreating: boolean;
    isUpdating: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
    formData,
    setFormData,
    isCalendarOpen,
    setIsCalendarOpen,
    isCreating,
    isUpdating,
}) => (
    <div className="grid grid-cols-2 gap-5 border dark:bg-[#333333] rounded-sm p-6">
        {/* Row 1 - Name */}
        <div className="space-y-1.5">
            <Label className="text-xs font-medium dark:text-slate-200 text-gray-700">
                Project Name
            </Label>
            <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                className="h-8 text-sm rounded-sm"
                disabled={isCreating || isUpdating}
                autoComplete="off"
            />
        </div>

        {/* Row 1 - Team Members */}
        <div className="space-y-1.5">
            <Label className="text-xs font-medium dark:text-slate-200 text-gray-700">
                Team Members
            </Label>
            <Input
                value={formData.teamMembers}
                onChange={(e) => setFormData({ ...formData, teamMembers: e.target.value })}
                placeholder="Add team members"
                className="h-8 text-sm rounded-sm"
                disabled={isCreating || isUpdating}
                autoComplete="off"
            />
        </div>

        <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700 dark:text-slate-200">
                    Status
                </Label>
                <Select
                    value={formData.status}
                    onValueChange={(value) =>
                        setFormData({ ...formData, status: value as StatusType })
                    }
                    disabled={isCreating || isUpdating}
                >
                    <SelectTrigger className="w-full h-8 text-xs rounded-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-sm rounded-sm">
                        <SelectItem value="Planning">
                            <ProjectStatusCommon status="Pending" />
                        </SelectItem>
                        <SelectItem value="In progress">
                            <ProjectStatusCommon status="In progress" />
                        </SelectItem>
                        <SelectItem value="In review">
                            <ProjectStatusCommon status="In review" />
                        </SelectItem>
                        <SelectItem value="Pending">
                            <ProjectStatusCommon status="Pending" />
                        </SelectItem>
                        <SelectItem value="Submitted">
                            <ProjectStatusCommon status="Submitted" />
                        </SelectItem>
                        <SelectItem value="Success">
                            <ProjectStatusCommon status="Success" />
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5">
                <Label className="text-xs font-medium text-gray-700 dark:text-slate-200">
                    Priority
                </Label>
                <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                        setFormData({ ...formData, priority: value as PriorityType })
                    }
                    disabled={isCreating || isUpdating}
                >
                    <SelectTrigger className="w-full h-8 text-xs rounded-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="text-sm rounded-sm">
                        <SelectItem value="High">
                            <ProjectPriorityCommon priority="High" />
                        </SelectItem>
                        <SelectItem value="Low">
                            <ProjectPriorityCommon priority="Low" />
                        </SelectItem>
                        <SelectItem value="Medium">
                            <ProjectPriorityCommon priority="Medium" />
                        </SelectItem>
                        <SelectItem value="Critical">
                            <ProjectPriorityCommon priority="Critical" />
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Row 2 - RIGHT SECTION (Date Range) */}
        <div className="space-y-1.5">
            <Label className="text-xs font-medium text-gray-700 dark:text-slate-200">
                Project Duration
            </Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className="w-full h-8 justify-start text-left text-sm font-normal"
                        disabled={isCreating || isUpdating}
                        type="button"
                    >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                        {formData.dateRange.from ? (
                            formData.dateRange.to ? (
                                <>
                                    {format(formData.dateRange.from, "LLL dd, y")} -{" "}
                                    {format(formData.dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(formData.dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span className="text-gray-500">Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start" sideOffset={5}>
                    <Calendar
                        mode="range"
                        selected={formData.dateRange}
                        onSelect={(range) => {
                            setFormData({
                                ...formData,
                                dateRange: range || { from: undefined, to: undefined },
                            });
                            if (range?.from && range?.to) {
                                setIsCalendarOpen(false);
                            }
                        }}
                        numberOfMonths={2}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>
        </div>

        {/* Row 3 - Description full width */}
        <div className="col-span-2 space-y-1.5">
            <Label className="text-xs font-medium text-gray-700 dark:text-slate-200">
                Description
            </Label>
            <Textarea
                value={formData.description}
                onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter project description"
                className="min-h-30 text-sm resize-none rounded-sm"
                disabled={isCreating || isUpdating}
            />
        </div>
    </div>
);

export const Projects = () => {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const navigate = useNavigate()

    // API hooks
    const { data: apiProjects, isLoading, error } = useGetAllProjectsQuery();
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
    const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
    const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

    // Transform API projects to UI projects
    useEffect(() => {
        if (apiProjects) {
            const transformedProjects: Project[] = apiProjects.map((apiProject) => ({
                id: apiProject.project_id.toString(),
                name: apiProject.name,
                description: apiProject.description || "",
                status: mapApiStatusToUI(apiProject.status),
                priority: mapApiPriorityToUI(apiProject.priority),
                progress: calculateProgress(apiProject.start_date, apiProject.end_date),
                dueDate: formatDate(apiProject.end_date),
                members: [],
                teamMembers: "",
                dateRange: {
                    from: new Date(apiProject.start_date),
                    to: new Date(apiProject.end_date),
                },
            }));
            setProjects(transformedProjects);
        }
    }, [apiProjects]);

    const resetForm = () => {
        setFormData(initialFormData);
        setSelectedProject(null);
        setIsCalendarOpen(false);
    };

    const handleAddProject = async () => {
        if (!formData.name.trim()) {
            toast.error("Project name is required");
            return;
        }

        if (!formData.dateRange.from || !formData.dateRange.to) {
            toast.error("Please select project duration (start and end dates)");
            return;
        }

        try {
            const currentUserId = Number(localStorage.getItem("userId"));

            if (!currentUserId) {
                toast.error("User not logged in. Please log in first.");
                return;
            }

            // Close dialog immediately for optimistic update
            setIsAddDialogOpen(false);
            resetForm();

            const result = await createProject({
                name: formData.name.trim(),
                description: formData.description.trim() || "",
                status: mapUIStatusToApi(formData.status),
                priority: mapUIPriorityToApi(formData.priority),
                start_date: formData.dateRange.from.toISOString().split("T")[0],
                end_date: formData.dateRange.to.toISOString().split("T")[0],
                owner_id: currentUserId,
            }).unwrap();

            toast.success("Project created successfully");
            console.log("Project created successfully:", result);
        } catch (err: any) {
            console.error("Failed to create project:", err);
            const errorMessage = err?.data?.message || err?.message || "Failed to create project. Please try again.";
            toast.error(errorMessage);
        }
    };

    const handleEditClick = (project: Project) => {
        setSelectedProject(project);
        setFormData({
            name: project.name,
            description: project.description,
            status: project.status,
            priority: project.priority,
            teamMembers: project.teamMembers || "",
            dateRange: {
                from: project.dateRange?.from,
                to: project.dateRange?.to,
            },
        });
        setIsEditDialogOpen(true);
    };

    const handleRowClick = (project: Project) => {
        console.log("Row clicked:", project);
    };

    const handleUpdateProject = async () => {
        if (!selectedProject) {
            toast.error("No project selected");
            return;
        }

        if (!formData.name.trim()) {
            toast.error("Project name is required");
            return;
        }

        if (!formData.dateRange.from || !formData.dateRange.to) {
            toast.error("Please select project duration (start and end dates)");
            return;
        }

        try {
            // Close dialog immediately for optimistic update
            setIsEditDialogOpen(false);
            resetForm();

            const result = await updateProject({
                project_id: Number(selectedProject.id),
                name: formData.name.trim(),
                description: formData.description.trim() || "",
                status: mapUIStatusToApi(formData.status),
                priority: mapUIPriorityToApi(formData.priority),
                start_date: formData.dateRange.from.toISOString().split("T")[0],
                end_date: formData.dateRange.to.toISOString().split("T")[0],
            }).unwrap();

            toast.success("Project updated successfully");
            console.log("Project updated successfully:", result);
        } catch (err: any) {
            console.error("Failed to update project:", err);
            const errorMessage = err?.data?.message || err?.message || "Failed to update project. Please try again.";
            toast.error(errorMessage);
        }
    };

    const handleDeleteClick = (project: Project) => {
        setSelectedProject(project);
        setIsDeleteDialogOpen(true);
    };

    const handleDeleteProject = async () => {
        if (!selectedProject) {
            toast.error("No project selected");
            return;
        }

        try {
            // Close dialog immediately for optimistic update
            setIsDeleteDialogOpen(false);
            const projectName = selectedProject.name;
            setSelectedProject(null);

            await deleteProject(Number(selectedProject.id)).unwrap();

            toast.success(`Project "${projectName}" deleted successfully`);
            console.log("Project deleted successfully");
        } catch (err: any) {
            console.error("Failed to delete project:", err);
            const errorMessage = err?.data?.message || err?.message || "Failed to delete project. Please try again.";
            toast.error(errorMessage);
        }
    };

    // Reset form when dialogs open/close
    useEffect(() => {
        if (!isAddDialogOpen && !isEditDialogOpen) {
            // Small delay to ensure smooth animation
            const timer = setTimeout(() => {
                if (!isAddDialogOpen && !isEditDialogOpen) {
                    resetForm();
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isAddDialogOpen, isEditDialogOpen]);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[700px]">
                <div className="flex flex-col items-center space-y-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Loading projects...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[700px]">
                <div className="flex flex-col items-center max-w-md text-center space-y-4 px-6">
                    <div className="flex items-center justify-center p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                        <Trash2 className="h-10 w-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl text-zinc-800 dark:text-slate-200 font-semibold tracking-tight">
                        Error Loading Projects
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {error && typeof error === 'object' && 'message' in error
                            ? String(error.message)
                            : "Failed to load projects. Please try again."}
                    </p>
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            {projects.length === 0 ? (
                <div className="flex items-center justify-center min-h-[700px]">
                    <div className="flex flex-col items-center max-w-md text-center space-y-4 px-6">
                        <div className="flex items-center justify-center p-3 rounded-lg bg-primary/10">
                            <PackagePlus className="h-10 w-10 text-primary" />
                        </div>

                        <h2 className="text-2xl text-zinc-800 dark:text-slate-200 font-semibold tracking-tight">
                            Projects
                        </h2>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Projects are larger units of work with a clear outcome, such as a new
                            feature you want to ship. They can be shared across multiple teams and
                            are comprised of optional documents.
                        </p>

                        <div className="flex gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="gap-2 dark:text-white text-xs"
                                onClick={() => setIsAddDialogOpen(true)}
                            >
                                Create new project
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="w-full flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <PackagePlus className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h1 className="text-xl font-semibold tracking-tight">Projects</h1>
                                <p className="text-sm text-muted-foreground">
                                    Manage and organize your projects
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="gap-2 text-xs"
                            onClick={() => setIsAddDialogOpen(true)}
                        >
                            <PackagePlus />
                            Create Project
                        </Button>
                    </div>
                    <CommonTable<Project>
                        selectable
                        rowKey="id"
                        onRowClick={(row) => handleRowClick(row as Project)}
                        data={projects}
                        columns={[
                            {
                                key: "name",
                                header: "Project Name",
                                accessor: (row) => row.name,
                                sortable: true,
                            },
                            {
                                key: "status",
                                header: "Status",
                                accessor: (row) => <ProjectStatusCommon status={row.status} />,
                            },
                            {
                                key: "priority",
                                header: "Priority",
                                accessor: (row) => <ProjectPriorityCommon priority={row.priority} />,
                            },
                            {
                                key: "progress",
                                header: "Progress",
                                accessor: (row) => <CircularProgress value={row.progress} size="xs" />,
                            },
                            {
                                key: "dueDate",
                                header: "Due Date",
                                accessor: (row) => row.dueDate,
                            },
                            {
                                key: "members",
                                header: "Members",
                                accessor: (row) => <AvatarGroup members={row.members} max={3} size="sm" />,
                            },
                        ]}
                        actions={[
                            {
                                label: "View",
                                onClick: (row) => {
                                    // Navigate to the project page using its ID
                                    navigate(`/projects/${row.id}`);
                                },
                                icon: <CircleArrowOutUpRight className="h-4 w-4" />,
                            },
                            {
                                label: "Edit",
                                onClick: (row) => handleEditClick(row as Project),
                                icon: <Edit className="h-4 w-4" />,
                            },
                            {
                                label: "Delete",
                                onClick: (row) => handleDeleteClick(row as Project),
                                icon: <Trash2 className="h-4 w-4" />,
                            },

                        ]}
                    />
                </div>
            )}

            <CommonDialog
                className="min-w-[720px]"
                icon={<PackagePlus className="text-primary" size={35} />}
                note="Invite your team to review and Collaboration"
                open={isAddDialogOpen}
                onOpenChange={(open) => {
                    setIsAddDialogOpen(open);
                    if (!open) {
                        resetForm();
                    }
                }}
                title="Create New Project"
                size="sm"
                footer={
                    <CommonDialogFooter
                        info="Fill in the details to create a new project"
                        onCancel={() => {
                            setIsAddDialogOpen(false);
                            resetForm();
                        }}
                        onConfirm={handleAddProject}
                        cancelText="Cancel"
                    />
                }
            >
                <ProjectForm
                    formData={formData}
                    setFormData={setFormData}
                    isCalendarOpen={isCalendarOpen}
                    setIsCalendarOpen={setIsCalendarOpen}
                    isCreating={isCreating}
                    isUpdating={isUpdating}
                />
            </CommonDialog>

            <CommonDialog
                className="min-w-[720px]"
                icon={<PackageCheck className="text-primary" size={35} />}
                note="Invite your team to review and Collaboration"
                open={isEditDialogOpen}
                onOpenChange={(open) => {
                    setIsEditDialogOpen(open);
                    if (!open) {
                        resetForm();
                    }
                }}
                title="Update Project"
                size="lg"
                footer={
                    <CommonDialogFooter
                        onCancel={() => {
                            setIsEditDialogOpen(false);
                            resetForm();
                        }}
                        onConfirm={handleUpdateProject}
                        cancelText="Cancel"
                    />
                }
            >
                <ProjectForm
                    formData={formData}
                    setFormData={setFormData}
                    isCalendarOpen={isCalendarOpen}
                    setIsCalendarOpen={setIsCalendarOpen}
                    isCreating={isCreating}
                    isUpdating={isUpdating}
                />
            </CommonDialog>

            <CommonDialog
                icon={<Trash2 className="text-red-400" size={35} />}
                note="Invite your team to review and Collaboration"
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Delete Project"
                size="sm"
                footer={
                    <CommonDialogFooter
                        onCancel={() => {
                            setIsDeleteDialogOpen(false);
                            setSelectedProject(null);
                        }}
                        onConfirm={handleDeleteProject}
                        cancelText="Cancel"
                        confirmVariant="destructive"
                    />
                }
            >
                <p className="text-sm text-muted-foreground">
                    This action cannot be undone. The project{" "}
                    <strong className="text-red-400">{selectedProject?.name}</strong> and all associated
                    data will be permanently deleted.
                </p>
            </CommonDialog>
        </>
    );
};