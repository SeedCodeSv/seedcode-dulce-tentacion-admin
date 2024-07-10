import { useContext, useEffect } from 'react';
import { ThemeContext } from '../hooks/useTheme';
import NavBar from './NavBar';
import { SideBar } from './SideBar';
import classNames from 'classnames';
import { useConfigurationStore } from '../store/perzonalitation.store';
import { useAuthStore } from '../store/auth.store';
import { Helmet } from 'react-helmet-async';
import { ActionsContext } from '../hooks/useActions';
import { useActionsRolStore } from '../store/actions_rol.store';
import { encryptData } from '../plugins/crypto';

interface Props {
  children: JSX.Element;
  title: string;
}

function Layout(props: Props) {
  const { context, navbar } = useContext(ThemeContext);

  const { user } = useAuthStore();

  const { GetConfigurationByTransmitter } = useConfigurationStore();

  const { setRoleActions, roleActions } = useContext(ActionsContext);
  const { OnGetActionsByRole } = useActionsRolStore();

  useEffect(() => {
    GetConfigurationByTransmitter(user?.correlative.branch.transmitterId ?? 0);
    if (!roleActions) {
      OnGetActionsByRole(user?.roleId ?? 0).then((data) => {
        if (data) {
          localStorage.setItem('_RVA', encryptData(data));
          setRoleActions(data);
        }
      });
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <title>{props.title}</title>
      </Helmet>

      {roleActions ? (
        <div className={classNames('w-full h-full', context === 'dark' ? 'dark' : '')}>
          {navbar === 'topbar' && (
            <>
              <div className="flex flex-col w-screen h-screen">
                <NavBar />
                <div className="w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-800">
                  {props.children}
                </div>
              </div>
            </>
          )}
          {navbar === 'sidebar' && (
            <>
              <SideBar title={props.title}>
                <div className="w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-800">
                  {props.children}
                </div>
              </SideBar>
            </>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center w-full h-full">Loading</div>
      )}
    </>
  );
}

export default Layout;
