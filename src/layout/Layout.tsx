import { useContext, useEffect } from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router';

import { ThemeContext } from '../hooks/useTheme';
import { useConfigurationStore } from '../store/perzonalitation.store';
import { useAuthStore } from '../store/auth.store';
import { ActionsContext } from '../hooks/useActions';
import { useActionsRolStore } from '../store/actions_rol.store';
import { encryptData } from '../plugins/crypto';

import { SideBar } from './side-bar';
import NavBar from './nav-bar';
import { returnTitleByPathname } from './utils';

function Layout() {
  const { context, navbar } = useContext(ThemeContext);

  const { user } = useAuthStore();

  const { GetConfigurationByTransmitter } = useConfigurationStore();

  const { setRoleActions, roleActions } = useContext(ActionsContext);
  const { OnGetActionsByRole } = useActionsRolStore();

  useEffect(() => {
    GetConfigurationByTransmitter(user?.pointOfSale?.branch.transmitterId ?? 0);
    if (!roleActions) {
      OnGetActionsByRole(user?.roleId ?? 0).then((data) => {
        if (data) {
          localStorage.setItem('_RVA', encryptData(data));
          setRoleActions(data);
        }
      });
    }
  }, [user]);

  const location = useLocation();

  return (
    <>
      <Helmet>
        <title>{returnTitleByPathname(location.pathname)}</title>
      </Helmet>

      <div
        className={classNames(
          'w-full h-full satoshi dark:bg-gray-900',
          context === 'dark' ? 'dark' : ''
        )}
      >
        {navbar === 'topbar' && (
          <>
            <div className="flex flex-col w-screen h-screen">
              <NavBar />
              <div className="w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-800">
                <Outlet />
              </div>
            </div>
          </>
        )}
        {navbar === 'sidebar' && (
          <>
            <SideBar title={returnTitleByPathname(location.pathname)}>
              <div className={classNames('w-full h-full overflow-y-auto')}>
                <Outlet />
              </div>
            </SideBar>
          </>
        )}
      </div>
    </>
  );
}

export default Layout;
