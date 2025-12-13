import "@xyflow/react/dist/style.css";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { ThemeProvider } from "./components/theme-provider";
import { router } from "./routes/routes";
import { Provider } from "react-redux";
import { store } from "./store/store";

const App = () => {
  // Optional: auto-detect logged-in user on app start
  // useAuthInit();

  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </Provider>
  );
};

export default App;
