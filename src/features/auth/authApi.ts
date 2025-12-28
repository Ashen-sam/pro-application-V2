import baseApi from "@/store/baseAPI";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  UsersListResponse,
  DeleteUserResponse,
  SearchUsersResponse,
} from "../interfaces/userInterface";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============ USER ENDPOINTS ============

    // GET /users/me - Get current user profile
    getCurrentUser: builder.query<User, void>({
      query: () => "/users/me",
      transformResponse: (response: UserResponse) => response.user,
      providesTags: [{ type: "User", id: "CURRENT" }],
    }),

    // GET /users - List all users
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      transformResponse: (response: UsersListResponse) => response.users,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ user_id }) => ({
                type: "User" as const,
                id: user_id,
              })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    // GET /users/:userId - Get single user by ID
    getUserById: builder.query<User, number>({
      query: (userId) => `/users/${userId}`,
      transformResponse: (response: UserResponse) => response.user,
      providesTags: (_result, _error, userId) => [{ type: "User", id: userId }],
    }),

    // GET /users/clerk/:clerkId - Get user by Clerk ID
    getUserByClerkId: builder.query<User, string>({
      query: (clerkId) => `/users/clerk/${clerkId}`,
      transformResponse: (response: UserResponse) => response.user,
      providesTags: (result) =>
        result ? [{ type: "User", id: result.user_id }] : [],
    }),

    // GET /users/search?q=query - Search users by email
    searchUsersByEmail: builder.query<User[], string>({
      query: (query) => `/users/search?q=${encodeURIComponent(query)}`,
      transformResponse: (response: SearchUsersResponse) => response.users,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ user_id }) => ({
                type: "User" as const,
                id: user_id,
              })),
            ]
          : [],
    }),

    // POST /users - Create new user (sync from Clerk)
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      transformResponse: (response: UserResponse) => response.user,
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // PUT /users/:userId - Update user profile
    updateUser: builder.mutation<
      User,
      { userId: number; data: UpdateUserRequest }
    >({
      query: ({ userId, data }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: data,
      }),
      transformResponse: (response: UserResponse) => response.user,
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
        { type: "User", id: "CURRENT" },
      ],
    }),

    // DELETE /users/:userId - Delete user account
    deleteUser: builder.mutation<DeleteUserResponse, number>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
        { type: "User", id: "CURRENT" },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // User hooks
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserByClerkIdQuery,
  useSearchUsersByEmailQuery,
  useLazySearchUsersByEmailQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
