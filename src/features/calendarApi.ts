import baseApi from "@/store/baseAPI";

export interface CalendarProject {
  project_id: number | string;
  project_uuid?: string;
  name: string;
  description?: string | null;
  status: string;
  priority: string;
  start_date: string;
  end_date: string;
  owner_id: number;
  created_at: string;
  role: string;
  isOwner: boolean;
}

export interface CalendarTask {
  task_id: number;
  project_id: number | string;
  project_uuid?: string;
  name: string;
  description?: string | null;
  status: string;
  priority: string;
  due_date?: string | null;
  created_at: string;
  projects: {
    project_id: number | string;
    project_uuid?: string;
    name: string;
  } | null;
  assigned_at?: string;
  isAssigned: boolean;
}

export interface CalendarSummary {
  totalProjects: number;
  ownedProjects: number;
  memberProjects: number;
  totalTasks: number;
  assignedTasks: number;
}

export interface CalendarData {
  projects: CalendarProject[];
  tasks: CalendarTask[];
  summary: CalendarSummary;
}

export interface CalendarApiResponse {
  success: boolean;
  data?: CalendarData;
  error?: string;
  message?: string;
}

export interface CalendarQueryParams {
  start_date?: string;
  end_date?: string;
}

export const calendarApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCalendarData: builder.query<CalendarData, CalendarQueryParams | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params?.start_date) {
          queryParams.append("start_date", params.start_date);
        }
        if (params?.end_date) {
          queryParams.append("end_date", params.end_date);
        }
        const queryString = queryParams.toString();
        return `/calendar${queryString ? `?${queryString}` : ""}`;
      },
      keepUnusedDataFor: 300,
      transformResponse: (response: CalendarApiResponse) => {
        // FIXED: Added proper error handling
        if (!response.success) {
          throw new Error(
            response.error ||
              response.message ||
              "Failed to fetch calendar data"
          );
        }

        if (!response.data) {
          return {
            projects: [],
            tasks: [],
            summary: {
              totalProjects: 0,
              ownedProjects: 0,
              memberProjects: 0,
              totalTasks: 0,
              assignedTasks: 0,
            },
          };
        }
        return response.data;
      },
      providesTags: (result) => {
        if (!result) return [{ type: "Calendar", id: "LIST" }];

        return [
          { type: "Calendar", id: "LIST" },
          ...result.projects.map(({ project_uuid, project_id }) => ({
            type: "Calendar" as const,
            id: `PROJECT_${project_uuid || project_id}`, // ✅ Use UUID first
          })),
          ...result.tasks.map(({ task_id }) => ({
            type: "Calendar" as const,
            id: `TASK_${task_id}`,
          })),
        ];
      },
    }),
  }),
});

export const { useGetCalendarDataQuery, useLazyGetCalendarDataQuery } =
  calendarApi;
