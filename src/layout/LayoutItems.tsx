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
import { useContext, useEffect } from "react";
import { ThemeContext } from "../hooks/useTheme";
import { useAuthStore } from "../store/auth.store";
import { delete_seller_mode, save_seller_mode } from "../storage/localStorage";
import { redirect } from "react-router";
import { SessionContext } from "../hooks/useSession";
import { useConfigurationStore } from "../store/perzonalitation.store";
import { useActionsRolStore } from "../store/actions_rol.store";
export const LayoutItems = () => {
  const { theme, toggleContext, context } = useContext(ThemeContext);
  const { makeLogout } = useAuthStore();
  const { setIsAuth, setToken, mode, setMode } = useContext(SessionContext);

  const handleSeller = () => {
    setMode("vendedor");
    save_seller_mode("vendedor");
    makeLogout();
    setIsAuth(false);
    setToken("");
    redirect("/");
  };
  const handleAdmin = () => {
    setMode("");
    makeLogout();
    delete_seller_mode();
    setIsAuth(false);
    setToken("");
    redirect("/");
  };

  const { user } = useAuthStore();
  const transmitter = user?.employee?.branch?.transmitterId;

  const { personalization, GetConfigurationByTransmitter } =
    useConfigurationStore();

  useEffect(() => {
    GetConfigurationByTransmitter(transmitter || 0);
  }, []);

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
      {personalization.length === 0 ? (
        <div
          className="flex items-center pl-5 w-full border-b shadow h-[70px]"
          style={{
            backgroundColor: theme.colors.dark,
            color: theme.colors.primary,
          }}
        >
          <img src={LOGO} className="max-h-14 w-full max-w-32" />
          <p className="ml-3 font-sans text-sm font-bold text-coffee-brown">
            SeedCodeERP
          </p>
        </div>
      ) : (
        <>
          {mode}
          {personalization.map((item) => (
            <div
              key={item.id}
              className="flex items-center pl-5 w-full border-b shadow h-[70px]"
              style={{
                backgroundColor: theme.colors.dark,
                color: theme.colors.primary,
              }}
            >
              <img src={item.logo} className="max-h-14 w-full max-w-32" />
              <p className="ml-3 font-sans text-sm font-bold text-coffee-brown">
                {item.name}
              </p>
            </div>
          ))}
        </>
      )}
      {mode !== "vendedor" ? (
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

      {mode !== "vendedor" && (
        <>
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
                      borderLeftColor: isActive
                        ? theme.colors.dark
                        : "transparent",
                      borderLeftWidth: 5,
                    };
                  }}
                >
                  <Home size={20} />
                  <p className="ml-2 text-base">Inicio</p>
                </NavLink>
              )}
              {views.includes("Productos") && (
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
                      borderLeftColor: isActive
                        ? theme.colors.dark
                        : "transparent",
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
                      borderLeftColor: isActive
                        ? theme.colors.dark
                        : "transparent",
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
                      borderLeftColor: isActive
                        ? theme.colors.dark
                        : "transparent",
                      borderLeftWidth: 5,
                    };
                  }}
                >
                  <Store size={20} />
                  <p className="ml-2 text-base">Sucursales</p>
                </NavLink>
              )}
              {views.includes("Usuarios") && (
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
                      borderLeftColor: isActive
                        ? theme.colors.dark
                        : "transparent",
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
                      borderLeftColor: isActive
                        ? theme.colors.dark
                        : "transparent",
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
                      borderLeftColor: isActive
                        ? theme.colors.dark
                        : "transparent",
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
                      borderLeftColor: isActive
                        ? theme.colors.dark
                        : "transparent",
                      borderLeftWidth: 5,
                    };
                  }}
                >
                  <Book size={20} />
                  <p className="ml-2 text-base">Reportes</p>
                </NavLink>
              )}
              {views.includes("Categoria de gastos") && (
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
                      borderLeftColor: isActive
                        ? theme.colors.dark
                        : "transparent",
                      borderLeftWidth: 5,
                    };
                  }}
                >
                  <Grid2X2Icon size={20} />
                  <p className="ml-2 text-base">Categoria de gastos</p>
                </NavLink>
              )}
            </>
          )}
        </>
      )}
      {views && (
        <>
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
          {views.includes("Ventas") && (
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
          )}

          {views.includes("Reporte de ventas") && (
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
          )}
        </>
      )}
      {mode !== "vendedor" && (
        <>
          {views && (
            <>
              {views.includes("Permisos") && (
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
                      borderLeftColor: isActive
                        ? theme.colors.dark
                        : "transparent",
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
        </>
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
