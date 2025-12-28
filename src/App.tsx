import "@xyflow/react/dist/style.css";
import { ClerkProvider } from "@clerk/clerk-react";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { router } from "./routes/routes";
import { store } from "./store/store";
import { AppTour } from "./components/tour/Apptour";

// Get Clerk publishable key from environment
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file");
}

const App = () => {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <AppTour />
      <Provider store={store}>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RouterProvider router={router} />
          <Toaster
            position="bottom-right"
            richColors
            closeButton
            duration={4000}
          />
        </ThemeProvider>
      </Provider>
    </ClerkProvider>
  );
};

export default App;