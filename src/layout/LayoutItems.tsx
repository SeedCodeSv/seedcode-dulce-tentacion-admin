import { Button, Switch } from '@nextui-org/react';
import { NavLink } from 'react-router-dom';
import LOGO from '../assets/react.svg';
import {
  Home,
  Box,
  User,
  BookUser,
  ShieldHalf,
  Grid2X2Icon,
  ShoppingCart,
  DollarSign,
  Contact,
  ScanBarcode,
  AlignJustify,
  ChevronDown,
  FolderOpen,
  Store,
  Truck,
  ShoppingBag,
  Book,
} from 'lucide-react';
import { Fragment, useContext, useEffect, useMemo } from 'react';
import { ThemeContext } from '../hooks/useTheme';
import { useAuthStore } from '../store/auth.store';
import { save_seller_mode } from '../storage/localStorage';
import { useNavigate } from 'react-router';
import { SessionContext } from '../hooks/useSession';
import { useConfigurationStore } from '../store/perzonalitation.store';
import useWindowSize from '../hooks/useWindowSize';
import { Menu, Transition } from '@headlessui/react';
import { ActionsContext } from '../hooks/useActions';
import SalesMode from './LayoutModes/SalesMode';
export const LayoutItems = () => {
  const { theme, toggleContext, context } = useContext(ThemeContext);
  const { makeLogout } = useAuthStore();
  const { setIsAuth, setToken, mode, setMode } = useContext(SessionContext);
  useEffect(() => {
    if (context === 'dark') {
      document.getElementsByTagName('body')[0].classList.add('dark');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('dark');
    }
  }, [context]);
  const navigate = useNavigate();
  const handleSeller = () => {
    setMode('vendedor');
    save_seller_mode('vendedor');
    makeLogout();
    setIsAuth(false);
    setToken('');
    navigate('/');
  };
  const handleAdmin = () => {
    setMode('');
    makeLogout();
    localStorage.removeItem('seller_mode');
    setIsAuth(false);
    setToken('');
    navigate('/');
  };

  const { personalization } = useConfigurationStore();
  const { windowSize } = useWindowSize();
  const  iconSize = useMemo(() => {
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
            SeedCodeERP
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

      {mode !== 'vendedor' ? (
        <div className=" justify-center items-center px-2 mt-2">
          <Button
            onClick={() => handleSeller()}
            className="text-coffee-green font-semibold bg-gray-100  border-coffee-green justify-center items-center bg-transparent"
          >
            <ShoppingCart size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Modo venta</p>
          </Button>
        </div>
      ) : (
        <div className=" justify-center items-center px-2 mt-2">
          <Button
            onClick={() => handleAdmin()}
            className="text-coffee-green font-semibold bg-gray-100  border-coffee-green justify-center items-center bg-transparent"
          >
            <Contact size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Administración</p>
          </Button>
        </div>
      )}
      {mode === 'vendedor' && <SalesMode />}
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

              {views.includes('Productos') && (
                <NavLink
                  to={'/products'}
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
                  <Box size={iconSize} />
                  <p className="ml-2 text-sm 2xl:text-base">Categorías</p>
                </NavLink>
              )}

              {views.includes('Reportes') && (
                <>
                  <Menu as="div" className="relative px-4 z-50 w-full">
                    <div>
                      <Menu.Button className="inline-flex w-full font-semibold py-2  gap-x-1.5 ml-2 text-sm 2xl:text-base">
                        <AlignJustify size={iconSize} />
                        Reportes
                        <ChevronDown className="justify-end items-end  ml-16" size={iconSize} />
                      </Menu.Button>
                    </div>

                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute z-20 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-black shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <Menu.Item>
                            <NavLink
                              to={'/sales-by-branch'}
                              className={({ isActive }) => {
                                return (
                                  (isActive
                                    ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                    : 'text-coffee-brown font-semibold border-white') +
                                  ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                                );
                              }}
                            >
                              <User size={iconSize} />
                              <p className="ml-2 text-sm 2xl:text-base">Ventas Sucursal</p>
                            </NavLink>
                          </Menu.Item>

                          <Menu.Item>
                            <NavLink
                              to={'/expenses-by-branch'}
                              className={({ isActive }) => {
                                return (
                                  (isActive
                                    ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                    : 'text-coffee-brown font-semibold border-white') +
                                  ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                                );
                              }}
                            >
                              <BookUser size={iconSize} />
                              <p className="ml-2 text-sm 2xl:text-base">
                                Gastos Sucursal
                              </p>
                            </NavLink>
                          </Menu.Item>
                          <Menu.Item>
                            <NavLink
                              to={'/most-product-transmitter-selled'}
                              className={({ isActive }) => {
                                return (
                                  (isActive
                                    ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                    : 'text-coffee-brown font-semibold border-white') +
                                  ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                                );
                              }}
                            >
                              <BookUser size={iconSize} />
                              <p className="ml-2 text-sm 2xl:text-base">Producto mas vendido</p>
                            </NavLink>
                          </Menu.Item>
                          


                          
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              )}
              {views.includes('Empleados') ||
              (views && views.includes('Clientes')) ||
              views.includes('Usuarios') ||
              views.includes('Sucursales') ? (
                <>
                  <Menu as="div" className="relative px-4 z-20  w-full">
                    <div>
                      <Menu.Button className="inline-flex w-full font-semibold py-2  gap-x-1.5 ml-2 text-sm 2xl:text-base">
                        <AlignJustify size={iconSize} />
                        Menú
                        <ChevronDown className="justify-end items-end  ml-20" size={iconSize} />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-950 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          {views.includes('Empleados') && (
                            <Menu.Item>
                              {views.includes('Empleados') && (
                                <NavLink
                                  to={'/employees'}
                                  className={({ isActive }) => {
                                    return (
                                      (isActive
                                        ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                        : 'text-coffee-brown font-semibold border-white') +
                                      ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                                    );
                                  }}
                                >
                                  <User size={iconSize} />
                                  <p className="ml-2 text-sm 2xl:text-base">Empleados</p>
                                </NavLink>
                              )}
                            </Menu.Item>
                          )}
                          {views && views.includes('Clientes') && (
                            <Menu.Item>
                              {views.includes('Clientes') && (
                                <NavLink
                                  to={'/clients'}
                                  className={({ isActive }) => {
                                    return (
                                      (isActive
                                        ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                        : 'text-coffee-brown font-semibold border-white') +
                                      ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                                    );
                                  }}
                                >
                                  <BookUser size={iconSize} />
                                  <p className="ml-2 text-sm 2xl:text-base">Clientes</p>
                                </NavLink>
                              )}
                            </Menu.Item>
                          )}

                          {views.includes('Usuarios') && (
                            <Menu.Item>
                              {views.includes('Usuarios') && (
                                <NavLink
                                  to={'/users'}
                                  className={({ isActive }) => {
                                    return (
                                      (isActive
                                        ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                        : 'text-coffee-brown font-semibold border-white') +
                                      ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                                    );
                                  }}
                                >
                                  <User size={iconSize} />
                                  <p className="ml-2 text-sm 2xl:text-base">Usuarios</p>
                                </NavLink>
                              )}
                            </Menu.Item>
                          )}
                          {views.includes('Proveedores') && (
                            <Menu.Item>
                              <NavLink
                                to={'/suppliers'}
                                className={({ isActive }) => {
                                  return (
                                    (isActive
                                      ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                      : 'text-coffee-brown font-semibold border-white') +
                                    ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                                  );
                                }}
                              >
                                <Truck size={iconSize} />
                                <p className="ml-2 text-base">Proveedores</p>
                              </NavLink>
                            </Menu.Item>
                          )}
                          {views.includes('Sucursales') && (
                            <Menu.Item>
                              {views.includes('Sucursales') && (
                                <NavLink
                                  to={'/branches'}
                                  className={({ isActive }) => {
                                    return (
                                      (isActive
                                        ? 'font-semibold bg-gray-300 dark:bg-gray-700'
                                        : 'text-coffee-brown font-semibold border-white') +
                                      ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                                    );
                                  }}
                                >
                                  <Store size={iconSize} />
                                  <p className="ml-2 text-base">Sucursales</p>
                                </NavLink>
                              )}
                            </Menu.Item>
                          )}
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </>
              ) : null}
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
                  <Grid2X2Icon size={iconSize} />
                  <p className="ml-2 text-sm 2xl:text-base">Categoría de gastos</p>
                </NavLink>
              )}
            </>
          )}
        </>
      )}
      <>
        {views && views.includes('Reporte de ventas') && (
          <NavLink
            to={'/sales-reports'}
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
            <DollarSign size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Reporte de Ventas</p>
          </NavLink>
        )}
      </>

      {mode !== 'vendedor' && (
        <>
          {views && views.includes('Permisos') && (
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
          {views && views.includes('Ordenes de compra') && (
            <NavLink
              to={'/purchase-orders'}
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
              <ShoppingBag size={iconSize} />
              <p className="ml-2 text-sm 2xl:text-base">Ordenes de compra</p>
            </NavLink>
          )}
        </>
      )}
      <div
        className={
          ' flex w-full py-4 pl-5 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green'
        }
      >
        <Switch
          className="relative"
          onValueChange={(isDark) => toggleContext(isDark ? 'dark' : 'light')}
          isSelected={context === 'dark'}
          size={windowSize.width > 768 ? undefined : 'sm'}
        >
          <p className="text-sm lg:text-base relative">
            {context === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </p>
        </Switch>
      </div>
    </>
  );
};
