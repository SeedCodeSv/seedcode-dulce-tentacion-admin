import { Switch } from '@nextui-org/react';
import { NavLink } from 'react-router-dom';
import LOGO from '../assets/MADNESS.png';
import {
  Home,
  User,
  BookUser,
  ShieldHalf,
  Grid2X2Icon,
  ScanBarcode,
  ChevronDown,
  FolderOpen,
  Store,
  Truck,
  // ShoppingBag,
  Book,
  FileText,
  TicketPercent,
  Handshake,
  Calendar,
  GraduationCap,
  FolderKanban,
  FolderCog,
  FolderCheck,
  LayoutList,
  LayoutGrid,
  FolderPen,
  ClipboardCheck,
  UserCheck,
  BriefcaseBusiness,
} from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../hooks/useTheme';
// import { useAuthStore } from '../store/auth.store';
// import { save_seller_mode } from '../storage/localStorage';
// import { useNavigate } from 'react-router';
import { SessionContext } from '../hooks/useSession';
import { useConfigurationStore } from '../store/perzonalitation.store';
import useWindowSize from '../hooks/useWindowSize';

import CushCatsBigZ from '../pages/CashCutsBigZ';
import CashCutsX from '../pages/CashCutsX';
import CushCatsZ from '../pages/CashCutsZ';
import { useViewsStore } from '@/store/views.store';
export const LayoutItems = () => {
  const { OnGetViewasAction, viewasAction } = useViewsStore();

  const { theme, toggleContext, context } = useContext(ThemeContext);
  // const { makeLogout } = useAuthStore();
  const { mode } = useContext(SessionContext);
  useEffect(() => {
    if (context === 'dark') {
      document.getElementsByTagName('body')[0].classList.add('dark');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('dark');
    }
    OnGetViewasAction();
  }, [context]);
  const views = viewasAction.map((r) => r.view.name);
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
  // const [isClientsOpen, setIsClientsOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [isContabilityOpen, setIsContabilityOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuOpen2, setIsMenuOpen2] = useState(false);
  const [, setIsMenuBox] = useState(false);
  const [reports, setReports] = useState(false);
  // Administración
  const toggleDropdownMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsProductOpen(false);
    setIsMenuBox(false);
    setIsMenuOpen2(false);
    setReports(false);
    setIsContabilityOpen(false);
  };
  // Gestión de reportes
  const toggleDropdownMenuReports = () => {
    setIsMenuOpen(false);
    setIsProductOpen(false);
    setIsMenuBox(false);
    setIsMenuOpen2(false);
    setReports(!reports);
    setIsContabilityOpen(false);
  };

  //Gestion de planillas
  const toggleDropdownMenu2 = () => {
    setIsMenuOpen2(!isMenuOpen2);
    setIsProductOpen(false);
    setIsMenuBox(false);
    setIsMenuOpen(false);
    setReports(false);
    setIsContabilityOpen(false);
  };
  //Gestion de productos
  const ttoggleDropdowProduct = () => {
    setIsProductOpen(!isProductOpen);
    setIsMenuOpen(false);
    setIsMenuBox(false);
    setIsMenuOpen2(false);
    setReports(false);
    setIsContabilityOpen(false);
  };

  //Contabilidad
  const toggleDropdowContabilidad = () => {
    setIsContabilityOpen(!isContabilityOpen);
    setIsMenuOpen(false);
    setIsProductOpen(false);
    setIsMenuBox(false);
    setIsMenuOpen2(false);
    setReports(false);
  };

  // const toggleDropdowProduct = () => {
  //   setIsProductOpen(!isProductOpen);
  //   if (isMenuOpen) {
  //     setIsMenuOpen(false);
  //   }
  // };

  // const toggleDropdownBox = () => {
  //   setIsMenuBox(!isMenuBox);
  //   if (isMenuOpen) {
  //     setIsMenuOpen(false);
  //   }
  // };

  const [isOpenComponentBigZ, setIsOpenComponentBigZ] = useState(false);
  const [isCushCatsZ, setIsCushCatsZ] = useState(false);
  const [isCushCatsX, setIsCushCatsX] = useState(false);

  return (
    <>
      {personalization.length === 0 ? (
        <div
          className="flex items-center pl-5 w-full border-b shadow h-[70px]"
          style={{
            // backgroundColor: theme.colors.dark,
            color: theme.colors.primary,
          }}
        >
          <img src={LOGO} className="max-h-14" />
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

      {mode !== 'vendedor' && (
        <>
          {views && (
            <>
              <NavLink
                to={'/'}
                className={({ isActive }) => {
                  return (
                    (isActive
                      ? 'text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green'
                      : 'text-coffee-brown font-semibold border-white') +
                    ' flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green'
                  );
                }}
                style={({ isActive }) => {
                  return {
                    borderLeftColor: isActive ? theme.colors.dark : 'transparent',
                    borderLeftWidth: 5,
                  };
                }}
              >
                <Home size={iconSize} />
                <p className="ml-2 text-sm 2xl:text-base">Inicio</p>
              </NavLink>

              {views.includes('Productos') ||
              (views && views.includes('Categorias')) ||
              views.includes('Sub Categorias') ||
              views.includes('Ordenes de compra') ? (
                <div className="flex flex-col items-center justify-start w-full px-6">
                  <button
                    onClick={ttoggleDropdowProduct}
                    className="flex items-center w-full py-3 space-x-3 text-left focus:outline-none focus:text-blac -"
                  >
                    <FileText size={iconSize} />
                    <p className="text-sm font-semibold dark:text-white semibold 2xl:text-base  whitespace-nowrap">
                      Gestión productos
                    </p>

                    <ChevronDown className="items-end justify-end " size={iconSize} />
                  </button>
                  <div
                    id="menuProducto"
                    className={`flex flex-col w-full pb-1 overflow-hidden transition-all duration-500 ${
                      isProductOpen ? 'max-h-52' : 'max-h-0'
                    }`}
                  >
                    <>
                      <div className="py-1">
                        {views.includes('Productos') && (
                          <NavLink
                            to={'/products'}
                            className={({ isActive }) => {
                              return (
                                (isActive
                                  ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                  : 'text-coffee-brown font-semibold border-white') +
                                ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                              );
                            }}
                          >
                            <ScanBarcode size={iconSize} />
                            <p className="ml-2 text-sm 2xl:text-base">Productos</p>
                          </NavLink>
                        )}

                        {views.includes('Categorias') && (
                          <NavLink
                            to={'/categories'}
                            className={({ isActive }) => {
                              return (
                                (isActive
                                  ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                  : 'text-coffee-brown font-semibold border-white') +
                                ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                              );
                            }}
                          >
                            <LayoutGrid size={iconSize} />
                            <p className="ml-2 text-sm 2xl:text-base">Categorías</p>
                          </NavLink>
                        )}
                        {views.includes('Sub Categorias') && (
                          <NavLink
                            to={'/subCategories'}
                            className={({ isActive }) => {
                              return (
                                (isActive
                                  ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                  : 'text-coffee-brown font-semibold border-white') +
                                ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                              );
                            }}
                          >
                            <LayoutList size={iconSize} />
                            <p className="ml-2 text-sm 2xl:text-base">Sub Categorías</p>
                          </NavLink>
                        )}
                        {/*                         
                        {views && views.includes('Ordenes de compra') && (
                          <>
                            <NavLink
                              to={'/purchase-orders'}
                              className={({ isActive }) => {
                                return (
                                  (isActive
                                    ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                    : 'text-coffee-brown font-semibold border-white') +
                                  ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                                );
                              }}
                            >
                              <ShoppingBag size={iconSize} />
                              <p className="ml-2 text-sm 2xl:text-base">Ordenes de compra</p>
                            </NavLink>
                          </>
                        )} */}
                      </div>
                    </>
                  </div>
                </div>
              ) : null}

              {/* Gestion de planillas ----------------------------------------------------------------- */}
              {views.includes('Tipo de Contratacion') ||
              (views && views.includes('Estados del Empleado')) ||
              views.includes('Nivel de Estudio') ? (
                <div className="flex flex-col items-center justify-start w-full px-6">
                  <button
                    onClick={toggleDropdownMenu2}
                    className="flex items-center w-full py-3 space-x-3 text-left text-black focus:outline-none focus:text-black"
                  >
                    <FolderKanban className="dark:text-white" size={iconSize} />
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
                      {views.includes('Nivel de Estudio') && (
                        <NavLink
                          to={'/studyLevel'}
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

                      {views.includes('Estados del Empleado') && (
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
                      {views.includes('Tipo de Contratacion') && (
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
              views.includes('Cargos de Empleados') ||
              views.includes('Usuarios') ||
              views.includes('Sucursales') ? (
                <div className="flex flex-col items-center justify-start w-full px-6 ">
                  <button
                    onClick={toggleDropdownMenu}
                    className="flex items-center w-full py-3 space-x-3 text-left text-black focus:outline-none focus:text-black"
                  >
                    <FolderCog className="dark:text-white" size={iconSize} />
                    <p className="text-sm font-semibold dark:text-white 2xl:text-base">
                      Administración
                    </p>
                    <ChevronDown
                      className="items-end justify-end dark:text-white"
                      size={iconSize}
                    />
                  </button>
                  <div
                    id="menu1"
                    className={`flex flex-col w-full h-[900px] pb-1 overflow-hidden transition-all duration-500 ${
                      isMenuOpen ? 'xl:max-h-56 max-h-44' : 'max-h-0'
                    }`}
                  >
                    <div className="py-1">
                      {views.includes('Empleados') && (
                        <NavLink
                          to={'/employees'}
                          className={({ isActive }) =>
                            (isActive
                              ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          }
                        >
                          <UserCheck size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Empleados</p>
                        </NavLink>
                      )}
                      {views.includes('Cargos de Empleados') && (
                        <NavLink
                          to={'/charges'}
                          className={({ isActive }) =>
                            (isActive
                              ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          }
                        >
                          <BriefcaseBusiness size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Cargos</p>
                        </NavLink>
                      )}
                      {views.includes('Clientes') && (
                        <NavLink
                          to={'/clients'}
                          className={({ isActive }) =>
                            (isActive
                              ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          }
                        >
                          <BookUser size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Clientes</p>
                        </NavLink>
                      )}
                      {views.includes('Usuarios') && (
                        <NavLink
                          to={'/users'}
                          className={({ isActive }) =>
                            (isActive
                              ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          }
                        >
                          <User size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Usuarios</p>
                        </NavLink>
                      )}
                      {views.includes('Proveedores') && (
                        <NavLink
                          to={'/suppliers'}
                          className={({ isActive }) =>
                            (isActive
                              ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          }
                        >
                          <Truck size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Proveedores</p>
                        </NavLink>
                      )}
                      {views.includes('Sucursales') && (
                        <NavLink
                          to={'/branches'}
                          className={({ isActive }) =>
                            (isActive
                              ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          }
                        >
                          <Store size={iconSize} />
                          <p className="ml-2 text-sm 2xl:text-base">Sucursales</p>
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
                    <FolderCheck className="dark:text-white" size={iconSize} />
                    <p className="text-sm font-semibold dark:text-white 2xl:text-base whitespace-nowrap">
                      Gestión de reportes
                    </p>
                    <ChevronDown
                      className="items-end justify-end dark:text-white h"
                      size={iconSize}
                    />
                  </button>
                  <div
                    id="menu1"
                    className={`flex flex-col w-full h-[900px] pb-1 overflow-hidden transition-all duration-500 ${
                      reports ? 'max-h-14' : 'max-h-0'
                    }`}
                  >
                    <div className="py-1">
                      <NavLink
                        to={'/reports/sales-by-period'}
                        className={({ isActive }) =>
                          (isActive
                            ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                            : 'text-coffee-brown font-semibold border-white') +
                          ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                        }
                      >
                        <Calendar size={iconSize} />
                        <p className="ml-2 text-sm 2xl:text-base">Ventas por periodo</p>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </>

              <>
                <div className="flex flex-col items-center justify-start w-full px-6 ">
                  <button
                    onClick={toggleDropdowContabilidad}
                    className="flex items-center w-full py-3 space-x-3 text-left text-black focus:outline-none focus:text-black"
                  >
                    <FolderPen className="dark:text-white" size={iconSize} />
                    <p className="text-sm font-semibold dark:text-white 2xl:text-base whitespace-nowrap">
                      Contabilidad
                    </p>
                    <ChevronDown
                      className="items-end justify-end  dark:text-white h"
                      size={iconSize}
                    />
                  </button>
                  <div
                    id="menuContability"
                    className={`flex flex-col w-full pb-1 overflow-hidden transition-all duration-500 ${
                      isContabilityOpen ? 'max-h-52' : 'max-h-0'
                    }`}
                  >
                    <div className="py-1">
                      <NavLink
                        to={''}
                        onClick={() => setIsOpenComponentBigZ(true)}
                        className={({ isActive }) => {
                          return (
                            (isActive
                              ? 'font-semibold bg-gray-white'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          );
                        }}
                      >
                        <ClipboardCheck
                          onClick={() => setIsOpenComponentBigZ(true)}
                          size={iconSize}
                        />
                        <p className="ml-2 text-sm 2xl:text-base">Corte Gran Z</p>
                      </NavLink>
                      <NavLink
                        to={''}
                        onClick={() => setIsCushCatsX(true)}
                        className={({ isActive }) => {
                          return (
                            (isActive
                              ? 'font-semibold bg-gray-white'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          );
                        }}
                      >
                        <ClipboardCheck onClick={() => setIsCushCatsX(true)} size={iconSize} />
                        <p className="ml-2 text-sm 2xl:text-base">Corte de X</p>
                      </NavLink>

                      <NavLink
                        to={''}
                        onClick={() => setIsCushCatsZ(true)}
                        className={({ isActive }) => {
                          return (
                            (isActive
                              ? 'font-semibold bg-gray-white'
                              : 'text-coffee-brown font-semibold border-white') +
                            ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                          );
                        }}
                      >
                        <ClipboardCheck onClick={() => setIsCushCatsZ(true)} size={iconSize} />
                        <p className="ml-2 text-sm 2xl:text-base">Corte de Z</p>
                      </NavLink>
                    </div>
                  </div>
                </div>
              </>
              {views.includes('Categoría de gastos') && (
                <NavLink
                  to={'/expensesCategories'}
                  className={({ isActive }) => {
                    return (
                      (isActive
                        ? 'text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green'
                        : 'text-coffee-brown font-semibold border-white') +
                      ' flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green'
                    );
                  }}
                  style={({ isActive }) => {
                    return {
                      borderLeftColor: isActive ? theme.colors.dark : 'transparent',
                      borderLeftWidth: 5,
                    };
                  }}
                >
                  <Book size={iconSize} />
                  <p className="ml-2 text-sm 2xl:text-base">Reportes</p>
                </NavLink>
              )}
              {views.includes('Categoría de gastos') && (
                <NavLink
                  to={'/expensesCategories'}
                  className={({ isActive }) => {
                    return (
                      (isActive
                        ? 'text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green'
                        : 'text-coffee-brown font-semibold border-white') +
                      ' flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green'
                    );
                  }}
                  style={({ isActive }) => {
                    return {
                      borderLeftColor: isActive ? theme.colors.dark : 'transparent',
                      borderLeftWidth: 5,
                    };
                  }}
                >
                  <Grid2X2Icon onClick={() => setIsOpenComponentBigZ(true)} size={iconSize} />
                  <p className="ml-2 text-sm 2xl:text-base">Categoría de gastos</p>
                </NavLink>
              )}
            </>
          )}
        </>
      )}

      <>
        <NavLink
          to={'/actionRol'}
          className={({ isActive }) => {
            return (
              (isActive
                ? 'text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green'
                : 'text-coffee-brown font-semibold border-white') +
              ' flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green'
            );
          }}
          style={({ isActive }) => {
            return {
              borderLeftColor: isActive ? theme.colors.dark : 'transparent',
              borderLeftWidth: 5,
            };
          }}
        >
          <ShieldHalf size={iconSize} />
          <p className="ml-2 text-sm 2xl:text-base">Permisos</p>
        </NavLink>

        {/* Descuentos */}
        {views && views.includes('Descuentos') && (
          <NavLink
            to={'/discounts'}
            className={({ isActive }) => {
              return (
                (isActive
                  ? 'text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green'
                  : 'text-coffee-brown font-semibold border-white') +
                ' flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green'
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : 'transparent',
                borderLeftWidth: 5,
              };
            }}
          >
            <TicketPercent size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Descuentos</p>
          </NavLink>
        )}

        {views && views.includes('Modulos') && (
          <NavLink
            to={'/modules'}
            className={({ isActive }) => {
              return (
                (isActive
                  ? 'text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green'
                  : 'text-coffee-brown font-semibold border-white') +
                ' flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green'
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : 'transparent',
                borderLeftWidth: 5,
              };
            }}
          >
            <FolderOpen size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Modulos</p>
          </NavLink>
        )}
      </>

      <div
        className={
          ' flex w-full py-4 pl-5 cursor-pointer :-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green'
        }
      >
        <Switch
          className="relative"
          onValueChange={(isDark) => toggleContext(isDark ? 'dark' : 'light')}
          isSelected={context === 'dark'}
          size={windowSize.width > 768 ? undefined : 'sm'}
        >
          <p className="relative text-sm lg:text-base">
            {context === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </p>
        </Switch>
      </div>

      {isOpenComponentBigZ && (
        <CushCatsBigZ isOpen={isOpenComponentBigZ} onClose={() => setIsOpenComponentBigZ(false)} />
      )}
      {isCushCatsX && <CashCutsX isOpen={isCushCatsX} onClose={() => setIsCushCatsX(false)} />}
      {isCushCatsZ && <CushCatsZ isOpen={isCushCatsZ} onClose={() => setIsCushCatsZ(false)} />}
    </>
  );
};
