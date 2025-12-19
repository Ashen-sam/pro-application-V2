// hooks/useTasks.ts
import { useState, useEffect, useRef, useCallback } from "react";
import type { Task as TaskType } from "@/components/common/taskTable";
import {
  useListTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  type Task as ApiTask,
} from "@/features/tasksAPi";
import { showToast } from "@/components/common/commonToast";

// Map API task to UI task format
const mapApiTaskToUiTask = (apiTask: ApiTask): TaskType => ({
  id: apiTask.task_id,
  name: apiTask.title || "",
  assignee: "", // Will be populated from assignments
  status: apiTask.status || "At risk",
  dueDate: apiTask.due_date || "",
  priority: (apiTask.priority as TaskType["priority"]) || "Medium",
});

// Map UI task to API format (used for both create and update)
const mapUiTaskToApiTask = (uiTask: Partial<TaskType>, projectId: number) => ({
  project_id: projectId,
  title: uiTask.name || "",
  description: "",
  status: uiTask.status || "On track",
  priority: uiTask.priority || "Medium",
  due_date: uiTask.dueDate || undefined,
});

interface UseTasksOptions {
  projectId: string | number;
}

interface UseTasksReturn {
  tasks: TaskType[];
  isLoading: boolean;
  handleTaskChange: (
    taskId: number,
    field: keyof TaskType,
    value: string
  ) => void;
  handleTaskAdd: () => void;
  handleTaskDelete: (taskId: number) => Promise<void>;
}

export const useTasks = ({ projectId }: UseTasksOptions): UseTasksReturn => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [pendingChanges, setPendingChanges] = useState<
    Map<number, Partial<TaskType>>
  >(new Map());
  const [newTaskIds, setNewTaskIds] = useState<Set<number>>(new Set());

  // RTK Query hooks
  const { data: tasksData, isLoading } = useListTasksQuery(
    { projectId: Number(projectId) },
    {
      skip: !projectId,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
    }
  );

  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // Track pending operations
  const pendingOperationsRef = useRef<
    Map<number, ReturnType<typeof setTimeout>>
  >(new Map());
  const isInitializedRef = useRef(false);

  // Initialize tasks from API data ONLY on first load
  useEffect(() => {
    if (tasksData?.tasks && !isInitializedRef.current) {
      const uiTasks = tasksData.tasks.map(mapApiTaskToUiTask);
      setTasks(uiTasks);
      isInitializedRef.current = true;
    }
  }, [tasksData]);

  // Cleanup pending operations on unmount
  useEffect(() => {
    return () => {
      pendingOperationsRef.current.forEach((timeout) => clearTimeout(timeout));
      pendingOperationsRef.current.clear();
    };
  }, []);

  // Save all pending changes to the API
  const savePendingChanges = useCallback(async () => {
    if (pendingChanges.size === 0) return;

    const changesToSave = new Map(pendingChanges);
    setPendingChanges(new Map());

    for (const [taskId, changes] of changesToSave.entries()) {
      try {
        const currentTask = tasks.find((t) => t.id === taskId);
        if (!currentTask) continue;

        const completeTaskData = { ...currentTask, ...changes };

        if (newTaskIds.has(taskId)) {
          // Only create if task has a name
          if (completeTaskData.name && completeTaskData.name.trim()) {
            const payload = mapUiTaskToApiTask(
              completeTaskData,
              Number(projectId)
            );
            const result = await createTask(payload).unwrap();
            showToast.success("Task added successfully", "asd");

            // Replace temp ID with real ID from API
            setTasks((prev) =>
              prev.map((t) =>
                t.id === taskId
                  ? { ...completeTaskData, id: result.task.task_id }
                  : t
              )
            );

            setNewTaskIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(taskId);
              return newSet;
            });
          } else {
            // Remove empty new task
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
            setNewTaskIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(taskId);
              return newSet;
            });
          }
        } else {
          // Update existing task
          const payload = mapUiTaskToApiTask(
            completeTaskData,
            Number(projectId)
          );
          await updateTask({
            taskId,
            body: payload,
          }).unwrap();
        }
      } catch (error) {
        console.error(`Failed to save task ${taskId}:`, error);
        alert(`Failed to save task. Please try again.`);

        // Revert optimistic update on error
        if (tasksData?.tasks) {
          const apiTask = tasksData.tasks.find((t) => t.task_id === taskId);
          if (apiTask) {
            setTasks((prev) =>
              prev.map((t) =>
                t.id === taskId ? mapApiTaskToUiTask(apiTask) : t
              )
            );
          }
        }
      }
    }
  }, [
    pendingChanges,
    tasks,
    projectId,
    newTaskIds,
    createTask,
    updateTask,
    tasksData,
  ]);

  // Save pending changes when user clicks anywhere
  useEffect(() => {
    const handleGlobalClick = async (e: MouseEvent) => {
      if (pendingChanges.size === 0) return;

      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "BUTTON" ||
        target.tagName === "SELECT" ||
        target.closest("input") ||
        target.closest("button") ||
        target.closest("select")
      ) {
        return;
      }

      await savePendingChanges();
    };

    document.addEventListener("click", handleGlobalClick);
    return () => document.removeEventListener("click", handleGlobalClick);
  }, [pendingChanges, savePendingChanges]);

  // Handle individual task field changes
  const handleTaskChange = useCallback(
    (taskId: number, field: keyof TaskType, value: string) => {
      // Update UI immediately (optimistic update)
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, [field]: value } : task
        )
      );

      // Add to pending changes
      setPendingChanges((prev) => {
        const newMap = new Map(prev);
        const existingChanges = newMap.get(taskId) || {};
        newMap.set(taskId, { ...existingChanges, [field]: value });
        return newMap;
      });

      // For dropdowns (status, priority), save immediately
      const isDropdown = field === "status" || field === "priority";
      if (isDropdown) {
        // Clear existing timeout
        const existingTimeout = pendingOperationsRef.current.get(taskId);
        if (existingTimeout) {
          clearTimeout(existingTimeout);
        }

        // Set a short delay to save dropdown changes
        const timeout = setTimeout(async () => {
          pendingOperationsRef.current.delete(taskId);

          try {
            if (newTaskIds.has(taskId)) {
              // For new tasks, just update local state
              return;
            }

            const currentTask = tasks.find((t) => t.id === taskId);
            if (!currentTask) return;

            const completeTaskData = { ...currentTask, [field]: value };
            const payload = mapUiTaskToApiTask(
              completeTaskData,
              Number(projectId)
            );

            await updateTask({
              taskId,
              body: payload,
            }).unwrap();

            // Remove from pending changes since we just saved
            setPendingChanges((prev) => {
              const newMap = new Map(prev);
              newMap.delete(taskId);
              return newMap;
            });
          } catch (error) {
            console.error(`Failed to update task ${taskId}:`, error);
            alert(`Failed to update task. Please try again.`);

            // Revert on error
            if (tasksData?.tasks) {
              const apiTask = tasksData.tasks.find((t) => t.task_id === taskId);
              if (apiTask) {
                setTasks((prev) =>
                  prev.map((t) =>
                    t.id === taskId ? mapApiTaskToUiTask(apiTask) : t
                  )
                );
              }
            }
          }
        }, 300);

        pendingOperationsRef.current.set(taskId, timeout);
      }
    },
    [newTaskIds, updateTask, projectId, tasks, tasksData]
  );

  // Handle adding new task
  const handleTaskAdd = useCallback(() => {
    const tempId = Date.now();
    const newTask: TaskType = {
      id: tempId,
      name: "",
      assignee: "",
      status: "At risk",
      dueDate: "",
      priority: "Medium",
    };

    setTasks((prev) => [...prev, newTask]);
    setNewTaskIds((prev) => new Set(prev).add(tempId));
  }, []);

  // Handle deleting task
  const handleTaskDelete = useCallback(
    async (taskId: number) => {
      // Clear any pending operations for this task
      const existingTimeout = pendingOperationsRef.current.get(taskId);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
        pendingOperationsRef.current.delete(taskId);
      }

      // Remove from pending changes
      setPendingChanges((prev) => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        return newMap;
      });

      // Store task for potential rollback
      const taskToDelete = tasks.find((t) => t.id === taskId);

      // Remove from UI immediately (optimistic update)
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      try {
        if (newTaskIds.has(taskId)) {
          setNewTaskIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(taskId);
            return newSet;
          });
        } else {
          // Delete from API
          await deleteTask(taskId).unwrap();
        }
      } catch (error) {
        console.error(`Failed to delete task ${taskId}:`, error);
        alert(`Failed to delete task. Please try again.`);

        // Restore task on error
        if (taskToDelete) {
          setTasks((prev) => [...prev, taskToDelete]);
        }
      }
    },
    [deleteTask, newTaskIds, tasks]
  );

  return {
    tasks,
    isLoading,
    handleTaskChange,
    handleTaskAdd,
    handleTaskDelete,
  };
};
