import { supabase } from "@/lib/supabaseClient";
import { baseApi } from "@/store/baseAPI";

export interface Task {
  task_id: number;
  project_id: number;
  name: string;
  description: string | null;
  status: "pending" | "in_review" | "in_progress" | "submitted" | "success";
  priority: "low" | "medium" | "high" | "critical";
  due_date: string | null;
  created_by: number | null;
  created_at: string;
}

export interface TaskAssignment {
  task_id: number;
  user_id: number;
  assigned_at: string;
}

interface CreateTaskParams {
  project_id: number;
  name: string;
  description?: string;
  status: Task["status"];
  priority: Task["priority"];
  due_date?: string;
  created_by?: number;
  assignee_ids?: number[];
}

interface UpdateTaskParams {
  task_id: number;
  name?: string;
  description?: string;
  status?: Task["status"];
  priority?: Task["priority"];
  due_date?: string;
}

export const tasksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all tasks
    getAllTasks: builder.query<Task[], void>({
      async queryFn() {
        try {
          const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Get tasks error:", error);
            return { error: { message: error.message } };
          }

          return { data: data || [] };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred fetching tasks",
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ task_id }) => ({
                type: "Tasks" as const,
                id: task_id,
              })),
              { type: "Tasks", id: "LIST" },
            ]
          : [{ type: "Tasks", id: "LIST" }],
    }),

    // Get tasks by project
    getProjectTasks: builder.query<Task[], number>({
      async queryFn(projectId) {
        try {
          const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("project_id", projectId)
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Get project tasks error:", error);
            return { error: { message: error.message } };
          }

          return { data: data || [] };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message ||
                "An unexpected error occurred fetching project tasks",
            },
          };
        }
      },
      providesTags: (result, error, projectId) =>
        result
          ? [
              ...result.map(({ task_id }) => ({
                type: "Tasks" as const,
                id: task_id,
              })),
              { type: "Tasks", id: `PROJECT_${projectId}` },
            ]
          : [{ type: "Tasks", id: `PROJECT_${projectId}` }],
    }),

    // Get single task by ID
    getTaskById: builder.query<Task, number>({
      async queryFn(taskId) {
        try {
          const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .eq("task_id", taskId)
            .single();

          if (error) {
            console.error("Get task error:", error);
            return { error: { message: error.message } };
          }

          return { data };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred fetching task",
            },
          };
        }
      },
      providesTags: (result, error, id) => [{ type: "Tasks", id }],
    }),

    // Create new task
    createTask: builder.mutation<Task, CreateTaskParams>({
      async queryFn({
        project_id,
        name,
        description,
        status,
        priority,
        due_date,
        created_by,
        assignee_ids,
      }) {
        try {
          const { data: taskData, error: taskError } = await supabase
            .from("tasks")
            .insert({
              project_id,
              name,
              description,
              status,
              priority,
              due_date,
              created_by,
            })
            .select()
            .single();

          if (taskError) {
            console.error("Create task error:", taskError);
            return { error: { message: taskError.message } };
          }

          if (!taskData) {
            return { error: { message: "Failed to create task" } };
          }

          // Add task assignments
          if (assignee_ids && assignee_ids.length > 0) {
            const assignmentInserts = assignee_ids.map((user_id) => ({
              task_id: taskData.task_id,
              user_id,
            }));

            const { error: assignmentsError } = await supabase
              .from("task_assignments")
              .insert(assignmentInserts);

            if (assignmentsError) {
              console.error("Add task assignments error:", assignmentsError);
            }
          }

          return { data: taskData };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred creating task",
            },
          };
        }
      },
      invalidatesTags: (result, error, { project_id }) => [
        { type: "Tasks", id: `PROJECT_${project_id}` },
      ],
    }),

    // Update task
    updateTask: builder.mutation<Task, UpdateTaskParams>({
      async queryFn({ task_id, ...updates }) {
        try {
          const { data, error } = await supabase
            .from("tasks")
            .update(updates)
            .eq("task_id", task_id)
            .select()
            .single();

          if (error) {
            console.error("Update task error:", error);
            return { error: { message: error.message } };
          }

          if (!data) {
            return { error: { message: "Failed to update task" } };
          }

          return { data };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred updating task",
            },
          };
        }
      },
      invalidatesTags: (result, error, { task_id }) => [
        { type: "Tasks", id: task_id },
      ],
    }),

    // Delete task
    deleteTask: builder.mutation<void, number>({
      async queryFn(taskId) {
        try {
          const { error } = await supabase
            .from("tasks")
            .delete()
            .eq("task_id", taskId);

          if (error) {
            console.error("Delete task error:", error);
            return { error: { message: error.message } };
          }

          return { data: undefined };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred deleting task",
            },
          };
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: "Tasks", id },
        { type: "Tasks", id: "LIST" },
      ],
    }),

    // Get task assignments
    getTaskAssignments: builder.query<TaskAssignment[], number>({
      async queryFn(taskId) {
        try {
          const { data, error } = await supabase
            .from("task_assignments")
            .select("*")
            .eq("task_id", taskId);

          if (error) {
            console.error("Get task assignments error:", error);
            return { error: { message: error.message } };
          }

          return { data: data || [] };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message ||
                "An unexpected error occurred fetching assignments",
            },
          };
        }
      },
      providesTags: (result, error, taskId) => [
        { type: "Tasks", id: `ASSIGNMENTS_${taskId}` },
      ],
    }),

    // Assign user to task
    assignTaskToUser: builder.mutation<
      TaskAssignment,
      { task_id: number; user_id: number }
    >({
      async queryFn({ task_id, user_id }) {
        try {
          const { data, error } = await supabase
            .from("task_assignments")
            .insert({
              task_id,
              user_id,
            })
            .select()
            .single();

          if (error) {
            console.error("Assign task error:", error);
            return { error: { message: error.message } };
          }

          return { data };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred assigning task",
            },
          };
        }
      },
      invalidatesTags: (result, error, { task_id }) => [
        { type: "Tasks", id: `ASSIGNMENTS_${task_id}` },
      ],
    }),

    // Unassign user from task
    unassignTaskFromUser: builder.mutation<
      void,
      { task_id: number; user_id: number }
    >({
      async queryFn({ task_id, user_id }) {
        try {
          const { error } = await supabase
            .from("task_assignments")
            .delete()
            .eq("task_id", task_id)
            .eq("user_id", user_id);

          if (error) {
            console.error("Unassign task error:", error);
            return { error: { message: error.message } };
          }

          return { data: undefined };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred unassigning task",
            },
          };
        }
      },
      invalidatesTags: (result, error, { task_id }) => [
        { type: "Tasks", id: `ASSIGNMENTS_${task_id}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllTasksQuery,
  useGetProjectTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetTaskAssignmentsQuery,
  useAssignTaskToUserMutation,
  useUnassignTaskFromUserMutation,
} = tasksApi;
