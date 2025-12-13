// Task.tsx
import { TaskTable, type Task as TaskType } from "@/components/common/taskTable";
import { useState, useEffect, useRef, useCallback } from "react";
import {
    useGetProjectTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskMutation,
    useDeleteTaskMutation,
    type Task as APITask,
} from "../../../../features/tasksAPi";
import { useOutletContext } from "react-router";

type OverviewContext = {
    userId: string | number;
    projectId: string | number;
};

export const Task = () => {
    const { projectId } = useOutletContext<OverviewContext>();
    const [tasks, setTasks] = useState<TaskType[]>([]);

    // Track pending operations to prevent duplicate API calls
    const pendingOperationsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
    const isInitializedRef = useRef(false);

    // Fetch tasks from API
    const { data: apiTasks, isLoading, error } = useGetProjectTasksQuery(Number(projectId), {
        skip: !projectId,
        // Prevent refetch on focus to avoid glitches
        refetchOnFocus: false,
        refetchOnReconnect: false,
    });

    // Mutations
    const [createTask] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [deleteTask] = useDeleteTaskMutation();

    // Map API tasks to UI task format
    const mapAPITaskToUITask = useCallback((apiTask: APITask): TaskType => {
        const statusMap: Record<APITask["status"], TaskType["status"]> = {
            pending: "Expired",
            in_review: "In review",
            in_progress: "In progress",
            submitted: "Submitted",
            success: "Success",
        };

        const priorityMap: Record<APITask["priority"], TaskType["priority"]> = {
            low: "Low",
            medium: "Medium",
            high: "High",
            critical: "Critical",
        };

        return {
            id: apiTask.task_id,
            name: apiTask.name,
            assignee: "",
            status: statusMap[apiTask.status],
            dueDate: apiTask.due_date || "",
            priority: priorityMap[apiTask.priority],
        };
    }, []);

    // Map UI task to API format
    const mapUITaskToAPITask = useCallback((uiTask: TaskType): Partial<APITask> => {
        const statusMap = {
            "Expired": "pending",
            "In review": "in_review",
            "In progress": "in_progress",
            "Submitted": "submitted",
            "Success": "success",
            Pending: "pending",
            Failed: "pending"
        } satisfies Record<NonNullable<TaskType["status"]>, APITask["status"]>;

        const priorityMap: Record<NonNullable<TaskType["priority"]>, APITask["priority"]> = {
            "Low": "low",
            "Medium": "medium",
            "High": "high",
            "Critical": "critical",
        };

        return {
            name: uiTask.name,
            status: uiTask.status ? statusMap[uiTask.status] : "pending",
            priority: uiTask.priority ? priorityMap[uiTask.priority] : "medium",
            due_date: uiTask.dueDate || null,
        };
    }, []);

    // Initialize tasks from API - only once on mount or when data first arrives
    useEffect(() => {
        if (apiTasks && !isInitializedRef.current) {
            setTasks(apiTasks.map(mapAPITaskToUITask));
            isInitializedRef.current = true;
        }
    }, [apiTasks, mapAPITaskToUITask]);

    // Cleanup pending operations on unmount
    useEffect(() => {
        return () => {
            pendingOperationsRef.current.forEach(timeout => clearTimeout(timeout));
            pendingOperationsRef.current.clear();
        };
    }, []);

    // Handle individual task field changes with debouncing for text fields
    const handleTaskChange = useCallback((taskId: number, field: keyof TaskType, value: string) => {
        // Update UI immediately (optimistic update)
        setTasks(prev => prev.map(task =>
            task.id === taskId ? { ...task, [field]: value } : task
        ));

        // Clear existing pending operation for this task
        const existingTimeout = pendingOperationsRef.current.get(taskId);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
        }

        // Determine if this is a dropdown or text field
        const isDropdown = field === 'status' || field === 'priority';
        const delay = isDropdown ? 0 : 1500; // Immediate for dropdowns, 1.5s for text

        // Schedule API call
        const timeout = setTimeout(async () => {
            pendingOperationsRef.current.delete(taskId);

            // Find the current task state
            const currentTask = tasks.find(t => t.id === taskId);
            if (!currentTask) return;

            // Check if this is a new task (temporary ID)
            const isNewTask = taskId > 1000000000000; // Timestamp-based IDs

            try {
                if (isNewTask) {
                    // For new tasks, only create if name is not empty
                    if (field === 'name' && value.trim()) {
                        const updatedTask = { ...currentTask, [field]: value };
                        const apiTask = mapUITaskToAPITask(updatedTask);

                        const result = await createTask({
                            project_id: Number(projectId),
                            name: apiTask.name!,
                            status: apiTask.status!,
                            priority: apiTask.priority!,
                            due_date: apiTask.due_date || undefined,
                            description: "",
                        }).unwrap();

                        // Replace temp ID with real ID
                        setTasks(prev => prev.map(t =>
                            t.id === taskId ? { ...t, id: result.task_id } : t
                        ));
                    }
                } else {
                    // Update existing task
                    const updatedTask = { ...currentTask, [field]: value };
                    const apiTask = mapUITaskToAPITask(updatedTask);

                    await updateTask({
                        task_id: taskId,
                        name: apiTask.name!,
                        status: apiTask.status!,
                        priority: apiTask.priority!,
                        due_date: apiTask.due_date || undefined,
                        description: "",
                    }).unwrap();
                }
            } catch (error) {
                console.error("Error updating task:", error);
                // On error, revert to API state if available
                if (apiTasks) {
                    const apiTask = apiTasks.find(t => t.task_id === taskId);
                    if (apiTask) {
                        setTasks(prev => prev.map(t =>
                            t.id === taskId ? mapAPITaskToUITask(apiTask) : t
                        ));
                    }
                }
            }
        }, delay);

        pendingOperationsRef.current.set(taskId, timeout);
    }, [tasks, apiTasks, createTask, updateTask, projectId, mapUITaskToAPITask, mapAPITaskToUITask]);

    // Handle adding new task
    const handleTaskAdd = useCallback(() => {
        const newTask: TaskType = {
            id: Date.now(), // Temporary ID
            name: "",
            assignee: "",
            status: "Expired",
            dueDate: "",
            priority: "Medium",
        };
        setTasks(prev => [...prev, newTask]);
    }, []);

    // Handle deleting task
    const handleTaskDelete = useCallback(async (taskId: number) => {
        // Clear any pending operations for this task
        const existingTimeout = pendingOperationsRef.current.get(taskId);
        if (existingTimeout) {
            clearTimeout(existingTimeout);
            pendingOperationsRef.current.delete(taskId);
        }

        // Remove from UI immediately
        setTasks(prev => prev.filter(t => t.id !== taskId));

        // Only call API if it's not a temporary task
        const isNewTask = taskId > 1000000000000;
        if (!isNewTask) {
            try {
                await deleteTask(taskId).unwrap();
            } catch (error) {
                console.error("Error deleting task:", error);
                // On error, restore from API if available
                if (apiTasks) {
                    const apiTask = apiTasks.find(t => t.task_id === taskId);
                    if (apiTask) {
                        setTasks(prev => [...prev, mapAPITaskToUITask(apiTask)]);
                    }
                }
            }
        }
    }, [deleteTask, apiTasks, mapAPITaskToUITask]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">Loading tasks...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-red-500">Error loading tasks</div>
            </div>
        );
    }

    if (!projectId) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-gray-500">No project selected</div>
            </div>
        );
    }

    return (
        <div className="">
            <TaskTable
                title="Project Tasks"
                tasks={tasks}
                onTaskChange={handleTaskChange}
                onTaskAdd={handleTaskAdd}
                onTaskDelete={handleTaskDelete}
                showNumbering={true}
            />
        </div>
    );
};