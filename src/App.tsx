import "./App.css";
import ThemeProvider from "./hooks/useTheme";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import SessionProvider from "./hooks/useSession";
import Main from "./pages/Main";

function App() {
  return (
    <SessionProvider>
      <ThemeProvider>
        <Toaster richColors />
        <NextUIProvider>
          <Main />
        </NextUIProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

export default App;
