import { useContext, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router';

import { ThemeContext } from '../hooks/useTheme';
import { useConfigurationStore } from '../store/perzonalitation.store';
import { useAuthStore } from '../store/auth.store';
import { ActionsContext } from '../hooks/useActions';
import { useActionsRolStore } from '../store/actions_rol.store';
import { encryptData } from '../plugins/crypto';

import { SideBar } from './side-bar';
import NavBar from './nav-bar';


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
      user?.pointOfSale?.branch.transmitterId ?? 0
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
  const excludedRoutes = ["/kardex", "/OP-report", "/cash-cuts", "/products-selled", '/inventary-adjustment'];

  const isExcluded = excludedRoutes.some(route => location.pathname.startsWith(route));

  if (isExcluded) return;

  if (location !== displayLocation) setTransistionStage('fadeOut');
}, [location, displayLocation]);


  return (
    <>
      <Helmet>
        <title>{props.title.toUpperCase()}</title>
      </Helmet>

      <div className={classNames('w-full h-full satoshi dark:bg-gray-900', context === 'dark' ? 'dark' : '')}>
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
                  'w-full h-full overflow-y-auto'
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
