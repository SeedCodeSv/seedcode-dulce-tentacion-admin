import "./App.css";
import ThemeProvider from "./hooks/useTheme";
import { NextUIProvider } from "@nextui-org/react";
import { Toaster } from "sonner";
import SessionProvider from "./hooks/useSession";
import Main from "./pages/Main";
import Tailwind from "primereact/passthrough/tailwind";

import { PrimeReactProvider } from "primereact/api";
import ActionsProvider from "./hooks/useActions";

function App() {
  return (
     <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
      <SessionProvider>
        <ThemeProvider>
          <Toaster richColors />
          <NextUIProvider>
            <ActionsProvider>
              <Main/>   
            </ActionsProvider> 
          </NextUIProvider>
        </ThemeProvider>
      </SessionProvider>
    </PrimeReactProvider>
  );
}

export default App;
