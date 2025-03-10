import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../hooks/useTheme';
import NavBar from './NavBar';
import { SideBar } from './side-bar';
import classNames from 'classnames';
import { useConfigurationStore } from '../store/perzonalitation.store';
import { useAuthStore } from '../store/auth.store';
import { Helmet } from 'react-helmet-async';
import { ActionsContext } from '../hooks/useActions';
import { useActionsRolStore } from '../store/actions_rol.store';
import { encryptData } from '../plugins/crypto';
import { useLocation } from 'react-router';

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
    GetConfigurationByTransmitter(
      user?.correlative?.branch.transmitterId ?? user?.pointOfSale?.branch.transmitterId ?? 0
    );
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

  const [displayLocation, setDisplayLocation] = useState(location);
  const [transitionStage, setTransistionStage] = useState('fadeIn');

  useEffect(() => {
    if (location !== displayLocation) setTransistionStage('fadeOut');
  }, [location, displayLocation]);

  return (
    <>
      <Helmet>
        <title>{props.title.toUpperCase()}</title>
      </Helmet>

      <div className={classNames('w-full h-full satoshi', context === 'dark' ? 'dark' : '')}>
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
              <div
                className={classNames(
                  transitionStage,
                  'w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-800'
                )}
                onAnimationEnd={() => {
                  if (transitionStage === 'fadeOut') {
                    setTransistionStage('fadeIn');
                    setDisplayLocation(location);
                  } else {
                    setDisplayLocation(location);
                    setTransistionStage('fadeIn');
                  }
                }}
              >
                {props.children}
              </div>
            </SideBar>
          </>
        )}
      </div>
    </>
  );
}

export default Layout;
