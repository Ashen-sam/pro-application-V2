import { useState, useEffect } from "react";
import {
  useGetAllProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  type Project as ApiProject,
} from "@/features/projects/projectsApi";
import type { PriorityType, StatusType } from "@/components";

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
    Pending: "pending",
    "In review": "in_review",
    "In progress": "in_progress",
    Submitted: "submitted",
    Success: "success",
    Planning: "pending", // Map Planning to pending
  };
  return statusMap[uiStatus];
};

// Map API priority to UI priority
const mapApiPriorityToUI = (
  apiPriority: ApiProject["priority"]
): PriorityType => {
  const priorityMap: Record<ApiProject["priority"], PriorityType> = {
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
  };
  return priorityMap[apiPriority];
};

// Map UI priority to API priority
const mapUIPriorityToApi = (
  uiPriority: PriorityType
): ApiProject["priority"] => {
  const priorityMap: Record<PriorityType, ApiProject["priority"]> = {
    Low: "low",
    Medium: "medium",
    High: "high",
    Critical: "critical",
  };
  return priorityMap[uiPriority];
};

// Calculate progress based on tasks (placeholder - you'll need task data)
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

export const useProjects = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [projects, setProjects] = useState<Project[]>([]);

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
        members: [], // You'll need to fetch members separately or join in the query
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
  };

  const handleAddProject = async () => {
    if (
      !formData.name.trim() ||
      !formData.dateRange.from ||
      !formData.dateRange.to
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      // Get current user ID from localStorage or context
      const currentUserId = Number(localStorage.getItem("userId")) || 1;

      await createProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: mapUIStatusToApi(formData.status),
        priority: mapUIPriorityToApi(formData.priority),
        start_date: formData.dateRange.from.toISOString().split("T")[0],
        end_date: formData.dateRange.to.toISOString().split("T")[0],
        owner_id: currentUserId,
      }).unwrap();

      setIsAddDialogOpen(false);
      resetForm();
    } catch (err: any) {
      console.error("Failed to create project:", err);
      alert(err.message || "Failed to create project");
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
    // Navigate to project detail page or open modal
    console.log("Row clicked:", project);
  };

  const handleUpdateProject = async () => {
    if (
      !selectedProject ||
      !formData.name.trim() ||
      !formData.dateRange.from ||
      !formData.dateRange.to
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      await updateProject({
        project_id: Number(selectedProject.id),
        name: formData.name.trim(),
        description: formData.description.trim(),
        status: mapUIStatusToApi(formData.status),
        priority: mapUIPriorityToApi(formData.priority),
        start_date: formData.dateRange.from.toISOString().split("T")[0],
        end_date: formData.dateRange.to.toISOString().split("T")[0],
      }).unwrap();

      setIsEditDialogOpen(false);
      resetForm();
    } catch (err: any) {
      console.error("Failed to update project:", err);
      alert(err.message || "Failed to update project");
    }
  };

  const handleDeleteClick = (project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!selectedProject) return;

    try {
      await deleteProject(Number(selectedProject.id)).unwrap();
      setIsDeleteDialogOpen(false);
      setSelectedProject(null);
    } catch (err: any) {
      console.error("Failed to delete project:", err);
      alert(err.message || "Failed to delete project");
    }
  };

  return {
    projects,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    selectedProject,
    formData,
    setIsAddDialogOpen,
    setIsEditDialogOpen,
    setIsDeleteDialogOpen,
    setFormData,
    handleAddProject,
    handleEditClick,
    handleRowClick,
    handleUpdateProject,
    handleDeleteClick,
    handleDeleteProject,
    resetForm,
  };
};
