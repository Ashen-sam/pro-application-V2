import baseApi from "@/store/baseAPI";

export interface User {
  name: string;
  email: string;
}

export interface Project {
  project_id: number;
  name?: string;
  owner_id: number;
  description?: string;
  status?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  created_at?: string;
  updated_at?: string;
  memberEmails?: string[];
}

export interface ProjectMember {
  project_id: number;
  user_id: number;
  role: string;
  added_at: string;
  users: User;
}

export interface SearchUser {
  user_id: number;
  name: string;
  email: string;
}

export interface ApiResponse {
  success: boolean;
  error?: {
    code?: string;
    message?: string;
    details?: string;
    hint?: string | null;
  };
  message?: string;
}

export interface ListProjectsResponse extends ApiResponse {
  projects: Project[];
}

export interface GetProjectResponse extends ApiResponse {
  project: Project;
}

export interface CreateProjectResponse extends ApiResponse {
  project: Project;
  membersAdded?: number;
}

export interface UpdateProjectResponse extends ApiResponse {
  project: Project;
}

export interface DeleteProjectResponse extends ApiResponse {
  success: true;
  deletedCount?: number;
}

export interface ListProjectMembersResponse extends ApiResponse {
  members: ProjectMember[];
}

export interface AddProjectMemberResponse extends ApiResponse {
  member: ProjectMember;
}

export interface SearchUsersResponse extends ApiResponse {
  users: SearchUser[];
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  status?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  owner_id: number;
  memberEmails?: string[];
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  start_date?: string;
  end_date?: string;
  memberEmails?: string[];
}

export interface AddProjectMemberRequest {
  user_id: number;
  role?: string;
}

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    listProjects: builder.query<Project[], void>({
      query: () => "/projects",
      keepUnusedDataFor: 300,
      transformResponse: (response: ListProjectsResponse) => {
        // Handle error responses
        if (!response.success || !response.projects) {
          return [];
        }
        return response.projects;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ project_id }) => ({
                type: "Project" as const,
                id: project_id,
              })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),

    searchUsers: builder.query<SearchUser[], string>({
      query: (q) => `/users/search?q=${encodeURIComponent(q)}`,
      transformResponse: (response: SearchUsersResponse) => {
        if (!response.success || !response.users) {
          return [];
        }
        return response.users;
      },
    }),

    getProjectById: builder.query<Project, number>({
      query: (projectId) => `/projects/${projectId}`,
      transformResponse: (response: GetProjectResponse) => response.project,
      providesTags: (_r, _e, projectId) => [{ type: "Project", id: projectId }],
    }),

    createProject: builder.mutation<Project, CreateProjectRequest>({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      transformResponse: (response: CreateProjectResponse) => response.project,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        const tempId = Date.now();
        const optimisticProject: Project = {
          project_id: tempId,
          name: arg.name,
          description: arg.description,
          status: arg.status,
          priority: arg.priority,
          start_date: arg.start_date,
          end_date: arg.end_date,
          owner_id: arg.owner_id,
          memberEmails: arg.memberEmails || [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const patch = dispatch(
          projectApi.util.updateQueryData(
            "listProjects",
            undefined,
            (draft) => {
              draft.unshift(optimisticProject);
            }
          )
        );

        try {
          const { data } = await queryFulfilled;
          dispatch(
            projectApi.util.updateQueryData(
              "listProjects",
              undefined,
              (draft) => {
                const index = draft.findIndex((p) => p.project_id === tempId);
                if (index !== -1) {
                  draft[index] = {
                    ...data,
                    memberEmails: data.memberEmails || arg.memberEmails || [],
                  };
                }
              }
            )
          );
        } catch {
          patch.undo();
        }
      },
    }),

    updateProject: builder.mutation<
      Project,
      { projectId: number; data: UpdateProjectRequest }
    >({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: UpdateProjectResponse) => response.project,
      async onQueryStarted({ projectId, data }, { dispatch, queryFulfilled }) {
        const patchList = dispatch(
          projectApi.util.updateQueryData(
            "listProjects",
            undefined,
            (draft) => {
              const project = draft.find((p) => p.project_id === projectId);
              if (project) {
                Object.assign(project, data);
                if (data.memberEmails !== undefined) {
                  project.memberEmails = data.memberEmails;
                }
              }
            }
          )
        );
        const patchSingle = dispatch(
          projectApi.util.updateQueryData(
            "getProjectById",
            projectId,
            (draft) => {
              Object.assign(draft, data);
              if (data.memberEmails !== undefined) {
                draft.memberEmails = data.memberEmails;
              }
            }
          )
        );
        try {
          const { data: updatedProject } = await queryFulfilled;
          dispatch(
            projectApi.util.updateQueryData(
              "listProjects",
              undefined,
              (draft) => {
                const project = draft.find((p) => p.project_id === projectId);
                if (project) {
                  Object.assign(project, updatedProject);
                }
              }
            )
          );
        } catch {
          patchList.undo();
          patchSingle.undo();
        }
      },
    }),

    deleteProject: builder.mutation<DeleteProjectResponse, number | number[]>({
      query: (projectIdOrIds) => {
        // Check if it's an array (bulk delete)
        if (Array.isArray(projectIdOrIds)) {
          return {
            url: `/projects/${projectIdOrIds[0]}`, // Use first ID for route
            method: "DELETE",
            body: { projectIds: projectIdOrIds },
          };
        }
        // Single delete
        return {
          url: `/projects/${projectIdOrIds}`,
          method: "DELETE",
        };
      },
      async onQueryStarted(projectIdOrIds, { dispatch, queryFulfilled }) {
        const idsToDelete = Array.isArray(projectIdOrIds)
          ? projectIdOrIds
          : [projectIdOrIds];

        const patch = dispatch(
          projectApi.util.updateQueryData(
            "listProjects",
            undefined,
            (draft) => {
              return draft.filter((p) => !idsToDelete.includes(p.project_id));
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
    }),

    listProjectMembers: builder.query<ProjectMember[], number>({
      query: (projectId) => `/projects/${projectId}/members`,
      transformResponse: (response: ListProjectMembersResponse) => {
        if (!response.success || !response.members) {
          return [];
        }
        return response.members;
      },
      providesTags: (_r, _e, projectId) => [
        { type: "ProjectMember", id: `PROJECT_${projectId}` },
        { type: "ProjectMember", id: "LIST" },
      ],
    }),

    sendProjectInvites: builder.mutation<
      { success: boolean; message: string; emailsSent?: number },
      { projectId: number; memberEmails: string[] }
    >({
      query: ({ projectId, memberEmails }) => ({
        url: `/projects/${projectId}/invites`,
        method: "POST",
        body: { memberEmails },
      }),
      transformErrorResponse: (response: {
        status: number;
        data?: ApiResponse;
      }) => {
        return {
          status: response.status,
          data: response.data || {
            success: false,
            message: "Failed to send invites",
          },
        };
      },
    }),

    addProjectMember: builder.mutation<
      ProjectMember,
      { projectId: number; data: AddProjectMemberRequest }
    >({
      query: ({ projectId, data }) => ({
        url: `/projects/${projectId}/members`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: AddProjectMemberResponse) =>
        response.member,
      async onQueryStarted({ projectId, data }, { dispatch, queryFulfilled }) {
        const tempMember: ProjectMember = {
          project_id: projectId,
          user_id: data.user_id,
          role: data.role ?? "member",
          added_at: new Date().toISOString(),
          users: { name: "Pending...", email: "" },
        };
        const patch = dispatch(
          projectApi.util.updateQueryData(
            "listProjectMembers",
            projectId,
            (draft) => {
              draft.push(tempMember);
            }
          )
        );
        try {
          const { data: realMember } = await queryFulfilled;
          dispatch(
            projectApi.util.updateQueryData(
              "listProjectMembers",
              projectId,
              (draft) => {
                const index = draft.findIndex(
                  (m) => m.user_id === tempMember.user_id
                );
                if (index !== -1) draft[index] = realMember;
              }
            )
          );
        } catch {
          patch.undo();
        }
      },
    }),
  }),
});

export const {
  useListProjectsQuery,
  useSearchUsersQuery,
  useLazySearchUsersQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useListProjectMembersQuery,
  useAddProjectMemberMutation,
  useSendProjectInvitesMutation,
} = projectApi;
