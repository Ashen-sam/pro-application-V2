import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { Clerk } from "@clerk/clerk-js";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Initialize Clerk instance
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error(
    "Missing VITE_CLERK_PUBLISHABLE_KEY in environment variables"
  );
}

const clerk = new Clerk(clerkPublishableKey);

// Ensure Clerk is loaded before making requests
let clerkLoadPromise: Promise<void> | null = null;

const ensureClerkLoaded = async () => {
  if (!clerkLoadPromise) {
    clerkLoadPromise = clerk.load();
  }
  await clerkLoadPromise;
};

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async (headers) => {
    headers.set("Content-Type", "application/json");

    try {
      // Ensure Clerk is loaded
      await ensureClerkLoaded();

      // Get the session token from Clerk
      const token = await clerk.session?.getToken();

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        console.warn("No Clerk session token available");
      }
    } catch (error) {
      console.error("Error getting Clerk auth token:", error);
    }

    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle 401 Unauthorized errors
  if (result.error && result.error.status === 401) {
    console.warn("Authentication failed (401). Redirecting to login...");

    try {
      // Sign out from Clerk
      await clerk.signOut();
    } catch (error) {
      console.error("Error signing out from Clerk:", error);
    }

    // Clear any local storage (if you're using any)
    localStorage.clear();

    // Redirect to login page if not already there
    if (
      !window.location.pathname.includes("/login") &&
      !window.location.pathname.includes("/register")
    ) {
      window.location.href = "/login";
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "User",
    "Project",
    "Task",
    "ProjectMember",
    "TaskAssignment",
    "Calendar",
  ],
  keepUnusedDataFor: 60, // Keep cached data for 60 seconds after last component unmounts
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds when component mounts
  refetchOnFocus: false, // Don't refetch when window regains focus (can be enabled if needed)
  refetchOnReconnect: true, // Refetch when internet reconnects
  endpoints: () => ({}),
});

export default baseApi;
