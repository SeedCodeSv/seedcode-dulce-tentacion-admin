import { Switch } from '@nextui-org/react';
import { NavLink, useLocation } from 'react-router-dom';
import LOGO from '../assets/MADNESS.png';
import {
  Home,
  ShieldHalf,
  Grid2X2Icon,
  ChevronDown,
  Book,
  FileText,
  TicketPercent,
  Calendar,
  FolderCog,
  FolderCheck,
  FolderPen,
  ClipboardCheck,
  List,
  Boxes,
} from 'lucide-react';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ThemeContext } from '../hooks/useTheme';
// import { useAuthStore } from '../store/auth.store';
// import { save_seller_mode } from '../storage/localStorage';
// import { useNavigate } from 'react-router';
import { useConfigurationStore } from '../store/perzonalitation.store';
import useWindowSize from '../hooks/useWindowSize';

import { useViewsStore } from '@/store/views.store';
import { validate_pathname, validateIfArrayContain } from '@/utils/filters';
import SidebarLinkGroup from './SidebarLinkGroup';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Barcode } from 'lucide-react';
export const LayoutItems = () => {
  const { OnGetViewasAction, viewasAction } = useViewsStore();

  const { theme, toggleContext, context } = useContext(ThemeContext);
  useEffect(() => {
    if (context === 'dark') {
      document.getElementsByTagName('body')[0].classList.add('dark');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('dark');
    }
    OnGetViewasAction();
  }, [context]);
  const views = viewasAction && viewasAction.map((r) => r.view.name);
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
  const [isContabilityOpen, setIsContabilityOpen] = useState(false);

  const toggleDropdowContabilidad = () => {
    setIsContabilityOpen(!isContabilityOpen);
  };

  const location = useLocation();
  const { pathname } = location;

  const routes_products = [
    {
      name: 'Productos',
      path: '/products',
      show: validateIfArrayContain(views, ['Productos']),
      icon: () => <Barcode size={15} />,
    },
    {
      name: 'Categorías',
      path: '/categories',
      show: validateIfArrayContain(views, ['Categorias']),
      icon: () => <Boxes size={15} />,
    },
    {
      name: 'Sub Categorías',
      path: '/subCategories',
      show: validateIfArrayContain(views, ['Sub Categorias']),
      icon: () => <List size={15} />,
    },
    {
      name: 'Ordenes de compra',
      path: '/purchase-orders',
      // show: validateIfArrayContain(views, ["Ordenes de venta"]),
      show: false,
      icon: () => <List size={15} />,
    },
  ];
  const administration_routes = [
    {
      name: 'Empleados',
      path: '/employees',
      show: validateIfArrayContain(views, ['Empleados']),
    },
    {
      name: 'Clientes',
      path: '/clients',
      show: validateIfArrayContain(views, ['Clientes']),
    },
    {
      name: 'Usuarios',
      path: '/users',
      show: validateIfArrayContain(views, ['Usuarios']),
    },
    {
      name: 'Proveedores',
      path: '/suppliers',
      show: validateIfArrayContain(views, ['Proveedores']),
    },
    {
      name: 'Sucursales',
      path: '/branches',
      show: validateIfArrayContain(views, ['Sucursales']),
    },
  ];
  const reports_routes = [
    {
      name: 'Ventas por periodo',
      path: '/reports/sales-by-period',
      show: validateIfArrayContain(views, ['Reportes']),
      icon: () => <Calendar size={15} />,
    },
    {
      name: 'Ventas por productos',
      path: '/reports/sales-by-product',
      show: validateIfArrayContain(views, ['Reportes']),
      icon: () => <List size={15} />,
    },
  ];

  const planilas_routes = [
    {
      name: 'Nivel de Estudio',
      path: '/studyLevel',
      show: validateIfArrayContain(views, ['Nivel de Estudio']),
      icon: () => <Calendar size={15} />,
    },
    {
      name: 'Estados del Empleado',
      path: '/statusEmployee',
      show: validateIfArrayContain(views, ['Estados del Empleado']),
      icon: () => <List size={15} />,
    },
    {
      name: 'Tipo de Contratacion',
      path: '/contractTypes',
      show: validateIfArrayContain(views, ['Tipo de Contratacion']),
      icon: () => <List size={15} />,
    },
  ];

  const [openGroup, setOpenGroup] = useState<string | null>(null);

  const handleGroupClick = (group: string) => {
    setOpenGroup(openGroup === group ? null : group);
  };

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
      <>
        {views && (
          <ul className="mt-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `group relative flex items-center gap-2.5 rounded-sm py-4 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    isActive && 'bg-gray-200 dark:bg-gray-700'
                  }`
                }
              >
                <Home />
                Inicio
              </NavLink>
            </li>

            {validateIfArrayContain(views, [
              'Productos',
              'Categorias',
              'Sub Categorias',
              'Ordenes de compra',
            ]) && (
              <>
                <ul className="flex flex-col gap-1.5">
                  <SidebarLinkGroup
                    activeCondition={validate_pathname(pathname, [
                      'products',
                      'categories',
                      'subCategories',
                      'orders',
                    ])}
                    isOpen={openGroup === 'productos'}
                    onGroupClick={() => handleGroupClick('productos')}
                  >
                    {(handleClick, open) => (
                      <>
                        <div
                          className={classNames(
                            validate_pathname(pathname, [
                              'products',
                              'categories',
                              'subCategories',
                              'orders',
                            ]) && 'bg-gray-200 dark:bg-gray-700',
                            'group cursor-pointer relative flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700'
                          )}
                          onClick={handleClick}
                        >
                          <div className="flex items-center gap-2.5">
                            <FileText size={iconSize} />
                            Gestión productos
                          </div>
                          <ChevronDown
                            className={classNames(open && ' rotate-180', 'items-end justify-end ')}
                            size={iconSize}
                          />
                        </div>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: open ? 1 : 0,
                            height: open ? 'auto' : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden transform translate"
                        >
                          <ul className="mt-1 mb-3 flex flex-col gap-2.5 pl-4">
                            {routes_products.map((item, index) => (
                              <>
                                {item.show && (
                                  <li className="py-1" key={index}>
                                    <NavLink
                                      to={item.path}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out ' +
                                        (isActive && 'font-semibold')
                                      }
                                    >
                                      {item.icon()} {item.name}
                                    </NavLink>
                                  </li>
                                )}
                              </>
                            ))}
                          </ul>
                        </motion.div>
                      </>
                    )}
                  </SidebarLinkGroup>
                </ul>
              </>
            )}
            {validateIfArrayContain(views, [
              'Empleados',
              'Clientes',
              'Cargos de Empleados',
              'Usuarios',
              'Sucursales',
            ]) && (
              <>
                <ul className="flex flex-col gap-1.5">
                  <SidebarLinkGroup
                    activeCondition={validate_pathname(pathname, [
                      'employees',
                      'clients',
                      'users',
                      'branches',
                      'suppliers',
                    ])}
                    isOpen={openGroup === 'administración'}
                    onGroupClick={() => handleGroupClick('administración')}
                  >
                    {(handleClick, open) => (
                      <>
                        <div
                          className={classNames(
                            validate_pathname(pathname, [
                              'employees',
                              'clients',
                              'users',
                              'branches',
                              'suppliers',
                            ]) && 'bg-gray-200 dark:bg-gray-700',
                            'group relative cursor-pointer flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700'
                          )}
                          onClick={handleClick}
                        >
                          <div className="flex items-center gap-2.5">
                            <FolderCog size={iconSize} />
                            Administración
                          </div>
                          <ChevronDown
                            className={classNames(open && ' rotate-180', 'items-end justify-end ')}
                            size={iconSize}
                          />
                        </div>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: open ? 1 : 0,
                            height: open ? 'auto' : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden transform translate"
                        >
                          <ul className="mt-2 flex flex-col gap-2.5 pl-6">
                            {administration_routes.map((item) => (
                              <>
                                {item.show && (
                                  <li>
                                    <NavLink
                                      to={item.path}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && 'font-semibold')
                                      }
                                    >
                                      {item.name}
                                    </NavLink>
                                  </li>
                                )}
                              </>
                            ))}
                          </ul>
                        </motion.div>
                      </>
                    )}
                  </SidebarLinkGroup>
                </ul>
              </>
            )}
            {validateIfArrayContain(views, ['Reportes']) && (
              <>
                <ul className="flex flex-col gap-1.5">
                  <SidebarLinkGroup
                    activeCondition={validate_pathname(pathname, ['reports'])}
                    isOpen={openGroup === 'reports'}
                    onGroupClick={() => handleGroupClick('reports')}
                  >
                    {(handleClick, open) => (
                      <>
                        <div
                          className={classNames(
                            validate_pathname(pathname, ['reports']) &&
                              'bg-gray-200 dark:bg-gray-700',
                            'group relative cursor-pointer flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700'
                          )}
                          onClick={handleClick}
                        >
                          <div className="flex items-center gap-2.5">
                            <FolderCheck size={iconSize} />
                            Gestión de reportes
                          </div>
                          <ChevronDown
                            className={classNames(open && ' rotate-180', 'items-end justify-end ')}
                            size={iconSize}
                          />
                        </div>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: open ? 1 : 0,
                            height: open ? 'auto' : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden transform translate"
                        >
                          <ul className="mt-2 mb-2 flex flex-col gap-2.5 pl-4">
                            {reports_routes.map((item) => (
                              <>
                                {item.show && (
                                  <li className="py-1">
                                    <NavLink
                                      to={item.path}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out ' +
                                        (isActive && 'font-semibold')
                                      }
                                    >
                                      {item.icon()} {item.name}
                                    </NavLink>
                                  </li>
                                )}
                              </>
                            ))}
                          </ul>
                        </motion.div>
                      </>
                    )}
                  </SidebarLinkGroup>
                </ul>
              </>
            )}

            {validateIfArrayContain(views, [
              'Nivel de Estudio',
              'Estados del Empleado',
              'Tipo de Contratacion',
            ]) && (
              <>
                <ul className="flex flex-col gap-1.5">
                  <SidebarLinkGroup
                    activeCondition={validate_pathname(pathname, [
                      'Nivel de Estudio',
                      'Estados del Empleado',
                      'Tipo de Contratacion',
                    ])}
                    isOpen={openGroup === 'planillas'}
                    onGroupClick={() => handleGroupClick('planillas')}
                  >
                    {(handleClick, open) => (
                      <>
                        <div
                          className={classNames(
                            validate_pathname(pathname, [
                              'Nivel de Estudio',
                              'Estados del Empleado',
                              'Tipo de Contratacion',
                            ]) && 'bg-gray-200 dark:bg-gray-700',
                            'group relative cursor-pointer flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700'
                          )}
                          onClick={handleClick}
                        >
                          <div className="flex items-center gap-2.5">
                            <FolderCheck size={iconSize} />
                            Gestión de planillas
                          </div>
                          <ChevronDown
                            className={classNames(open && ' rotate-180', 'items-end justify-end ')}
                            size={iconSize}
                          />
                        </div>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{
                            opacity: open ? 1 : 0,
                            height: open ? 'auto' : 0,
                          }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden transform translate"
                        >
                          <ul className="mt-2 mb-2 flex flex-col gap-2.5 pl-4">
                            {planilas_routes.map((item, index) => (
                              <>
                                {item.show && (
                                  <li className="py-1" key={index}>
                                    <NavLink
                                      to={item.path}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out ' +
                                        (isActive && 'font-semibold')
                                      }
                                    >
                                      {item.icon()} {item.name}
                                    </NavLink>
                                  </li>
                                )}
                              </>
                            ))}
                          </ul>
                        </motion.div>
                      </>
                    )}
                  </SidebarLinkGroup>
                </ul>
              </>
            )}
            {/* Gestion de planillas ----------------------------------------------------------------- */}

            {/* {views.includes('Tipo de Contratacion') ||
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
                  <ChevronDown className="items-end justify-end dark:text-white" size={iconSize} />
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
            ) : null} */}
            {/* fin de gestion de planillas -------------------------------------------------------------*/}
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
                    className="items-end justify-end dark:text-white h"
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
                      to={'/cash-cuts-big-z'}
                      className={({ isActive }) => {
                        return (
                          (isActive
                            ? 'font-semibold bg-gray-white'
                            : 'text-coffee-brown font-semibold border-white') +
                          ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                        );
                      }}
                    >
                      <ClipboardCheck size={iconSize} />
                      <p className="ml-2 text-sm 2xl:text-base">Corte Gran Z</p>
                    </NavLink>
                    <NavLink
                      to={'/cash-cuts-x'}
                      className={({ isActive }) => {
                        return (
                          (isActive
                            ? 'font-semibold bg-gray-white'
                            : 'text-coffee-brown font-semibold border-white') +
                          ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                        );
                      }}
                    >
                      <ClipboardCheck size={iconSize} />
                      <p className="ml-2 text-sm 2xl:text-base">Corte de X</p>
                    </NavLink>

                    <NavLink
                      to={'/cash-cuts-z'}
                      className={({ isActive }) => {
                        return (
                          (isActive
                            ? 'font-semibold bg-gray-white'
                            : 'text-coffee-brown font-semibold border-white') +
                          ' flex items-center w-full py-3 px-2 cursor-pointer rounded-lg hover:text-coffee-green hover:font-semibold dark:text-white'
                        );
                      }}
                    >
                      <ClipboardCheck size={iconSize} />
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
                <Grid2X2Icon size={iconSize} />
                <p className="ml-2 text-sm 2xl:text-base">Categoría de gastos</p>
              </NavLink>
            )}
          </ul>
        )}
      </>

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
    </>
  );
};
