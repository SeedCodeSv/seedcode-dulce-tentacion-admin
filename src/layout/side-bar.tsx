import { Menu } from 'lucide-react';
import { ReactNode, useContext, useEffect, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { useNavigate } from 'react-router';
import classNames from 'classnames';

import USER from '../assets/user.png';
import { ThemeContext } from '../hooks/useTheme';
import { useAuthStore } from '../store/auth.store';
import { SessionContext } from '../hooks/useSession';
import { delete_RVA, delete_seller_mode } from '../storage/localStorage';

import { LgLayout } from './lg-layout';
import { LayoutItems } from './layout-items';
import { SmLayout } from './sm-layout';


interface Props {
  children: ReactNode;
  title: string;
}

export const SideBar = (props: Props) => {
  const navigate = useNavigate();
  const { theme,context } = useContext(ThemeContext);

  const { user, makeLogout } = useAuthStore();
  const { setIsAuth, setToken, setMode } = useContext(SessionContext);

  const [isOpen, setIsOpen] = useState<boolean>(
    () => JSON.parse(localStorage.getItem('sidebarState') || 'true') // Recupera el estado al cargar.
  );

  const [openInMobile, setOpenInMobile] = useState(false);

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const close_login = () => {
    makeLogout();
    delete_seller_mode();
    setIsAuth(false);
    setToken('');
    delete_RVA();
    navigate('/');
    setMode('');
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      // Si el ancho es mayor a 1280px, muestra automáticamente el sidebar.
      if (window.innerWidth >= 1280) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    // Guarda el estado del sidebar en localStorage.
    localStorage.setItem('sidebarState', JSON.stringify(isOpen));
  }, [isOpen]);

  return (
    <div className="flex w-screen h-screen overflow-x-hidden bg-gray-50">
      {windowSize.width < 1280 ? (
        <SmLayout isOpen={openInMobile} items={() => <LayoutItems isOpen={openInMobile} setIsOpen={setOpenInMobile} />} setIsOpen={setOpenInMobile} />
      ) : (
        <LgLayout isOpen={isOpen} items={() => <LayoutItems isOpen={isOpen} setIsOpen={setIsOpen} />} setIsOpen={setIsOpen} />
      )}
      <div className={classNames('flex flex-col w-full ', isOpen ? 'xl:ml-72' : 'xl:ml-0')}>
        <div
          className={classNames(
            'fixed top-0 z-[30] w-screen left-0 shadow h-[70px] flex justify-between items-center lg:flex lg:justify-between sm:grid-cols-1 md:grid-cols-1 sm:px-1 mb:px-1 px-6',
            isOpen ? 'xl:pl-[20rem]' : 'xl:pl-0'
          )}
          style={{
            backgroundColor: theme.colors[context].menu.background,
            color: theme.colors[context].menu.textColor,
          }}
        >
          {!isOpen && (
            <div className="hidden start xl:flex">
              <Button isIconOnly onClick={() => setIsOpen(!isOpen)}>
                <Menu />
              </Button>
            </div>
          )}
          <div className="flex start xl:hidden">
            <Button isIconOnly onClick={() => setOpenInMobile(!openInMobile)}>
              <Menu />
            </Button>
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold uppercase whitespace-nowrap start">{props.title}</p>
          </div>
          <div className="flex items-end justify-end w-full">
            <Dropdown showArrow placement="bottom-start">
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: USER,
                    alt: 'No image',
                  }}
                  className="transition-transform"
                  classNames={{
                    description: 'text-gray-400 lg:block hidden',
                  }}
                  description={
                    <span className="hidden text-gray-400 lg:block">{user?.userName}</span>
                  }
                  name={<span className="hidden lg:block">{user?.userName}</span>}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="gap-2 h-14">
                  <p className="font-bold dark:text-white">Sesión iniciada</p>
                  <p className="font-bold dark:text-white">{user?.userName}</p>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="dark:text-white"
                  color="primary"
                  onPress={() => navigate('/configuration')}
                >
                  Configuración
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  className="dark:text-white"
                  color="danger"
                  onPress={() => close_login()}
                >
                  Cerrar sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-900 mt-14">{props.children}</div>
      </div>
    </div>
  );
};
