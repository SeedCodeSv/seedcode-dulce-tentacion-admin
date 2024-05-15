import { Image, Switch } from "@nextui-org/react";
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
} from "lucide-react";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../hooks/useTheme";
import { useActionsRolStore } from "../store/actions_rol.store";

export const LayoutItems = () => {
  const { theme, toggleContext, context } = useContext(ThemeContext);

  const { role_view_action, OnGetActionsByRole } = useActionsRolStore();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.roleId) {
        OnGetActionsByRole(user.roleId);
      }
    }
  }, [OnGetActionsByRole]);

  const views =
    role_view_action &&
    role_view_action.view &&
    role_view_action.view.length > 0 &&
    role_view_action.view.map((view) => view.name);

    console.log("Views:", role_view_action.view);
    console.log("role_view_action:", role_view_action);

  return (
    <>
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
      {views && (
        <>
          {views.includes("Inicio") && (
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
          )}
          
            {views.includes("Products") && (
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
            )}
        
          {views.includes("Categorias") && (
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
          )}
          {views.includes("Sucursales") && (
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
          )}
          {views.includes("Usuario") && (
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
          )}
          {views.includes("Empleados") && (
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
          )}
          {views.includes("Clientes") && (
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
          )}
          {views.includes("Reportes") && (
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
          )}
          {views.includes("CategoriaGastos") && (
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
          )}
          {views.includes("Gastos") && (
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
          )}
          {views.includes("actionsRol") && (
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
        </>
      )}
      {/* <NavLink
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
            </NavLink> */}
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
