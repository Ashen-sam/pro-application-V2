import type { StatusType } from "@/components";
import baseApi from "@/store/baseAPI";
export interface Task {
  task_id: number;
  project_id: number;
  title?: string;
  description?: string;
  status?: StatusType;
  priority?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
}
export interface TaskAssignment {
  task_id: number;
  user_id: number;
  assigned_at?: string;
  users?: {
    name: string;
    email: string;
  };
}
export interface TasksListResponse {
  success: boolean;
  tasks: Task[];
}

export interface TaskResponse {
  success: boolean;
  task: Task;
}

export interface TaskAssignmentsResponse {
  success: boolean;
  assignees: TaskAssignment[];
}

export interface TaskAssignmentResponse {
  success: boolean;
  assignment: TaskAssignment;
}

export interface DeleteTaskResponse {
  success: boolean;
}

export interface ErrorResponse {
  success: boolean;
  error?: string | object;
  message?: string;
}
export interface CreateTaskRequest {
  project_id: number;
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string | null;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  due_date?: string;
  project_id?: number;
}

export interface AssignUserRequest {
  user_id: number;
}

/**
 * Query Parameters Interfaces
 */
export interface ListTasksParams {
  projectId?: number;
}

/**
 * RTK Query API for Tasks
 */
export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listTasks: builder.query<TasksListResponse, ListTasksParams | void>({
      query: (params) => ({
        url: "/tasks",
        params: params ? { projectId: params.projectId } : undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.tasks.map(({ task_id }) => ({
                type: "Task" as const,
                id: task_id,
              })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),

    getTaskById: builder.query<TaskResponse, number>({
      query: (taskId) => `/tasks/${taskId}`,
      providesTags: (result, error, taskId) => [{ type: "Task", id: taskId }],
    }),

    createTask: builder.mutation<TaskResponse, CreateTaskRequest>({
      query: (body) => ({
        url: "/tasks",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),

    updateTask: builder.mutation<
      TaskResponse,
      { taskId: number; body: UpdateTaskRequest }
    >({
      query: ({ taskId, body }) => ({
        url: `/tasks/${taskId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "Task", id: taskId },
        { type: "Task", id: "LIST" },
      ],
    }),

    deleteTask: builder.mutation<DeleteTaskResponse, number>({
      query: (taskId) => ({
        url: `/tasks/${taskId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, taskId) => [
        { type: "Task", id: taskId },
        { type: "Task", id: "LIST" },
        { type: "TaskAssignment", id: "LIST" },
      ],
    }),

    listTaskAssignments: builder.query<TaskAssignmentsResponse, number>({
      query: (taskId) => `/tasks/${taskId}/assignments`,
      providesTags: (result, error, taskId) => [
        { type: "TaskAssignment", id: taskId },
        { type: "TaskAssignment", id: "LIST" },
      ],
    }),

    assignUserToTask: builder.mutation<
      TaskAssignmentResponse,
      { taskId: number; user_id: number }
    >({
      query: ({ taskId, user_id }) => ({
        url: `/tasks/${taskId}/assignments`,
        method: "POST",
        body: { user_id },
      }),
      invalidatesTags: (result, error, { taskId }) => [
        { type: "TaskAssignment", id: taskId },
        { type: "TaskAssignment", id: "LIST" },
      ],
    }),
  }),
  overrideExisting: false,
});
export const {
  useListTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useListTaskAssignmentsQuery,
  useAssignUserToTaskMutation,
} = taskApi;
