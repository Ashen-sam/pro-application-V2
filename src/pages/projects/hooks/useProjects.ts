import { showToast } from "@/components/common/commonToast";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { PriorityType, StatusType } from "@/components";
import { initialFormData } from "@/components/common/projectForm";
import { useUser } from "@clerk/clerk-react";
import {
  useCreateProjectMutation,
  useDeleteProjectMutation,
  useListProjectsQuery,
  useSendProjectInvitesMutation,
  useUpdateProjectMutation,
  useGenerateProjectDescriptionMutation,
  type Project as ApiProject,
} from "../../../features/projectsApi";
import { useGetCurrentUserQuery } from "@/features/auth/authApi";

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

export interface Project extends ApiProject, Record<string, unknown> {
  status: StatusType;
  project_uuid?: string;
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
    ? (() => {
        const d = new Date(apiProject.start_date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      })()
    : new Date();

  const endDate = apiProject.end_date
    ? (() => {
        const d = new Date(apiProject.end_date);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      })()
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

  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  const { data: dbUser } = useGetCurrentUserQuery(undefined, {
    skip: !clerkLoaded,
  });
  const currentUserId =
    dbUser?.user_id || (clerkUser?.id ? Number(clerkUser.id) : null);

  const {
    data: projectsData,
    isFetching: isInitialFetching,
    refetch,
    isError,
    error,
  } = useListProjectsQuery(undefined, {
    skip: !clerkLoaded || !currentUserId,
  });

  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();
  const [isTyping, setIsTyping] = useState(false);
  const [generateDescription, { isLoading: isAiLoading }] =
    useGenerateProjectDescriptionMutation();
  const [isTitleDialogOpen, setIsTitleDialogOpen] = useState(false);
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [titleProject, setTitleProject] = useState<Project | null>(null);
  const [descriptionProject, setDescriptionProject] = useState<Project | null>(
    null
  );
  const [aiGenerationStatus, setAiGenerationStatus] = useState<string>("");
  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");
  const [sendProjectInvites] = useSendProjectInvitesMutation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState(initialFormData);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Project[]>([]);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);

  // Only show fetching on initial load
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const isFetching = isInitialFetching && !hasInitiallyLoaded;

  useEffect(() => {
    if (projectsData && Array.isArray(projectsData)) {
      const transformedProjects = projectsData.map(transformApiProject);
      setProjects(transformedProjects);
      setHasInitiallyLoaded(true);
    } else if (!isInitialFetching) {
      setProjects([]);
      setHasInitiallyLoaded(true);
    }
  }, [projectsData, isInitialFetching]);

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

  const formatDateForApi = (date: Date | string): string => {
    const d = typeof date === "string" ? new Date(date) : date;
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleAddProjectAndCreateAnother = useCallback(async () => {
    if (!clerkLoaded) {
      showToast.error("Loading authentication...", "auth-loading");
      return;
    }

    if (!currentUserId) {
      showToast.error(
        "User ID not found. Please refresh the page.",
        "auth-error"
      );
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

    const tempId = `temp-${Date.now()}`;
    const optimisticProject: Project = {
      project_id: tempId,
      project_uuid: tempId,
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
      start_date: formatDateForApi(formData.dateRange.from!),
      end_date: formatDateForApi(formData.dateRange.to!),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      memberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
    };

    // Optimistic update
    setProjects((prev) => [optimisticProject, ...prev]);
    showToast.success("Project created successfully", "create-success");
    resetForm();

    const createPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      start_date: formatDateForApi(formData.dateRange.from),
      end_date: formatDateForApi(formData.dateRange.to),
      status: mapStatusToApi(formData.status),
      priority: formData.priority,
      owner_id: Number(currentUserId),
      memberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
    };

    try {
      const result = await createProject(createPayload).unwrap();

      // Replace temporary project with real one
      setProjects((prev) =>
        prev.map((p) =>
          p.project_uuid === tempId || p.project_id === tempId
            ? transformApiProject(result)
            : p
        )
      );

      if (formData.memeberEmails.length > 0 && result.project_uuid) {
        sendProjectInvites({
          projectId: result.project_uuid,
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
    } catch (error: unknown) {
      // Rollback on error
      setProjects((prev) =>
        prev.filter((p) => p.project_uuid !== tempId && p.project_id !== tempId)
      );
      const errorMessage = getErrorMessage(error) || "Failed to create project";
      showToast.error(errorMessage, "create-error");
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    formData,
    currentUserId,
    createProject,
    sendProjectInvites,
    resetForm,
    clerkLoaded,
  ]);

  const handleAddProject = useCallback(async () => {
    if (!clerkLoaded) {
      showToast.error("Loading authentication...", "auth-loading");
      return;
    }

    if (!currentUserId) {
      showToast.error(
        "User ID not found. Please refresh the page.",
        "auth-error"
      );
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

    const tempId = `temp-${Date.now()}`;
    const optimisticProject: Project = {
      project_id: tempId,
      project_uuid: tempId,
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

    // Optimistic update
    setProjects((prev) => [optimisticProject, ...prev]);
    closeAllDialogs();
    showToast.success("Project created successfully", "create-success");

    const createPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      start_date: formatDateForApi(formData.dateRange.from),
      end_date: formatDateForApi(formData.dateRange.to),
      status: mapStatusToApi(formData.status),
      priority: formData.priority,
      owner_id: Number(currentUserId),
      memberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
    };

    try {
      const result = await createProject(createPayload).unwrap();

      // Replace temporary project with real one
      setProjects((prev) =>
        prev.map((p) =>
          p.project_uuid === tempId || p.project_id === tempId
            ? transformApiProject(result)
            : p
        )
      );

      if (formData.memeberEmails.length > 0 && result.project_uuid) {
        sendProjectInvites({
          projectId: result.project_uuid,
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
      // Rollback on error
      setProjects((prev) =>
        prev.filter((p) => p.project_uuid !== tempId && p.project_id !== tempId)
      );
      console.error("Failed to create project:", error);
      const errorMessage = getErrorMessage(error) || "Failed to create project";
      showToast.error(errorMessage, "create-error");
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    formData,
    currentUserId,
    createProject,
    sendProjectInvites,
    closeAllDialogs,
    clerkLoaded,
  ]);

  const typeText = (text: string, speed: number = 30) => {
    return new Promise<void>((resolve) => {
      let index = 0;
      setDescriptionInput("");
      setIsTyping(true);

      const interval = setInterval(() => {
        if (index < text.length) {
          setDescriptionInput((prev) => prev + text.charAt(index));
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          resolve();
        }
      }, speed);
    });
  };

  const handleBulkDeleteClick = useCallback(() => {
    if (selectedRows.length === 0) return;
    setIsBulkDeleteDialogOpen(true);
  }, [selectedRows]);

  const handleBulkDeleteProject = useCallback(async () => {
    if (isSubmittingRef.current || selectedRows.length === 0) return;
    isSubmittingRef.current = true;

    const projectUuids = selectedRows.map(
      (p) => p.project_uuid || String(p.project_id)
    );
    const deletedProjects = [...selectedRows];

    // Optimistic update
    setProjects((prev) =>
      prev.filter((p) => {
        const pId = p.project_uuid || String(p.project_id);
        return !projectUuids.includes(pId);
      })
    );
    setIsBulkDeleteDialogOpen(false);
    setSelectedRows([]);
    setTimeout(() => {
      resetForm();
      isSubmittingRef.current = false;
    }, 300);

    showToast.success(
      `Successfully deleted ${projectUuids.length} project(s)`,
      "bulk-delete-success"
    );

    try {
      await deleteProject(projectUuids).unwrap();
    } catch (error: unknown) {
      // Rollback on error
      setProjects((prev) => [...deletedProjects, ...prev]);
      const errorMessage =
        getErrorMessage(error) || "Failed to delete projects";
      showToast.error(errorMessage, "bulk-delete-error");
    } finally {
      isSubmittingRef.current = false;
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

  const handleGenerateDescription = async () => {
    if (!descriptionProject?.name) {
      showToast.error("Project name is required", "validation-error");
      return;
    }

    try {
      setAiGenerationStatus("Thinking");

      const res = await generateDescription({
        projectName: descriptionProject.name,
        projectType: "Project Management Tool",
      }).unwrap();

      if (res?.description) {
        setAiGenerationStatus("Writing");
        await typeText(res.description, 20);
        setAiGenerationStatus("");
        showToast.success("Description generated successfully", "ai-success");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setAiGenerationStatus("");
      setIsTyping(false);
      console.error("AI generation failed:", error);
    }
  };

  const handleInlineUpdateProject = useCallback(
    async (updatedRow: Project) => {
      if (!updatedRow || (!updatedRow.project_uuid && !updatedRow.project_id))
        return;

      const originalProject = projects.find((p) => {
        const pId = p.project_uuid || String(p.project_id);
        const targetId =
          updatedRow.project_uuid || String(updatedRow.project_id);
        return pId === targetId;
      });

      if (!originalProject) return;

      // Optimistic update
      setProjects((prev) =>
        prev.map((p) => {
          const pId = p.project_uuid || String(p.project_id);
          const targetId =
            updatedRow.project_uuid || String(updatedRow.project_id);
          return pId === targetId ? { ...p, ...updatedRow } : p;
        })
      );

      showToast.success("Project updated", "inline-update-success");

      const updatePayload: Partial<Record<string, unknown>> = {};

      if (updatedRow.name !== originalProject.name) {
        updatePayload.name = updatedRow.name;
      }
      if (updatedRow.description !== originalProject.description) {
        updatePayload.description = updatedRow.description;
      }
      if (updatedRow.status !== originalProject.status) {
        updatePayload.status = mapStatusToApi(updatedRow.status);
      }
      if (updatedRow.priority !== originalProject.priority) {
        updatePayload.priority = updatedRow.priority;
      }

      if (
        updatedRow.dateRange &&
        typeof updatedRow.dateRange === "object" &&
        "from" in updatedRow.dateRange &&
        "to" in updatedRow.dateRange
      ) {
        const dateRange = updatedRow.dateRange as {
          from?: Date | string;
          to?: Date | string;
        };
        if (dateRange.from) {
          updatePayload.start_date = formatDateForApi(dateRange.from);
        }
        if (dateRange.to) {
          updatePayload.end_date = formatDateForApi(dateRange.to);
        }
      }

      if (
        JSON.stringify(updatedRow.memeberEmails) !==
        JSON.stringify(originalProject.memeberEmails)
      ) {
        updatePayload.memberEmails = updatedRow.memeberEmails;
      }

      if (Object.keys(updatePayload).length === 0) {
        return;
      }

      try {
        const projectUuid =
          updatedRow.project_uuid || String(updatedRow.project_id);
        const result = await updateProject({
          projectId: projectUuid,
          data: updatePayload,
        }).unwrap();

        // Update with server response
        setProjects((prev) =>
          prev.map((p) => {
            const pId = p.project_uuid || String(p.project_id);
            const targetId =
              updatedRow.project_uuid || String(updatedRow.project_id);
            return pId === targetId ? transformApiProject(result) : p;
          })
        );
      } catch (error: unknown) {
        // Rollback on error
        setProjects((prev) =>
          prev.map((p) => {
            const pId = p.project_uuid || String(p.project_id);
            const targetId =
              updatedRow.project_uuid || String(updatedRow.project_id);
            return pId === targetId ? originalProject : p;
          })
        );
        const errorMessage =
          getErrorMessage(error) || "Failed to update project";
        showToast.error(errorMessage, "inline-update-error");
      }
    },
    [projects, updateProject]
  );

  const handleModalUpdateProject = useCallback(async () => {
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

    const originalProject = selectedProject;

    const updatedProject: Project = {
      ...selectedProject,
      name: formData.name.trim(),
      description: formData.description.trim(),
      status: formData.status,
      priority: formData.priority,
      start_date: formatDateForApi(formData.dateRange.from!),
      end_date: formatDateForApi(formData.dateRange.to!),
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

    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => {
        const pId = p.project_uuid || String(p.project_id);
        const targetId =
          selectedProject.project_uuid || String(selectedProject.project_id);
        return pId === targetId ? updatedProject : p;
      })
    );

    closeAllDialogs();
    showToast.success("Project updated successfully", "update-success");

    const updatePayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      start_date: formatDateForApi(formData.dateRange.from),
      end_date: formatDateForApi(formData.dateRange.to),
      status: mapStatusToApi(formData.status),
      priority: formData.priority,
      memberEmails: formData.memeberEmails.filter(
        (email) => email.trim() !== ""
      ),
    };

    try {
      const projectUuid =
        selectedProject.project_uuid || String(selectedProject.project_id);
      const result = await updateProject({
        projectId: projectUuid,
        data: updatePayload,
      }).unwrap();

      // Update with server response
      setProjects((prev) =>
        prev.map((p) => {
          const pId = p.project_uuid || String(p.project_id);
          const targetId =
            selectedProject.project_uuid || String(selectedProject.project_id);
          return pId === targetId ? transformApiProject(result) : p;
        })
      );
    } catch (error: unknown) {
      // Rollback on error
      setProjects((prev) =>
        prev.map((p) => {
          const pId = p.project_uuid || String(p.project_id);
          const targetId =
            selectedProject.project_uuid || String(selectedProject.project_id);
          return pId === targetId ? originalProject : p;
        })
      );
      const errorMessage = getErrorMessage(error) || "Failed to update project";
      showToast.error(errorMessage, "update-error");
    } finally {
      isSubmittingRef.current = false;
    }
  }, [formData, selectedProject, updateProject, closeAllDialogs]);

  const handleDeleteClick = useCallback((project: Project) => {
    setSelectedProject(project);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteProject = useCallback(async () => {
    if (isSubmittingRef.current || !selectedProject) return;
    isSubmittingRef.current = true;
    const projectName = selectedProject.name;

    const deletedProject = selectedProject;

    // Optimistic update
    setProjects((prev) =>
      prev.filter((p) => {
        const pId = p.project_uuid || String(p.project_id);
        const targetId =
          selectedProject.project_uuid || String(selectedProject.project_id);
        return pId !== targetId;
      })
    );

    closeAllDialogs();

    showToast.success(
      `Project "${projectName}" deleted successfully`,
      "delete-success"
    );

    try {
      const projectUuid =
        selectedProject.project_uuid || String(selectedProject.project_id);
      await deleteProject(projectUuid).unwrap();
    } catch (error: unknown) {
      // Rollback on error
      setProjects((prev) => [deletedProject, ...prev]);
      const errorMessage = getErrorMessage(error) || "Failed to delete project";
      showToast.error(errorMessage, "delete-error");
    } finally {
      isSubmittingRef.current = false;
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

  const handleEditTitle = useCallback((row: Project) => {
    setTitleProject(row);
    setTitleInput(row.name || "");
    setIsTitleDialogOpen(true);
  }, []);

  const handleSaveTitle = useCallback(async () => {
    if (!titleProject) return;

    setIsTitleDialogOpen(false);
    const projectToUpdate = titleProject;
    const newTitle = titleInput;

    setTitleProject(null);
    setTitleInput("");

    await handleInlineUpdateProject({
      ...projectToUpdate,
      name: newTitle,
    });
  }, [titleProject, titleInput, handleInlineUpdateProject]);

  const handleAddDescriptionClick = useCallback((row: Project) => {
    setDescriptionProject(row);
    setDescriptionInput(row.description || "");
    setIsDescriptionDialogOpen(true);
  }, []);

  const handleSaveDescription = useCallback(async () => {
    if (!descriptionProject) return;

    setIsDescriptionDialogOpen(false);
    const projectToUpdate = descriptionProject;
    const newDescription = descriptionInput;

    setDescriptionProject(null);
    setDescriptionInput("");

    await handleInlineUpdateProject({
      ...projectToUpdate,
      description: newDescription,
    });
  }, [descriptionProject, descriptionInput, handleInlineUpdateProject]);

  const handleNavigateToProject = useCallback(
    (projectId: number | string) => {
      const project = projects.find(
        (p) =>
          p.project_id === projectId || p.project_uuid === String(projectId)
      );
      if (project) {
        const uuid = project.project_uuid || String(project.project_id);
        navigate(`/projects/${uuid}`);
      }
    },
    [projects, navigate]
  );

  return {
    projects,
    currentUserId,
    isLoading: false, // Never show loading for CRUD operations
    isError,
    error,
    formData,
    setFormData,
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isBulkDeleteDialogOpen,
    setIsBulkDeleteDialogOpen,
    selectedProject,
    setSelectedProject,
    isCalendarOpen,
    isFetching, // Only shows on initial load
    setIsCalendarOpen,
    selectedRows,
    setSelectedRows,
    isTitleDialogOpen,
    setIsTitleDialogOpen,
    isDescriptionDialogOpen,
    setIsDescriptionDialogOpen,
    titleProject,
    setTitleProject,
    descriptionProject,
    setDescriptionProject,
    titleInput,
    setTitleInput,
    descriptionInput,
    setDescriptionInput,
    isTyping,
    aiGenerationStatus,
    isAiLoading,
    handleAddProject,
    handleAddProjectAndCreateAnother,
    handleEditClick,
    handleModalUpdateProject,
    handleInlineUpdateProject,
    handleDeleteClick,
    handleDeleteProject,
    handleBulkDeleteClick,
    handleBulkDeleteProject,
    handleDialogOpenChange,
    handleEditTitle,
    handleSaveTitle,
    handleAddDescriptionClick,
    handleSaveDescription,
    handleGenerateDescription,
    handleNavigateToProject,
    refetch,
    resetForm,
  };
};
