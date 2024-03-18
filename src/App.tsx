import { useState } from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import ThemeProvider from "./hooks/useTheme";
import {NextUIProvider} from '@nextui-org/react'

function App() {

  return (
    <ThemeProvider>
      <NextUIProvider>
      <RouterProvider router={router()} />
      </NextUIProvider>
    </ThemeProvider>
  );
}

export default App;
