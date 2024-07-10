import { Switch } from "@nextui-org/react";
import { NavLink } from "react-router-dom";
import LOGO from "../assets/react.svg";
import {
  Home,
  Box,
  User,
  BookUser,
  ShieldHalf,
  Grid2X2Icon,
  DollarSign,
  ScanBarcode,
  ChevronDown,
  FolderOpen,
  Store,
  Truck,
  ShoppingBag,
  Book,
  FileText,
  TicketPercent,
  Handshake,
  Coins,
  Calendar,
  GraduationCap,
} from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../hooks/useTheme';
// import { useAuthStore } from '../store/auth.store';
// import { save_seller_mode } from '../storage/localStorage';
// import { useNavigate } from 'react-router';
import { SessionContext } from '../hooks/useSession';
import { useConfigurationStore } from '../store/perzonalitation.store';
import useWindowSize from '../hooks/useWindowSize';
import { ActionsContext } from '../hooks/useActions';
import CushCatsBigZ from '../pages/CashCutsBigZ';
import CashCutsX from '../pages/CashCutsX';
import CushCatsZ from '../pages/CashCutsZ';
export const LayoutItems = () => {
  const { theme, toggleContext, context } = useContext(ThemeContext);
  // const { makeLogout } = useAuthStore();
  const { mode } = useContext(SessionContext);
  useEffect(() => {
    if (context === "dark") {
      document.getElementsByTagName("body")[0].classList.add("dark");
    } else {
      document.getElementsByTagName("body")[0].classList.remove("dark");
    }
  }, [context]);
  // const navigate = useNavigate();
  // const handleSeller = () => {
  //   setMode("vendedor");
  //   save_seller_mode("vendedor");
  //   makeLogout();
  //   setIsAuth(false);
  //   setToken("");
  //   navigate("/");
  // };
  // const handleAdmin = () => {
  //   setMode("");
  //   makeLogout();
  //   localStorage.removeItem("seller_mode");
  //   setIsAuth(false);
  //   setToken("");
  //   navigate("/");
  // };

  const { personalization } = useConfigurationStore();
  const { windowSize } = useWindowSize();
  const iconSize = useMemo(() => {
    if (windowSize.width < 768) {
      return 14;
    } else if (windowSize.width < 1024) {
      return 16;
    } else if (windowSize.width < 1280) {
      return 18;
    } else if (windowSize.width < 1536) {
      return 20;
    } else {
      return 22;
    }
  }, [windowSize.width]);
  const { roleActions } = useContext(ActionsContext);

  const views = useMemo(() => {
    return roleActions?.view.map((vw) => vw.name);
  }, [roleActions]);
  const [isClientsOpen, setIsClientsOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpen2, setIsMenuOpen2] = useState(false);
  const [isMenuBox, setIsMenuBox] = useState(false);
  const [reports, setReports] = useState(false);

  const toggleDropdownMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsClientsOpen(false);
    setIsMenuBox(false);
    setReports(false);
  };

  const toggleDropdownMenuReports = () => {
    setIsMenuOpen(false);
    setIsClientsOpen(false);
    setIsMenuBox(false);
    setReports(!reports);
  };

  const toggleDropdownMenu2 = () => {
    setIsMenuOpen2(!isMenuOpen2);
  };

  const toggleDropdownClient = () => {
    setIsClientsOpen(!isClientsOpen);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const toggleDropdownBox = () => {
    setIsMenuBox(!isMenuBox);
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  const [isOpenComponentBigZ, setIsOpenComponentBigZ] = useState(false);
  const [isCushCatsZ, setIsCushCatsZ] = useState(false);
  const [isCushCatsX, setIsCushCatsX] = useState(false);

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
          <img src={LOGO} className="max-h-14" />
          <p className="ml-3 font-sans text-sm font-bold text-coffee-brown dark:text-white">
            MADNESS
          </p>
        </div>
      ) : (
        <>
          {personalization.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-center w-full border-b shadow h-[70px]"
              style={{
                backgroundColor: theme.colors.dark,
                color: theme.colors.primary,
              }}
            >
              <img src={item.logo} className="max-h-14" />
            </div>
          ))}
        </>
      )}

      {/* {mode !== 'vendedor' ? (
        <div className="items-center justify-center px-2 mt-2 ">
          <Button
            onClick={() => handleSeller()}
            className="items-center justify-center font-semibold bg-transparent bg-gray-100 text-coffee-green border-coffee-green"
          >
            <ShoppingCart size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Modo venta</p>
          </Button>
        </div>
      ) : (
        <div className="items-center justify-center px-2 mt-2 ">
          <Button
            onClick={() => handleAdmin()}
            className="items-center justify-center font-semibold bg-transparent bg-gray-100 text-coffee-green border-coffee-green"
          >
            <Contact size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Administración</p>
          </Button>
        </div>
      )} */}
      {/* {mode === 'vendedor' && <SalesMode />} */}
      {mode !== "vendedor" && (
        <>
          {views && (
            <>
              <NavLink
                to={"/"}
                className={({ isActive }) => {
                  return (
                    (isActive
                      ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                      : "text-coffee-brown font-semibold border-white") +
                    " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
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
                <Home size={iconSize} />
                <p className="ml-2 text-sm 2xl:text-base">Inicio</p>
              </NavLink>

              {views.includes("Productos") && (
                <NavLink
                  to={"/products"}
                  className={({ isActive }) => {
                    return (
                      (isActive
                        ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                        : "text-coffee-brown font-semibold border-white") +
                      " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
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
                  <ScanBarcode size={iconSize} />
                  <p className="ml-2 text-sm 2xl:text-base">Productos</p>
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
                      " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
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
                  <Box size={iconSize} />
                  <p className="ml-2 text-sm 2xl:text-base">Categorías</p>
                </NavLink>
              )}
              {views.includes("Categorias") && (
                <NavLink
                  to={"/subCategories"}
                  className={({ isActive }) => {
                    return (
                      (isActive
                        ? "font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                        : "font-semibold border-white") +
                      " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
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
                  <Box size={iconSize} />
                  <p className="ml-2 text-sm 2xl:text-base">Sub Categorías</p>
                </NavLink>
              )}

              {views.includes("Reportes") && (
                <div className="flex flex-col items-center justify-start w-full px-6">
                  <button
                    onClick={toggleDropdownClient}
                    className="flex items-center w-full py-3 space-x-3 text-left focus:outline-none focus:text-blac -"
                  >
                    <FileText size={iconSize} />
                    <p className="text-sm font-semibold dark:text-white semibold 2xl:text-base">
                      Reportes
                    </p>

                    <ChevronDown
                      className="items-end justify-end "
                      size={iconSize}
                    />
                  </button>
                  <div
                    id="menu1"
                    className={`flex flex-col w-full pb-1 overflow-hidden transition-all duration-500 ${
                      isClientsOpen ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <>
                      <div className="py-1">
                        <NavLink
                          to={"/sales-by-branch"}
                          className={({ isActive }) => {
                            return (
                              (isActive
                                ? "font-semibold bg-gray-300 dark:bg-gray-700"
                                : "text-coffee-brown font-semibold border-white") +
                              " flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white"
                            );
                          }}
                        >
                          <User size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">
                            Ventas Sucursal
                          </p>
                        </NavLink>

                        <NavLink
                          to={"/expenses-by-dates-transmitter"}
                          className={({ isActive }) => {
                            return (
                              (isActive
                                ? "font-semibold bg-gray-300 dark:bg-gray-700"
                                : "text-coffee-brown font-semibold border-white") +
                              " flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white"
                            );
                          }}
                        >
                          <BookUser size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">
                            Gastos Sucursal
                          </p>
                        </NavLink>

                        <NavLink
                          to={"/most-product-transmitter-selled"}
                          className={({ isActive }) => {
                            return (
                              (isActive
                                ? "font-semibold bg-gray-300 dark:bg-gray-700"
                                : "text-coffee-brown font-semibold border-white") +
                              " flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white"
                            );
                          }}
                        >
                          <BookUser size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">
                            Producto mas vendido
                          </p>
                        </NavLink>
                      </div>
                    </>
                  </div>
                </div>
              )}

              {/* Gestion de planillas ----------------------------------------------------------------- */}
              {views.includes('Tipo de contratacion') ||
              (views && views.includes('Estado del empleado')) ||
              views.includes('Employee') ? (
                <div className="flex flex-col items-center justify-start w-full px-6">
                  <button
                    onClick={toggleDropdownMenu2}
                    className="flex items-center w-full py-3 space-x-3 text-left text-black focus:outline-none focus:text-black"
                  >
                    <User className="dark:text-white" size={iconSize} />
                    <p className="text-sm font-semibold dark:text-white 2xl:text-base">
                      Gestión de planillas
                    </p>
                    <ChevronDown
                      className="items-end justify-end dark:text-white"
                      size={iconSize}
                    />
                  </button>
                  <div
                    id="menu2"
                    className={`flex flex-col w-full h-[700px] pb-1 overflow-hidden transition-all duration-500 ${
                      isMenuOpen2 ? 'xl:max-h-36 max-h-36' : 'max-h-0'
                    }`}
                  >
                    <div className="py-1">
                      {views.includes('Nivel de estudio') && (
                        <NavLink
                          to={'/employees'}
                          className={({ isActive }) =>
                            (isActive
                              ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          }
                        >
                          <GraduationCap size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Nivel de estudio</p>
                        </NavLink>
                      )}

                      {views.includes('Estado del empleado') && (
                        <NavLink
                          to={'/statusEmployee'}
                          className={({ isActive }) =>
                            (isActive
                              ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          }
                        >
                          <BookUser size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Estado del empleado</p>
                        </NavLink>
                      )}
                      {views.includes('Tipo de contratacion') && (
                        <NavLink
                          to={'/contractTypes'}
                          className={({ isActive }) =>
                            (isActive
                              ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          }
                        >
                          <Handshake size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Tipo de contratacion</p>
                        </NavLink>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
              {/* fin de gestion de planillas -------------------------------------------------------------*/}

              {views.includes('Empleados') ||
              (views && views.includes('Clientes')) ||
              views.includes('Usuarios') ||
              views.includes('Sucursales') ? (
                <div className="flex flex-col items-center justify-start w-full px-6 ">
                  <button
                    onClick={toggleDropdownMenu}
                    className="flex items-center w-full py-3 space-x-3 text-left text-black focus:outline-none focus:text-black"
                  >
                    <User className="dark:text-white" size={iconSize} />
                    <p className="text-sm font-semibold dark:text-white 2xl:text-base">
                      Menu
                    </p>
                    <ChevronDown
                      className="items-end justify-end dark:text-white"
                      size={iconSize}
                    />
                  </button>
                  <div
                    id="menu1"
                    className={`flex flex-col w-full h-[900px] pb-1 overflow-hidden transition-all duration-500 ${
                      isMenuOpen ? "xl:max-h-52 max-h-44" : "max-h-0"
                    }`}
                  >
                    <div className="py-1">
                      {views.includes("Empleados") && (
                        <NavLink
                          to={"/employees"}
                          className={({ isActive }) =>
                            (isActive
                              ? "font-semibold bg-gray-300 dark:bg-gray-700"
                              : "text-coffee-brown font-semibold border-white") +
                            " flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white"
                          }
                        >
                          <User size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">
                            Empleados
                          </p>
                        </NavLink>
                      )}
                      {views.includes("Empleados") && (
                        <NavLink
                          to={"/charges"}
                          className={({ isActive }) =>
                            (isActive
                              ? "font-semibold bg-gray-300 dark:bg-gray-700"
                              : "text-coffee-brown font-semibold border-white") +
                            " flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white"
                          }
                        >
                          <Handshake size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Cargos</p>
                        </NavLink>
                      )}
                      {views.includes("Clientes") && (
                        <NavLink
                          to={"/clients"}
                          className={({ isActive }) =>
                            (isActive
                              ? "font-semibold bg-gray-300 dark:bg-gray-700"
                              : "text-coffee-brown font-semibold border-white") +
                            " flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white"
                          }
                        >
                          <BookUser size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Clientes</p>
                        </NavLink>
                      )}
                      {views.includes("Usuarios") && (
                        <NavLink
                          to={"/users"}
                          className={({ isActive }) =>
                            (isActive
                              ? "font-semibold bg-gray-300 dark:bg-gray-700"
                              : "text-coffee-brown font-semibold border-white") +
                            " flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white"
                          }
                        >
                          <User size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Usuarios</p>
                        </NavLink>
                      )}
                      {views.includes("Proveedores") && (
                        <NavLink
                          to={"/suppliers"}
                          className={({ isActive }) =>
                            (isActive
                              ? "font-semibold bg-gray-300 dark:bg-gray-700"
                              : "text-coffee-brown font-semibold border-white") +
                            " flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white"
                          }
                        >
                          <Truck size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">
                            Proveedores
                          </p>
                        </NavLink>
                      )}
                      {views.includes("Sucursales") && (
                        <NavLink
                          to={"/branches"}
                          className={({ isActive }) =>
                            (isActive
                              ? "font-semibold bg-gray-300 dark:bg-gray-700"
                              : "text-coffee-brown font-semibold border-white") +
                            " flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white"
                          }
                        >
                          <Store size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">
                            Sucursales
                          </p>
                        </NavLink>
                      )}
                    </div>
                  </div>
                </div>
              ) : null}
              <>
                <div className="flex flex-col items-center justify-start w-full px-6 ">
                  <button
                    onClick={toggleDropdownMenuReports}
                    className="flex items-center w-full py-3 space-x-3 text-left text-black focus:outline-none focus:text-black"
                  >
                    <User className="dark:text-white" size={iconSize} />
                    <p className="text-sm font-semibold dark:text-white 2xl:text-base">
                      Gestión de reportes
                    </p>
                    <ChevronDown
                      className="items-end justify-end dark:text-white"
                      size={iconSize}
                    />
                  </button>
                  <div
                    id="menu1"
                    className={`flex flex-col w-full h-[900px] pb-1 overflow-hidden transition-all duration-500 ${
                      reports ? "max-h-20" : "max-h-0"
                    }`}
                  >
                    <div className="py-1">
                      <NavLink
                        to={"/reports/sales-by-period"}
                        className={({ isActive }) =>
                          (isActive
                            ? "font-semibold bg-gray-300 dark:bg-gray-700"
                            : "text-coffee-brown font-semibold border-white") +
                          " flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white"
                        }
                      >
                        <Calendar size={iconSize} />
                        <p className="ml-2 text-sm 2xl:text-base">
                          Ventas por periodo
                        </p>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </>
              {views.includes("Categoría de gastos") && (
                <NavLink
                  to={"/expensesCategories"}
                  className={({ isActive }) => {
                    return (
                      (isActive
                        ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                        : "text-coffee-brown font-semibold border-white") +
                      " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
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
                  <Book size={iconSize} />
                  <p className="ml-2 text-sm 2xl:text-base">Reportes</p>
                </NavLink>
              )}
              {views.includes("Categoría de gastos") && (
                <NavLink
                  to={"/expensesCategories"}
                  className={({ isActive }) => {
                    return (
                      (isActive
                        ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                        : "text-coffee-brown font-semibold border-white") +
                      " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
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
                  <Grid2X2Icon
                    onClick={() => setIsOpenComponentBigZ(true)}
                    size={iconSize}
                  />
                  <p className="ml-2 text-sm 2xl:text-base">
                    Categoría de gastos
                  </p>
                </NavLink>
              )}
            </>
          )}
        </>
      )}
      <>
        {views && views.includes("Reporte de ventas") && (
          <NavLink
            to={"/sales-reports"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <DollarSign size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Reporte de Ventas</p>
          </NavLink>
        )}
      </>

      {mode !== "vendedor" && (
        <>
          {views && views.includes("Permisos") && (
            <NavLink
              to={"/actionRol"}
              className={({ isActive }) => {
                return (
                  (isActive
                    ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                    : "text-coffee-brown font-semibold border-white") +
                  " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
                );
              }}
              style={({ isActive }) => {
                return {
                  borderLeftColor: isActive ? theme.colors.dark : "transparent",
                  borderLeftWidth: 5,
                };
              }}
            >
              <ShieldHalf size={iconSize} />
              <p className="ml-2 text-sm 2xl:text-base">Permisos</p>
            </NavLink>
          )}

          {/* Descuentos */}
          {views && views.includes("Descuentos") && (
            <NavLink
              to={"/discounts"}
              className={({ isActive }) => {
                return (
                  (isActive
                    ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                    : "text-coffee-brown font-semibold border-white") +
                  " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
                );
              }}
              style={({ isActive }) => {
                return {
                  borderLeftColor: isActive ? theme.colors.dark : "transparent",
                  borderLeftWidth: 5,
                };
              }}
            >
              <TicketPercent size={iconSize} />
              <p className="ml-2 text-sm 2xl:text-base">Descuentos</p>
            </NavLink>
          )}

          {views && views.includes("Modulos") && (
            <NavLink
              to={"/modules"}
              className={({ isActive }) => {
                return (
                  (isActive
                    ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                    : "text-coffee-brown font-semibold border-white") +
                  " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
                );
              }}
              style={({ isActive }) => {
                return {
                  borderLeftColor: isActive ? theme.colors.dark : "transparent",
                  borderLeftWidth: 5,
                };
              }}
            >
              <FolderOpen size={iconSize} />
              <p className="ml-2 text-sm 2xl:text-base">Modulos</p>
            </NavLink>
          )}
          {views && views.includes("Ordenes de compra") && (
            <>
              <NavLink
                to={"/purchase-orders"}
                className={({ isActive }) => {
                  return (
                    (isActive
                      ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                      : "text-coffee-brown font-semibold border-white") +
                    " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
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
                <ShoppingBag size={iconSize} />
                <p className="ml-2 text-sm 2xl:text-base">Ordenes de compra</p>
              </NavLink>
            </>
          )}
        </>
      )}

      <div className="flex flex-col items-center justify-start w-full px-6 ">
        <button
          onClick={toggleDropdownBox}
          className="flex items-center w-full py-3 space-x-3 text-left text-black focus:outline-none focus:text-black"
        >
          <Coins className="dark:text-white" size={iconSize} />
          <p className="text-sm font-semibold dark:text-white 2xl:text-base">
            Cortes de caja
          </p>
          <ChevronDown
            className="items-end justify-end dark:text-white"
            size={iconSize}
          />
        </button>
        <div
          id="menu1"
          className={`flex flex-col w-full h-[900px] pb-1 overflow-hidden transition-all duration-500 ${
            isMenuBox ? "xl:max-h-52 max-h-44" : "max-h-0"
          }`}
        >
          <div className="py-1">
            <NavLink
              to={""}
              onClick={() => setIsOpenComponentBigZ(true)}
              className={({ isActive }) => {
                return (
                  (isActive
                    ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                    : "text-coffee-brown font-semibold border-white") +
                  " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
                );
              }}
              style={({ isActive }) => {
                return {
                  borderLeftColor: isActive ? theme.colors.dark : "transparent",
                  borderLeftWidth: 5,
                };
              }}
            >
              <ShoppingBag
                onClick={() => setIsOpenComponentBigZ(true)}
                size={iconSize}
              />
              <p className="ml-2 text-sm 2xl:text-base">Corte Gran Z</p>
            </NavLink>

            <NavLink
              to={""}
              onClick={() => setIsCushCatsX(true)}
              className={({ isActive }) => {
                return (
                  (isActive
                    ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                    : "text-coffee-brown font-semibold border-white") +
                  " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
                );
              }}
              style={({ isActive }) => {
                return {
                  borderLeftColor: isActive ? theme.colors.dark : "transparent",
                  borderLeftWidth: 5,
                };
              }}
            >
              <ShoppingBag
                onClick={() => setIsCushCatsX(true)}
                size={iconSize}
              />
              <p className="ml-2 text-sm 2xl:text-base">Corte de X</p>
            </NavLink>

            <NavLink
              to={""}
              onClick={() => setIsCushCatsZ(true)}
              className={({ isActive }) => {
                return (
                  (isActive
                    ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                    : "text-coffee-brown font-semibold border-white") +
                  " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
                );
              }}
              style={({ isActive }) => {
                return {
                  borderLeftColor: isActive ? theme.colors.dark : "transparent",
                  borderLeftWidth: 5,
                };
              }}
            >
              <ShoppingBag
                onClick={() => setIsCushCatsZ(true)}
                size={iconSize}
              />
              <p className="ml-2 text-sm 2xl:text-base">Corte de Z</p>
            </NavLink>
          </div>
        </div>
      </div>

      <div
        className={
          " flex w-full py-4 pl-5 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
        }
      >
        <Switch
          className="relative"
          onValueChange={(isDark) => toggleContext(isDark ? "dark" : "light")}
          isSelected={context === "dark"}
          size={windowSize.width > 768 ? undefined : "sm"}
        >
          <p className="relative text-sm lg:text-base">
            {context === "dark" ? "Modo claro" : "Modo oscuro"}
          </p>
        </Switch>
      </div>

      {isOpenComponentBigZ && (
        <CushCatsBigZ
          isOpen={isOpenComponentBigZ}
          onClose={() => setIsOpenComponentBigZ(false)}
        />
      )}
      {isCushCatsX && (
        <CashCutsX isOpen={isCushCatsX} onClose={() => setIsCushCatsX(false)} />
      )}
      {isCushCatsZ && (
        <CushCatsZ isOpen={isCushCatsZ} onClose={() => setIsCushCatsZ(false)} />
      )}
    </>
  );
};
