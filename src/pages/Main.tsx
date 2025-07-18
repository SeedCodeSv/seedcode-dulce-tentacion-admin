import { useContext, useEffect, useMemo } from 'react';
import { RouterProvider } from 'react-router-dom';
import Lottie from 'lottie-react';

import { router } from '../router';
import { SessionContext } from '../hooks/useSession';

import Auth from './Auth';

import { PermissionContext } from '@/hooks/usePermission';
import { useActionsRolStore } from '@/store/role-actions.store';
import { useAuthStore } from '@/store/auth.store';
import ERROR401 from '@/assets/animations/error_401.json';
import ButtonUi from '@/themes/ui/button-ui';
import { Colors } from '@/types/themes.types';

function Main() {
  const { isAuth } = useContext(SessionContext);

  const { role_actions_by_user, loading_actions, OnGetActionsByUser } = useActionsRolStore();
  const { user } = useAuthStore();
  const { setRoleActions } = useContext(PermissionContext);

  useEffect(() => {
    if (user) {
      OnGetActionsByUser(user.roleId);
    }
  }, [user]);

  useEffect(() => {
    if (role_actions_by_user) {
      setRoleActions(role_actions_by_user.roleActions);
    }
  }, [role_actions_by_user]);

  const isPdfPreview = window.location.pathname === '/pdf-preview';
// const routerInstance = useMemo(() => router({ roleActions }), [roleActions]);


 return (
  <>
    {isAuth && user ? (
      <>
        {loading_actions && !isPdfPreview ? (
          <div className="w-screen h-screen flex flex-col justify-center items-center">
            <div className="loader" />
            <p className="mt-3 text-xl font-semibold">Cargando...</p>
          </div>
        ) : loading_actions ? (
          <></>
        ) : role_actions_by_user ? (
          <RouterProvider
            router={router({ roleActions: role_actions_by_user.roleActions })}
          />
        ) : (
          <div className="w-screen h-screen flex justify-center items-center flex-col">
            <Lottie animationData={ERROR401} className="w-96" />
            <p className="text-lg font-semibold dark:text-white">
              Parece que no tiene permisos para acceder a esta sección
            </p>
            <div className="w-96 grid grid-cols-2 mt-4 gap-5">
              <ButtonUi
                className="font-semibold"
                theme={Colors.Primary}
                onPress={() => (window.location.href = '/')}
              >
                Ir a inicio
              </ButtonUi>
              <ButtonUi
                className="font-semibold"
                theme={Colors.Info}
                onPress={() => window.location.reload()}
              >
                Recargar
              </ButtonUi>
            </div>
          </div>
        )}
      </>
    ) : (
      <Auth />
    )}
  </>
);

}

export default Main;
