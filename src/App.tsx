import "./App.css";
import ThemeProvider from "./hooks/useTheme";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import SessionProvider from "./hooks/useSession";
import Main from "./pages/Main";
import Tailwind from "primereact/passthrough/tailwind";

import { PrimeReactProvider } from "primereact/api";

function App() {
  return (
    <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
      <SessionProvider>
        <ThemeProvider>
          <Toaster richColors />
          <NextUIProvider>
            <Main />
          </NextUIProvider>
        </ThemeProvider>
      </SessionProvider>
    </PrimeReactProvider>
  );
}

export default App;
