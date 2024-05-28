import { Menu } from 'lucide-react';
import { ReactNode, useContext, useEffect, useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from '@nextui-org/react';
import { SmLayout } from './SmLayout';
import { LayoutItems } from './LayoutItems';
import { LgLayout } from './LgLayout';
import USER from '../assets/user.png';
import { ThemeContext } from '../hooks/useTheme';
import { useAuthStore } from '../store/auth.store';
import { useNavigate } from 'react-router';
import { SessionContext } from '../hooks/useSession';
import { delete_RVA, delete_seller_mode } from '../storage/localStorage';
interface Props {
  children: ReactNode;
  title: string;
}

export const SideBar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const { user, makeLogout } = useAuthStore();
  const { setIsAuth, setToken } = useContext(SessionContext);

  useEffect(() => {}, [user, theme]);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const navigation = useNavigate();
  const close_login = () => {
    makeLogout();
    delete_seller_mode();
    setIsAuth(false);
    setToken('');
    delete_RVA();
    navigation('/');
  };
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="flex w-screen h-screen">
      {windowSize.width < 1280 ? (
        <SmLayout isOpen={isOpen} setIsOpen={setIsOpen} items={() => <LayoutItems />} />
      ) : (
        <LgLayout items={() => <LayoutItems />} />
      )}
      <div className="flex flex-col w-full xl:ml-64">
        <div
          className="fixed top-0 z-[30] w-screen left-0 xl:pl-72 shadow h-[70px] flex justify-between items-center lg:grid lg:grid-cols-2 sm:grid-cols-1 md:grid-cols-1 sm:px-1 mb:px-1 px-6"
          style={{
            backgroundColor: theme.colors.dark,
            color: theme.colors.primary,
          }}
        >
          <div className="flex start xl:hidden ">
            <Button isIconOnly onClick={() => setIsOpen(!isOpen)}>
              <Menu />
            </Button>
          </div>
          <div className="ml-3 lg:ml-0">
            <p className="text-sm uppercase font-bold whitespace-nowrap start">{props.title}</p>
          </div>
          <div className="flex justify-end items-end w-full ">
            <Dropdown placement="bottom-start" showArrow>
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: USER,
                    alt: 'No image',
                  }}
                  classNames={{
                    description: 'text-gray-400 lg:block hidden',
                  }}
                  className="transition-transform"
                  description={
                    <span className="hidden lg:block text-gray-400">{user?.userName}</span>
                  }
                  name={<span className="hidden lg:block">{user?.employee.fullName}</span>}
                ></User>
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold dark:text-white">Sesión iniciada</p>
                  <p className="font-bold dark:text-white">{user?.employee.fullName}</p>
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="primary"
                  onClick={() => navigate('/configuration')}
                  className="dark:text-white"
                >
                  Configuración
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={() => close_login()}
                  className="dark:text-white"
                >
                  Cerrar sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="w-full h-full overflow-y-auto bg-gray-50 mt-14 lg">{props.children}</div>
      </div>
    </div>
  );
};
