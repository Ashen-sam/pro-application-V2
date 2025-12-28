import baseApi from "@/store/baseAPI";

export interface Project {
  project_id: number;
  name: string;
  status: string;
  priority: string;
  project_uuid?: string;
  end_date: string;
  owner_id: number;
  created_at: string;
}

export interface ProjectReference {
  project_id: number;
  project_uuid?: string;
  name: string;
}

export interface Task {
  task_id: number;
  project_id: number;
  name: string;
  description: string | null;
  project_uuid?: string;
  status: string;
  priority: string;
  due_date: string | null;
  created_at: string;
  project: ProjectReference | null;
}

export interface DashboardStats {
  projectsByStatus: Record<string, number>;
  tasksByStatus: Record<string, number>;
  projectsByPriority: Record<string, number>;
}

export interface DashboardData {
  completedProjects: number;
  totalProjects: number;
  totalTeamMembers: number;
  recentTasks: Task[];
  upcomingDeadlines: Task[];
  stats: DashboardStats;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardData;
  message?: string;
  error?: unknown;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get Dashboard Data
    getDashboardData: builder.query<DashboardResponse, void>({
      query: () => ({
        url: "/dashboard",
        method: "GET",
      }),
      // Provide tags for cache invalidation
      providesTags: ["Project", "Task", "ProjectMember"],
      // Transform response if needed
      transformResponse: (response: DashboardResponse) => response,
      // Transform error if needed
      transformErrorResponse: (response: { status: string | number }) =>
        response,
      // Keep data fresh - refetch every 5 minutes
      keepUnusedDataFor: 300,
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardDataQuery, useLazyGetDashboardDataQuery } =
  dashboardApi;
