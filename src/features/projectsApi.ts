import { supabase } from "@/lib/supabaseClient";
import { baseApi } from "@/store/baseAPI";

export interface Project {
  project_id: number;
  name: string;
  description: string;
  status: "pending" | "in_review" | "in_progress" | "submitted" | "success";
  priority: "low" | "medium" | "high" | "critical";
  start_date: string;
  end_date: string;
  owner_id: number;
  created_at: string;
}

export interface ProjectMember {
  project_id: number;
  user_id: number;
  role: "owner" | "admin" | "editor" | "viewer";
  added_at: string;
}

interface CreateProjectParams {
  name: string;
  description: string;
  status: Project["status"];
  priority: Project["priority"];
  start_date: string;
  end_date: string;
  owner_id: number;
  member_ids?: number[];
}

interface UpdateProjectParams {
  project_id: number;
  name?: string;
  description?: string;
  status?: Project["status"];
  priority?: Project["priority"];
  start_date?: string;
  end_date?: string;
}

export const projectsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all projects
    getAllProjects: builder.query<Project[], void>({
      async queryFn() {
        try {
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Get projects error:", error);
            return { error: { message: error.message } };
          }

          return { data: data || [] };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred fetching projects",
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ project_id }) => ({
                type: "Projects" as const,
                id: project_id,
              })),
              { type: "Projects", id: "LIST" },
            ]
          : [{ type: "Projects", id: "LIST" }],
    }),

    // Get projects by user (owner or member)
    getUserProjects: builder.query<Project[], number>({
      async queryFn(userId) {
        try {
          const { data: ownedProjects, error: ownedError } = await supabase
            .from("projects")
            .select("*")
            .eq("owner_id", userId);

          if (ownedError) {
            console.error("Get owned projects error:", ownedError);
            return { error: { message: ownedError.message } };
          }

          const { data: memberProjects, error: memberError } = await supabase
            .from("project_members")
            .select("project_id")
            .eq("user_id", userId);

          if (memberError) {
            console.error("Get member projects error:", memberError);
            return { error: { message: memberError.message } };
          }

          const memberProjectIds =
            memberProjects?.map((m) => m.project_id) || [];

          let allMemberProjects: Project[] = [];
          if (memberProjectIds.length > 0) {
            const { data: projectsData, error: projectsError } = await supabase
              .from("projects")
              .select("*")
              .in("project_id", memberProjectIds);

            if (projectsError) {
              console.error("Get member project details error:", projectsError);
              return { error: { message: projectsError.message } };
            }

            allMemberProjects = projectsData || [];
          }

          const allProjects = [...(ownedProjects || []), ...allMemberProjects];
          const uniqueProjects = allProjects.filter(
            (project, index, self) =>
              index ===
              self.findIndex((p) => p.project_id === project.project_id)
          );

          return { data: uniqueProjects };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message ||
                "An unexpected error occurred fetching user projects",
            },
          };
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ project_id }) => ({
                type: "Projects" as const,
                id: project_id,
              })),
              { type: "Projects", id: "USER_LIST" },
            ]
          : [{ type: "Projects", id: "USER_LIST" }],
    }),

    // Get single project by ID
    getProjectById: builder.query<Project, number>({
      async queryFn(projectId) {
        try {
          const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("project_id", projectId)
            .single();

          if (error) {
            console.error("Get project error:", error);
            return { error: { message: error.message } };
          }

          return { data };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred fetching project",
            },
          };
        }
      },
      providesTags: (result, error, id) => [{ type: "Projects", id }],
    }),

    // Create new project with optimistic update
    createProject: builder.mutation<Project, CreateProjectParams>({
      async queryFn({
        name,
        description,
        status,
        priority,
        start_date,
        end_date,
        owner_id,
        member_ids,
      }) {
        try {
          const { data: projectData, error: projectError } = await supabase
            .from("projects")
            .insert({
              name,
              description,
              status,
              priority,
              start_date,
              end_date,
              owner_id,
            })
            .select()
            .single();

          if (projectError) {
            console.error("Create project error:", projectError);
            return { error: { message: projectError.message } };
          }

          if (!projectData) {
            return { error: { message: "Failed to create project" } };
          }

          const { error: ownerMemberError } = await supabase
            .from("project_members")
            .insert({
              project_id: projectData.project_id,
              user_id: owner_id,
              role: "owner",
            });

          if (ownerMemberError) {
            console.error("Add owner as member error:", ownerMemberError);
          }

          if (member_ids && member_ids.length > 0) {
            const memberInserts = member_ids
              .filter((id) => id !== owner_id)
              .map((user_id) => ({
                project_id: projectData.project_id,
                user_id,
                role: "editor" as const,
              }));

            if (memberInserts.length > 0) {
              const { error: membersError } = await supabase
                .from("project_members")
                .insert(memberInserts);

              if (membersError) {
                console.error("Add members error:", membersError);
              }
            }
          }

          return { data: projectData };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred creating project",
            },
          };
        }
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        // Create optimistic project with temporary ID
        const tempId = Date.now();
        const optimisticProject: Project = {
          project_id: tempId,
          name: args.name,
          description: args.description,
          status: args.status,
          priority: args.priority,
          start_date: args.start_date,
          end_date: args.end_date,
          owner_id: args.owner_id,
          created_at: new Date().toISOString(),
        };

        // Optimistically update getAllProjects
        const patchAllProjects = dispatch(
          projectsApi.util.updateQueryData(
            "getAllProjects",
            undefined,
            (draft) => {
              draft.unshift(optimisticProject);
            }
          )
        );

        // Optimistically update getUserProjects
        const patchUserProjects = dispatch(
          projectsApi.util.updateQueryData(
            "getUserProjects",
            args.owner_id,
            (draft) => {
              draft.unshift(optimisticProject);
            }
          )
        );

        try {
          const { data } = await queryFulfilled;

          // Replace optimistic project with real one
          dispatch(
            projectsApi.util.updateQueryData(
              "getAllProjects",
              undefined,
              (draft) => {
                const index = draft.findIndex((p) => p.project_id === tempId);
                if (index !== -1) {
                  draft[index] = data;
                }
              }
            )
          );

          dispatch(
            projectsApi.util.updateQueryData(
              "getUserProjects",
              args.owner_id,
              (draft) => {
                const index = draft.findIndex((p) => p.project_id === tempId);
                if (index !== -1) {
                  draft[index] = data;
                }
              }
            )
          );
        } catch {
          // Revert optimistic updates on error
          patchAllProjects.undo();
          patchUserProjects.undo();
        }
      },
      invalidatesTags: [{ type: "Projects", id: "LIST" }],
    }),

    // Update project with optimistic update
    updateProject: builder.mutation<Project, UpdateProjectParams>({
      async queryFn({ project_id, ...updates }) {
        try {
          const { data, error } = await supabase
            .from("projects")
            .update(updates)
            .eq("project_id", project_id)
            .select()
            .single();

          if (error) {
            console.error("Update project error:", error);
            return { error: { message: error.message } };
          }

          if (!data) {
            return { error: { message: "Failed to update project" } };
          }

          return { data };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred updating project",
            },
          };
        }
      },
      async onQueryStarted(
        { project_id, ...patch },
        { dispatch, queryFulfilled }
      ) {
        // Optimistically update getAllProjects
        const patchAllProjects = dispatch(
          projectsApi.util.updateQueryData(
            "getAllProjects",
            undefined,
            (draft) => {
              const project = draft.find((p) => p.project_id === project_id);
              if (project) {
                Object.assign(project, patch);
              }
            }
          )
        );

        // Optimistically update getProjectById
        const patchProjectById = dispatch(
          projectsApi.util.updateQueryData(
            "getProjectById",
            project_id,
            (draft) => {
              Object.assign(draft, patch);
            }
          )
        );

        // Optimistically update all getUserProjects queries
        const patchResults: any[] = [];
        const state = dispatch(projectsApi.util.getRunningQueriesThunk());

        try {
          await queryFulfilled;
        } catch {
          // Revert all optimistic updates on error
          patchAllProjects.undo();
          patchProjectById.undo();
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, { project_id }) => [
        { type: "Projects", id: project_id },
      ],
    }),

    // Delete project with optimistic update
    deleteProject: builder.mutation<void, number>({
      async queryFn(projectId) {
        try {
          const { error } = await supabase
            .from("projects")
            .delete()
            .eq("project_id", projectId);

          if (error) {
            console.error("Delete project error:", error);
            return { error: { message: error.message } };
          }

          return { data: undefined };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred deleting project",
            },
          };
        }
      },
      async onQueryStarted(projectId, { dispatch, queryFulfilled }) {
        // Optimistically remove from getAllProjects
        const patchAllProjects = dispatch(
          projectsApi.util.updateQueryData(
            "getAllProjects",
            undefined,
            (draft) => {
              return draft.filter((p) => p.project_id !== projectId);
            }
          )
        );

        // Store patches for potential rollback
        const patchResults: any[] = [patchAllProjects];

        try {
          await queryFulfilled;
        } catch {
          // Revert all optimistic updates on error
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: (result, error, id) => [
        { type: "Projects", id },
        { type: "Projects", id: "LIST" },
        { type: "Projects", id: "USER_LIST" },
      ],
    }),

    // Get project members
    getProjectMembers: builder.query<ProjectMember[], number>({
      async queryFn(projectId) {
        try {
          const { data, error } = await supabase
            .from("project_members")
            .select("*")
            .eq("project_id", projectId);

          if (error) {
            console.error("Get project members error:", error);
            return { error: { message: error.message } };
          }

          return { data: data || [] };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred fetching members",
            },
          };
        }
      },
      providesTags: (result, error, projectId) => [
        { type: "Projects", id: `MEMBERS_${projectId}` },
      ],
    }),

    // Add project member with optimistic update
    addProjectMember: builder.mutation<
      ProjectMember,
      { project_id: number; user_id: number; role?: ProjectMember["role"] }
    >({
      async queryFn({ project_id, user_id, role = "viewer" }) {
        try {
          const { data, error } = await supabase
            .from("project_members")
            .insert({
              project_id,
              user_id,
              role,
            })
            .select()
            .single();

          if (error) {
            console.error("Add project member error:", error);
            return { error: { message: error.message } };
          }

          return { data };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred adding member",
            },
          };
        }
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const optimisticMember: ProjectMember = {
          project_id: args.project_id,
          user_id: args.user_id,
          role: args.role || "viewer",
          added_at: new Date().toISOString(),
        };

        const patchResult = dispatch(
          projectsApi.util.updateQueryData(
            "getProjectMembers",
            args.project_id,
            (draft) => {
              draft.push(optimisticMember);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { project_id }) => [
        { type: "Projects", id: `MEMBERS_${project_id}` },
      ],
    }),

    // Remove project member with optimistic update
    removeProjectMember: builder.mutation<
      void,
      { project_id: number; user_id: number }
    >({
      async queryFn({ project_id, user_id }) {
        try {
          const { error } = await supabase
            .from("project_members")
            .delete()
            .eq("project_id", project_id)
            .eq("user_id", user_id);

          if (error) {
            console.error("Remove project member error:", error);
            return { error: { message: error.message } };
          }

          return { data: undefined };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred removing member",
            },
          };
        }
      },
      async onQueryStarted(
        { project_id, user_id },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          projectsApi.util.updateQueryData(
            "getProjectMembers",
            project_id,
            (draft) => {
              return draft.filter((m) => m.user_id !== user_id);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { project_id }) => [
        { type: "Projects", id: `MEMBERS_${project_id}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllProjectsQuery,
  useGetUserProjectsQuery,
  useGetProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
  useGetProjectMembersQuery,
  useAddProjectMemberMutation,
  useRemoveProjectMemberMutation,
} = projectsApi;
