import './App.css';
import { HeroUIProvider } from '@heroui/react';
import { Toaster } from 'sonner';
import Tailwind from 'primereact/passthrough/tailwind';
import { HelmetProvider } from 'react-helmet-async';
import { PrimeReactProvider } from 'primereact/api';
import { useEffect } from 'react';

import ActionsProvider from './hooks/useActions';
import Main from './pages/Main';
import SessionProvider from './hooks/useSession';
import ThemeProvider from './hooks/useTheme';
import { useViewsStore } from './store/views.store';
import { useAuthStore } from './store/auth.store';
import { AlertProvider } from './lib/alert';
import PermissionProvider from './hooks/usePermission';
import SocketContext from './pages/SocketContext';

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
            <ThemeProvider >
              <Toaster richColors />
              <HeroUIProvider labelPlacement="outside" >
                <ActionsProvider>
                  <PermissionProvider>
                    <SocketContext/>
                    <Main />
                  </PermissionProvider>
                </ActionsProvider>
              </HeroUIProvider>
            </ThemeProvider>
          </SessionProvider>
        </PrimeReactProvider>
      </AlertProvider>
    </HelmetProvider>
  );
}

export default App;
