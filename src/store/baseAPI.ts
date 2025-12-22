// src/services/api/baseApi.ts

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

// Base URL for your API - configure via environment variables
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Base query configuration
const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers) => {
    // Set common headers for all requests
    headers.set("Content-Type", "application/json");

    // Add authentication token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

// Base query with re-authentication logic
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // If we get a 401 Unauthorized, the token might be expired or invalid
  if (result.error && result.error.status === 401) {
    // Clear all auth-related data from localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");

    // Redirect to login page
    // Only redirect if not already on login/register pages
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

  // ✅ OPTIMIZED: Define cache tags for automatic cache invalidation
  tagTypes: [
    "User",
    "Project",
    "Task",
    "ProjectMember",
    "TaskAssignment",
    "Calendar",
  ],

  // ✅ OPTIMIZED: Configure global cache behavior
  // These settings work with the tags to provide intelligent caching
  keepUnusedDataFor: 60, // Keep cached data for 60 seconds after last component unmounts
  refetchOnMountOrArgChange: 30, // Refetch if data is older than 30 seconds when component mounts
  refetchOnFocus: false, // Don't refetch when window regains focus (can be enabled if needed)
  refetchOnReconnect: true, // Refetch when internet reconnects

  // Empty endpoints object - endpoints will be injected from separate files
  endpoints: () => ({}),
});

export default baseApi;
