import { Button, Image, Switch } from "@nextui-org/react";
import { NavLink } from "react-router-dom";
import LOGO from "../assets/react.svg";
import {
  Coffee,
  Home,
  Box,
  Store,
  User,
  BookUser,
  Users,
  Book,
  ShieldHalf,
  CalculatorIcon,
  Grid2X2Icon,
  ShoppingCart,
  DollarSign,
  Contact,
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "../hooks/useTheme";
import { useAuthStore } from "../store/auth.store";
import { delete_seller_mode, save_seller_mode } from "../storage/localStorage";
import { redirect } from "react-router";
import { SessionContext } from "../hooks/useSession";
import { return_seller_mode } from "../storage/localStorage";
import { useConfigurationStore } from "../store/perzonalitation.store";
export const LayoutItems = () => {
  const { theme, toggleContext, context } = useContext(ThemeContext);
  const { makeLogout } = useAuthStore();
  const [mode, setMode] = useState("");
  const { setIsAuth, setToken } = useContext(SessionContext);

  const handleSeller = () => {
    save_seller_mode("vendedor");
    makeLogout();
    setIsAuth(false);
    setToken("");
    redirect("/");
  };
  const handleAdmin = () => {
    makeLogout();
    delete_seller_mode()
    setIsAuth(false);
    setToken("");
    redirect("/");
  };
  useEffect(() => {
    const mode = return_seller_mode();
    setMode(String(mode));
  }, []);
  console.log("Modo layout", mode);
 

  const { user } = useAuthStore();
  const transmitter = user?.employee?.branch?.transmitterId;

  const { personalization, GetConfigurationByTransmitter } =
    useConfigurationStore();

  useEffect(() => {
    GetConfigurationByTransmitter(transmitter || 0);
  }, []);

  return (
    <>
      {/* <div
        className="flex items-center justify-center w-full border-b shadow h-14"
        style={{
          backgroundColor: theme.colors.dark,
          color: theme.colors.primary,
        }}
      >
        <Image src={LOGO} className="w-[50px]" />
        <p className="ml-3 font-sans text-sm font-bold text-coffee-brown">
          SeedCodeERP
        </p>
      </div> */}
      {personalization.length === 0 ? (
        <div
          className="flex items-center justify-center w-full border-b shadow h-14"
          style={{
            backgroundColor: theme.colors.dark,
            color: theme.colors.primary,
          }}
        >
          <Image src={LOGO} className="w-[50px]" />
          <p className="ml-3 font-sans text-sm font-bold text-coffee-brown">
            SeedCodeERP
          </p>
        </div>
      ) : (
        <>
          {personalization.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-center w-full border-b shadow h-14"
              style={{
                backgroundColor: theme.colors.dark,
                color: theme.colors.primary,
              }}
            >
              <Image src={item.logo} className="w-[50px] h-[50px]" />
              <p className="ml-3 font-sans text-sm font-bold text-coffee-brown">
                {item.name}
              </p>
            </div>
          ))}
        </>
      )}
      {mode === "null" ? (
        <div className=" justify-center items-center px-3">
          <Button
            onClick={() => handleSeller()}
            className="text-coffee-green font-semibold bg-gray-100  border-coffee-green justify-center items-center bg-transparent"
          >
            <ShoppingCart size={20} />
            <p className="ml-2 text-base">modo venta</p>
          </Button>
        </div>
      ) : (
        <div className=" justify-center items-center px-3">
          <Button
            onClick={() => handleAdmin()}
            className="text-coffee-green font-semibold bg-gray-100  border-coffee-green justify-center items-center bg-transparent"
          >
            <Contact size={20} />
            <p className="ml-2 text-base">Administración</p>
          </Button>
        </div>
      )}

      {mode === "null" && (
        <>
          <NavLink
            to={"/"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <Home size={20} />
            <p className="ml-2 text-base">Inicio</p>
          </NavLink>
          <NavLink
            to={"/products"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <Coffee size={20} />
            <p className="ml-2 text-base">Productos</p>
          </NavLink>
          <NavLink
            to={"/categories"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <Box size={20} />
            <p className="ml-2 text-base">Categorías</p>
          </NavLink>
          <NavLink
            to={"/branches"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <Store size={20} />
            <p className="ml-2 text-base">Sucursales</p>
          </NavLink>
          <NavLink
            to={"/users"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <User size={20} />
            <p className="ml-2 text-base">Usuarios</p>
          </NavLink>
          <NavLink
            to={"/employees"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <Users size={20} />
            <p className="ml-2 text-base">Empleados</p>
          </NavLink>
          <NavLink
            to={"/clients"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <BookUser size={20} />
            <p className="ml-2 text-base">Clientes</p>
          </NavLink>
          <NavLink
            to={"/reports"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <Book size={20} />
            <p className="ml-2 text-base">Reportes</p>
          </NavLink>
          <NavLink
            to={"/expensesCategories"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <Grid2X2Icon size={20} />
            <p className="ml-2 text-base">Categoria de gastos</p>
          </NavLink>
        </>
      )}
      <NavLink
        to={"/expenses"}
        className={({ isActive }) => {
          return (
            (isActive
              ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
              : "text-coffee-brown font-semibold border-white") +
            " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
          );
        }}
        style={({ isActive }) => {
          return {
            borderLeftColor: isActive ? theme.colors.dark : "transparent",
            borderLeftWidth: 5,
          };
        }}
      >
        <CalculatorIcon size={20} />
        <p className="ml-2 text-base">Gastos</p>
      </NavLink>
      <NavLink
        to={"/newSales"}
        className={({ isActive }) => {
          return (
            (isActive
              ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
              : "text-coffee-brown font-semibold border-white") +
            " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
          );
        }}
        style={({ isActive }) => {
          return {
            borderLeftColor: isActive ? theme.colors.dark : "transparent",
            borderLeftWidth: 5,
          };
        }}
      >
        <ShoppingCart size={20} />
        <p className="ml-2 text-base">Nueva venta</p>
      </NavLink>

      <NavLink
        to={"/sales-reports"}
        className={({ isActive }) => {
          return (
            (isActive
              ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
              : "text-coffee-brown font-semibold border-white") +
            " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
          );
        }}
        style={({ isActive }) => {
          return {
            borderLeftColor: isActive ? theme.colors.dark : "transparent",
            borderLeftWidth: 5,
          };
        }}
      >
        <DollarSign size={20} />
        <p className="ml-2 text-base">Ventas</p>
      </NavLink>
      {mode === null && (
        <NavLink
          to={"/actionRol"}
          className={({ isActive }) => {
            return (
              (isActive
                ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                : "text-coffee-brown font-semibold border-white") +
              " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
            );
          }}
          style={({ isActive }) => {
            return {
              borderLeftColor: isActive ? theme.colors.dark : "transparent",
              borderLeftWidth: 5,
            };
          }}
        >
          <ShieldHalf size={20} />
          <p className="ml-2 text-base">Permisos</p>
        </NavLink>
      )}
      <div
        className={
          " flex w-full py-4 pl-5 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
        }
      >
        <Switch
          onValueChange={(isDark) => toggleContext(isDark ? "dark" : "light")}
          isSelected={context === "dark"}
        >
          {context === "dark" ? "Modo claro" : "Modo oscuro"}
        </Switch>
      </div>
    </>
  );
};
