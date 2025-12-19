import baseApi from "@/store/baseAPI";
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  UsersListResponse,
  DeleteUserResponse,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  SearchUsersResponse,
} from "../interfaces/userInterface";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // ============ AUTH ENDPOINTS ============

    // POST /auth/register - Register new user
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // POST /auth/login - Login user
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    // ============ USER ENDPOINTS ============

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

    // POST /users - Create new user (admin endpoint)
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: "/users",
        method: "POST",
        body,
      }),
      transformResponse: (response: UserResponse) => response.user,
      invalidatesTags: [{ type: "User", id: "LIST" }],
    }),

    // PUT /users/:userId - Update user
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
      ],
    }),

    // DELETE /users/:userId - Delete user
    deleteUser: builder.mutation<DeleteUserResponse, number>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
        { type: "User", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks for usage in components
export const {
  // Auth hooks
  useRegisterMutation,
  useLoginMutation,

  // User hooks
  useGetUsersQuery,
  useGetUserByIdQuery,
  useSearchUsersByEmailQuery,
  useLazySearchUsersByEmailQuery, // For manual triggering
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
