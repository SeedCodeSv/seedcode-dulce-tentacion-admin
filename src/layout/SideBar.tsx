import { Menu } from "lucide-react";
import { ReactNode, useContext, useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import { SmLayout } from "./SmLayout";
import { LayoutItems } from "./LayoutItems";
import { LgLayout } from "./LgLayout";
import USER from "../assets/user.png";
import { ThemeContext } from "../hooks/useTheme";
import { useAuthStore } from "../store/auth.store";
import { redirect, useNavigate } from "react-router";
interface Props {
  children: ReactNode;
  title: string;
}

export const SideBar = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const { user, makeLogout } = useAuthStore();

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const close_login = () => {
    makeLogout()
    redirect("/")
  }
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex w-screen h-screen">
      {windowSize.width < 1024 ? (
        <SmLayout
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          items={() => <LayoutItems />}
        />
      ) : (
        <LgLayout items={() => <LayoutItems />} />
      )}
      <div className="flex flex-col w-full lg:ml-64">
        <div
          className="fixed top-0 z-[30] w-screen left-0 lg:pl-72 shadow h-14 flex justify-between items-center lg:grid lg:grid-cols-2 px-6"
          style={{
            backgroundColor: theme.colors.dark,
            color: theme.colors.primary,
          }}
        >
          <div className="flex justify-end lg:hidden">
            <Button isIconOnly onClick={() => setIsOpen(!isOpen)}>
              <Menu />
            </Button>
          </div>
          <div className="ml-3 lg:ml-0">
            <p className="text-sm uppercase font-bold whitespace-nowrap">
              {props.title}
            </p>
          </div>
          <div className="flex justify-end w-full">
            <Dropdown placement="bottom-start" showArrow>
              <DropdownTrigger>
                <User
                  as="button"
                  avatarProps={{
                    isBordered: true,
                    src: USER,
                    alt: "No image",
                  }}
                  classNames={{
                    description: "text-gray-400",
                  }}
                  className="transition-transform"
                  description={user?.userName}
                  name={user?.employee.fullName}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="User Actions" variant="flat">
                <DropdownItem key="profile" className="h-14 gap-2">
                  <p className="font-bold">Sesión iniciada</p>
                  <p className="font-bold">{user?.employee.fullName}</p>
                </DropdownItem>
                <DropdownItem key="logout" color="primary" onClick={()=> navigate("/configuration")}>
                  Configuración
                </DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={()=> close_login()}>
                  Cerrar sesión
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="w-full h-full overflow-y-auto bg-gray-50 mt-14 lg">
          {props.children}
        </div>
      </div>
    </div>
  );
};
