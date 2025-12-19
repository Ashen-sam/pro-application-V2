import { showToast } from "@/components/common/commonToast";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { PriorityType, StatusType } from "@/components";
import { initialFormData } from "@/components/common/projectForm";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useListProjectsQuery,
  useSendProjectInvitesMutation,
  useUpdateProjectMutation,
  type Project as ApiProject,
} from "../../../features/projectsApi";

interface ApiErrorResponse {
  data?: {
    error?: {
      message?: string;
    };
    message?: string;
  };
  message?: string;
}

const getErrorMessage = (error: unknown): string => {
  const apiError = error as ApiErrorResponse;
  return (
    apiError?.data?.error?.message ||
    apiError?.data?.message ||
    apiError?.message ||
    "An unexpected error occurred"
  );
};

export interface Project extends ApiProject {
  status: StatusType;
  priority: PriorityType;
  progress: number;
  dueDate: string;
  members?: unknown[];
  teamMembers: string;
  memeberEmails: string[];
  dateRange: {
    from: Date;
    to: Date;
  };
}

const getCurrentUserId = (): number | null => {
  try {
    const userId = localStorage.getItem("userId");
    return userId ? Number(userId) : null;
  } catch (error) {
    console.error("Error reading userId from localStorage:", error);
    return null;
  }
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const calculateProgress = (startDate: Date, endDate: Date): number => {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const now = Date.now();

  if (now < start) return 0;
  if (now > end) return 100;

  const total = end - start;
  const elapsed = now - start;
  return Math.round((elapsed / total) * 100);
};

const mapApiStatusToUi = (apiStatus?: string): StatusType => {
  const map: Record<string, StatusType> = {
    "On track": "On track",
    "Off track": "Off track",
    "At risk": "At risk",
    Completed: "Completed",
  };
  return map[apiStatus || "On track"] || "On track";
};

const mapApiPriorityToUi = (apiPriority?: string): PriorityType => {
  const map: Record<string, PriorityType> = {
    Low: "Low",
    Medium: "Medium",
    High: "High",
    Critical: "Critical",
  };
  return map[apiPriority || "Medium"] || "Medium";
};

const transformApiProject = (apiProject: ApiProject): Project => {
  const startDate = apiProject.start_date
    ? new Date(apiProject.start_date)
    : new Date();
  const endDate = apiProject.end_date
    ? new Date(apiProject.end_date)
    : (() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      })();

  const transformed: Project = {
    ...apiProject,
    status: mapApiStatusToUi(apiProject.status),
    priority: mapApiPriorityToUi(apiProject.priority),
    progress: calculateProgress(startDate, endDate),
    dueDate: formatDate(endDate),
    members: [],
    memeberEmails: apiProject.memberEmails || [],
    teamMembers: "",
    dateRange: {
      from: startDate,
      to: endDate,
    },
  };

  return transformed;
};

const mapStatusToApi = (uiStatus: StatusType): string => {
  return uiStatus;
};

export const useProjects = () => {
  const navigate = useNavigate();
  const isSubmittingRef = useRef(false);
  const [currentUserId] = useState<number | null>(() => getCurrentUserId());

  const {
    data: projectsData,
    isFetching,
    refetch,
    isError,
    error,
  } = useListProjectsQuery(undefined, {
    skip: !currentUserId,
  });

  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [sendProjectInvites] = useSendProjectInvitesMutation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (projectsData && Array.isArray(projectsData)) {
      const transformedProjects = projectsData.map(transformApiProject);
      setProjects(transformedProjects);
    } else {
      setProjects([]);
    }
  }, [projectsData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSelectedProject(null);
    setIsCalendarOpen(false);
  }, []);

  const closeAllDialogs = useCallback(() => {
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setTimeout(() => {
      resetForm();
      isSubmittingRef.current = false;
    }, 300);
  }, [resetForm]);

  const handleAddProjectAndCreateAnother = useCallback(async () => {
    if (!currentUserId) {
      showToast.error("User not authenticated", "auth-error");
      return;
    }

    if (isSubmittingRef.current) return;

    if (!formData.name.trim()) {
      showToast.error("Project name is required", "validation-error");
      return;
    }

    if (!formData.dateRange.from || !formData.dateRange.to) {
      showToast.error(
        "Please select project duration (start and end dates)",
        "date-error"
      );
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);

    // Optimistic update: Create temporary project immediately
    const tempId = Date.now();
    const optimisticProject: Project = {
      project_id: tempId,
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      progress: calculateProgress(
        formData.dateRange.from!,
        formData.dateRange.to!
      ),
      dueDate: formatDate(formData.dateRange.to!),
      members: [],
      teamMembers: "",
      memeberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
      dateRange: {
        from: formData.dateRange.from!,
        to: formData.dateRange.to!,
      },
      owner_id: currentUserId,
      start_date: formData.dateRange.from!.toISOString(),
      end_date: formData.dateRange.to!.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      memberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
    };

    // Add to local state immediately
    setProjects((prev) => [optimisticProject, ...prev]);

    // Show instant success toast
    showToast.success("Project created successfully", "create-success");

    const createPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      start_date: formData.dateRange.from.toISOString(),
      end_date: formData.dateRange.to.toISOString(),
      status: mapStatusToApi(formData.status),
      priority: formData.priority,
      owner_id: currentUserId,
      memberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
    };

    try {
      const result = await createProject(createPayload).unwrap();

      // Replace optimistic project with real one
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === tempId ? transformApiProject(result) : p
        )
      );

      if (formData.memeberEmails.length > 0) {
        sendProjectInvites({
          projectId: result.project_id,
          memberEmails: formData.memeberEmails,
        })
          .unwrap()
          .then(() => {
            showToast.success(
              `Invitations sent to ${formData.memeberEmails.length} member(s)`,
              "invite-success"
            );
          })
          .catch((emailError) => {
            console.error("Failed to send invitations:", emailError);
            showToast.warning(
              "Project created but failed to send some invitations",
              "invite-partial"
            );
          });
      }

      resetForm();
    } catch (error: unknown) {
      // Rollback: Remove optimistic project on error
      setProjects((prev) => prev.filter((p) => p.project_id !== tempId));
      const errorMessage = getErrorMessage(error) || "Failed to create project";
      showToast.error(errorMessage, "create-error");
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  }, [formData, currentUserId, createProject, sendProjectInvites, resetForm]);

  const handleAddProject = useCallback(async () => {
    if (!currentUserId) {
      showToast.error("User not authenticated", "auth-error");
      return;
    }

    if (isSubmittingRef.current) return;

    if (!formData.name.trim()) {
      showToast.error("Project name is required", "validation-error");
      return;
    }

    if (!formData.dateRange.from || !formData.dateRange.to) {
      showToast.error(
        "Please select project duration (start and end dates)",
        "date-error"
      );
      return;
    }

    isSubmittingRef.current = true;
    setIsLoading(true);

    // Optimistic update: Create temporary project immediately
    const tempId = Date.now();
    const optimisticProject: Project = {
      project_id: tempId,
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      progress: calculateProgress(
        formData.dateRange.from,
        formData.dateRange.to
      ),
      dueDate: formatDate(formData.dateRange.to),
      members: [],
      teamMembers: "",
      memeberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
      dateRange: {
        from: formData.dateRange.from!,
        to: formData.dateRange.to!,
      },
      owner_id: currentUserId,
      start_date: formData.dateRange.from!.toISOString(),
      end_date: formData.dateRange.to!.toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      memberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
    };

    // Add to local state immediately
    setProjects((prev) => [optimisticProject, ...prev]);

    // Close dialog immediately for better UX
    closeAllDialogs();

    // Show instant success toast
    showToast.success("Project created successfully", "create-success");

    const createPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      start_date: formData.dateRange.from.toISOString(),
      end_date: formData.dateRange.to.toISOString(),
      status: mapStatusToApi(formData.status),
      priority: formData.priority,
      owner_id: currentUserId,
      memberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
    };

    try {
      const result = await createProject(createPayload).unwrap();

      // Replace optimistic project with real one
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === tempId ? transformApiProject(result) : p
        )
      );

      if (formData.memeberEmails.length > 0) {
        sendProjectInvites({
          projectId: result.project_id,
          memberEmails: formData.memeberEmails,
        })
          .unwrap()
          .then(() => {
            showToast.info(
              `Invitations sent to ${formData.memeberEmails.length} member(s)`,
              "invite-success"
            );
          })
          .catch((emailError: unknown) => {
            console.error("Failed to send invitations:", emailError);
            const inviteErrorMessage =
              getErrorMessage(emailError) || "Invitation service unavailable";

            showToast.warning(
              `Project created, but ${inviteErrorMessage.toLowerCase()}. You can invite members later.`,
              "invite-warning"
            );
          });
      }
    } catch (error: unknown) {
      // Rollback: Remove optimistic project on error
      setProjects((prev) => prev.filter((p) => p.project_id !== tempId));
      console.error("Failed to create project:", error);
      const errorMessage = getErrorMessage(error) || "Failed to create project";
      showToast.error(errorMessage, "create-error");
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  }, [
    formData,
    currentUserId,
    createProject,
    sendProjectInvites,
    closeAllDialogs,
  ]);

  const handleBulkDeleteClick = useCallback(() => {
    if (selectedRows.length === 0) return;
    setIsBulkDeleteDialogOpen(true);
  }, [selectedRows]);

  const handleBulkDeleteProject = useCallback(async () => {
    if (isSubmittingRef.current || selectedRows.length === 0) return;
    isSubmittingRef.current = true;
    setIsLoading(true);

    const projectIds = selectedRows.map((p) => p.project_id);

    // Store original projects for rollback
    const deletedProjects = [...selectedRows];

    // Optimistic update: Remove from local state immediately
    setProjects((prev) =>
      prev.filter((p) => !projectIds.includes(p.project_id))
    );

    // Close dialog and clear selection immediately
    setIsBulkDeleteDialogOpen(false);
    setSelectedRows([]);
    setTimeout(() => {
      resetForm();
      isSubmittingRef.current = false;
    }, 300);

    // Show instant success toast
    showToast.success(
      `Successfully deleted ${projectIds.length} project(s)`,
      "bulk-delete-success"
    );

    try {
      await deleteProject(projectIds).unwrap();
    } catch (error: unknown) {
      // Rollback: Restore deleted projects on error
      setProjects((prev) => [...deletedProjects, ...prev]);
      const errorMessage =
        getErrorMessage(error) || "Failed to delete projects";
      showToast.error(errorMessage, "bulk-delete-error");
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  }, [selectedRows, deleteProject, resetForm]);

  const handleEditClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name || "",
      description: project.description || "",
      status: project.status,
      priority: project.priority,
      teamMembers: [],
      memeberEmails: project.memberEmails || [],
      dateRange: {
        from: project.dateRange?.from,
        to: project.dateRange?.to,
      },
    });
    setIsEditDialogOpen(true);
  }, []);

  const handleUpdateProject = useCallback(async () => {
    if (isSubmittingRef.current || !selectedProject) return;
    if (!formData.name.trim()) {
      showToast.error("Project name is required", "validation-error");
      return;
    }
    if (!formData.dateRange.from || !formData.dateRange.to) {
      showToast.error(
        "Please select project duration (start and end dates)",
        "date-error"
      );
      return;
    }
    isSubmittingRef.current = true;
    setIsLoading(true);

    // Store original project for rollback
    const originalProject = selectedProject;

    // Optimistic update: Update local state immediately
    const updatedProject: Project = {
      ...selectedProject,
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      start_date: formData.dateRange.from!.toISOString(),
      end_date: formData.dateRange.to!.toISOString(),
      progress: calculateProgress(
        formData.dateRange.from!,
        formData.dateRange.to!
      ),
      dueDate: formatDate(formData.dateRange.to!),
      memeberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
      memberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
      dateRange: {
        from: formData.dateRange.from!,
        to: formData.dateRange.to!,
      },
      updated_at: new Date().toISOString(),
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.project_id === selectedProject.project_id ? updatedProject : p
      )
    );

    // Close dialog immediately
    closeAllDialogs();

    // Show instant success toast
    showToast.success("Project updated successfully", "update-success");

    const updatePayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      start_date: formData.dateRange.from!.toISOString(),
      end_date: formData.dateRange.to!.toISOString(),
      status: mapStatusToApi(formData.status),
      priority: formData.priority,
      memberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
    };

    try {
      const result = await updateProject({
        projectId: selectedProject.project_id,
        data: updatePayload,
      }).unwrap();

      // Replace with server response
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === selectedProject.project_id
            ? transformApiProject(result)
            : p
        )
      );
    } catch (error: unknown) {
      // Rollback: Restore original project on error
      setProjects((prev) =>
        prev.map((p) =>
          p.project_id === selectedProject.project_id ? originalProject : p
        )
      );
      const errorMessage = getErrorMessage(error) || "Failed to update project";
      showToast.error(errorMessage, "update-error");
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  }, [formData, selectedProject, updateProject, closeAllDialogs]);

  const handleDeleteClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteProject = useCallback(async () => {
    if (isSubmittingRef.current || !selectedProject) return;
    isSubmittingRef.current = true;
    setIsLoading(true);
    const projectName = selectedProject.name;
    const projectId = selectedProject.project_id;

    // Store original project for rollback
    const deletedProject = selectedProject;

    // Optimistic update: Remove from local state immediately
    setProjects((prev) => prev.filter((p) => p.project_id !== projectId));

    // Close dialog immediately
    closeAllDialogs();

    // Show instant success toast
    showToast.success(
      `Project "${projectName}" deleted successfully`,
      "delete-success"
    );

    try {
      await deleteProject(projectId).unwrap();
    } catch (error: unknown) {
      // Rollback: Restore deleted project on error
      setProjects((prev) => [deletedProject, ...prev]);
      const errorMessage = getErrorMessage(error) || "Failed to delete project";
      showToast.error(errorMessage, "delete-error");
    } finally {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  }, [selectedProject, deleteProject, closeAllDialogs]);

  const handleDialogOpenChange = useCallback(
    (dialogType: "add" | "edit" | "delete" | "bulkDelete", open: boolean) => {
      if (!open && isSubmittingRef.current) return;
      switch (dialogType) {
        case "add":
          setIsAddDialogOpen(open);
          break;
        case "edit":
          setIsEditDialogOpen(open);
          break;
        case "delete":
          setIsDeleteDialogOpen(open);
          break;
        case "bulkDelete":
          setIsBulkDeleteDialogOpen(open);
          break;
      }
      if (!open) {
        setTimeout(resetForm, 300);
      }
    },
    [resetForm]
  );

  const handleNavigateToProject = useCallback(
    (projectId: number) => {
      navigate(`/projects/${projectId}`);
    },
    [navigate]
  );

  return {
    projects,
    currentUserId,
    isFetching,
    isError,
    error,
    isAddDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    selectedProject,
    formData,
    isCalendarOpen,
    isLoading,
    selectedRows,
    setSelectedRows,
    setIsAddDialogOpen,
    setFormData,
    setIsCalendarOpen,
    handleAddProject,
    handleAddProjectAndCreateAnother,
    handleEditClick,
    handleUpdateProject,
    handleDeleteClick,
    handleDeleteProject,
    handleDialogOpenChange,
    handleNavigateToProject,
    refetch,
    isBulkDeleteDialogOpen,
    handleBulkDeleteClick,
    handleBulkDeleteProject,
  };
};
