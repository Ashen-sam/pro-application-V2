import { ClerkProvider } from "@clerk/clerk-react";
import "@xyflow/react/dist/style.css";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { router } from "./routes/routes";
import { store } from "./store/store";

const App = () => {
  const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY!;

  return (
    <Provider store={store}>
      <ClerkProvider publishableKey={clerkFrontendApi}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster />
        </ThemeProvider>
      </ClerkProvider>
    </Provider>
  );
};

export default App;
