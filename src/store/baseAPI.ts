import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User", "Project", "Task"], // optional tags for caching
  endpoints: () => ({}), // will be injected later
});
