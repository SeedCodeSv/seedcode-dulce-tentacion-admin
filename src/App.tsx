import { useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import ThemeProvider from "./hooks/useTheme";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import SessionProvider from "./hooks/useSession";

function App() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Toaster richColors />
        <NextUIProvider>
          <RouterProvider router={router()} />
        </NextUIProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default App;
