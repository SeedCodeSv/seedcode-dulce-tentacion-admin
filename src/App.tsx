import './App.css';
import ThemeProvider from './hooks/useTheme';
import { NextUIProvider } from '@nextui-org/react';
import { Toaster } from 'sonner';
import SessionProvider from './hooks/useSession';
import Main from './pages/Main';
import Tailwind from 'primereact/passthrough/tailwind';
import { HelmetProvider } from 'react-helmet-async';
import { PrimeReactProvider } from 'primereact/api';
import ActionsProvider from './hooks/useActions';
import { useEffect } from 'react';
import { useViewsStore } from './store/views.store';
import { useAuthStore } from './store/auth.store';
import { AlertProvider } from './lib/alert';

function App() {
  const { OnGetActionsByRol, OnGetViewasAction } = useViewsStore();
  const { user } = useAuthStore();
  useEffect(() => {
    OnGetActionsByRol(user?.roleId ?? 0);
    OnGetViewasAction(1, 5, '');
  }, [OnGetActionsByRol]);

  return (
    <HelmetProvider>
      <AlertProvider>
        <PrimeReactProvider value={{ unstyled: true, pt: Tailwind }}>
          <SessionProvider>
            <ThemeProvider>
              <Toaster richColors />
              <NextUIProvider>
                <ActionsProvider>
                  <Main />
                </ActionsProvider>
              </NextUIProvider>
            </ThemeProvider>
          </SessionProvider>
        </PrimeReactProvider>
      </AlertProvider>
    </HelmetProvider>
  );
}

export default App;
