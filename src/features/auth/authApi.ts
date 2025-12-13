import { supabase } from "@/lib/supabaseClient";
import { baseApi } from "@/store/baseAPI";

interface SignUpParams {
  email: string;
  password: string;
  name: string;
}

interface SignInParams {
  email: string;
  password: string;
}

interface User {
  user_id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<User, SignUpParams>({
      async queryFn({ email, password, name }) {
        try {
          // Check if user already exists
          const { data: existingUsers, error: checkError } = await supabase
            .from("users")
            .select("email")
            .eq("email", email);

          if (checkError) {
            console.error("Check user error:", checkError);
            return { error: { message: checkError.message } };
          }

          if (existingUsers && existingUsers.length > 0) {
            return {
              error: { message: "User with this email already exists" },
            };
          }

          // Insert new user - don't use array syntax
          const { data: userData, error: userError } = await supabase
            .from("users")
            .insert({
              name: name,
              email: email,
              password: password, // ⚠️ Hash this on backend in production!
            })
            .select()
            .single();

          if (userError) {
            console.error("User creation error:", userError);
            return { error: { message: userError.message } };
          }

          if (!userData) {
            return { error: { message: "Failed to create user" } };
          }

          return { data: userData };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred during sign up",
            },
          };
        }
      },
      invalidatesTags: ["User"],
    }),

    signIn: builder.mutation<User, SignInParams>({
      async queryFn({ email, password }) {
        try {
          // Fetch user by email first
          const { data: users, error: userError } = await supabase
            .from("users")
            .select("*")
            .eq("email", email);

          if (userError) {
            console.error("Sign in error:", userError);
            return { error: { message: "Invalid email or password" } };
          }

          if (!users || users.length === 0) {
            return { error: { message: "Invalid email or password" } };
          }

          const user = users[0];

          // Check password (in production, use proper password hashing!)
          if (user.password !== password) {
            return { error: { message: "Invalid email or password" } };
          }

          return { data: user };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred during sign in",
            },
          };
        }
      },
      invalidatesTags: ["User"],
    }),

    signOut: builder.mutation<string, void>({
      async queryFn() {
        try {
          // Clear local storage or session data
          // This is handled on the frontend
          return { data: "signed_out" };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred during sign out",
            },
          };
        }
      },
      invalidatesTags: ["User"],
    }),

    getUserProfile: builder.query<User, number>({
      async queryFn(userId) {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("user_id", userId)
            .single();

          if (error) {
            console.error("Get profile error:", error);
            return { error: { message: error.message } };
          }

          return { data };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred fetching profile",
            },
          };
        }
      },
      providesTags: ["User"],
    }),

    updateUserProfile: builder.mutation<
      User,
      { userId: number; name: string; email: string }
    >({
      async queryFn({ userId, name, email }) {
        try {
          const { data, error } = await supabase
            .from("users")
            .update({ name, email })
            .eq("user_id", userId)
            .select()
            .single();

          if (error) {
            console.error("Update profile error:", error);
            return { error: { message: error.message } };
          }

          return { data };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred updating profile",
            },
          };
        }
      },
      invalidatesTags: ["User"],
    }),

    getAllUsers: builder.query<Omit<User, "password">[], void>({
      async queryFn() {
        try {
          const { data, error } = await supabase
            .from("users")
            .select("user_id, name, email, created_at")
            .order("created_at", { ascending: false });

          if (error) {
            console.error("Get all users error:", error);
            return { error: { message: error.message } };
          }

          return { data: data || [] };
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return {
            error: {
              message:
                err.message || "An unexpected error occurred fetching users",
            },
          };
        }
      },
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useSignOutMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetAllUsersQuery,
} = authApi;
