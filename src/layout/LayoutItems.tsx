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
  Calendar,
  FolderCog,
  FolderCheck,
  List,
  Boxes,
  GraduationCap,
  BookUser,
  Handshake,
  ClipboardCheck,
  User,
  Truck,
  Store,
  UserCheck,
  ShoppingBag,
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

  const location = useLocation();
  const { pathname } = location;

  const routes_products = [
    {
      name: 'Productos',
      path: '/products',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Productos']),
      icon: () => <Barcode size={15} />,
    },
    {
      name: 'Categorías',
      path: '/categories',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Categorias']),
      icon: () => <Boxes size={15} />,
    },
    {
      name: 'Sub Categorías',
      path: '/subCategories',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Sub Categorias']),
      icon: () => <List size={15} />,
    },
    {
      name: 'Compras',
      path: '/shopping',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Compras']),
      icon: () => <ShoppingBag size={15} />,
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
      show: validateIfArrayContain && validateIfArrayContain(views, ['Empleados']),
      icon: () => <UserCheck size={15} />,
    },
    {
      name: 'Clientes',
      path: '/clients',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Clientes']),
      icon: () => <BookUser size={15} />,
    },
    {
      name: 'Usuarios',
      path: '/users',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Usuarios']),
      icon: () => <User size={15} />,
    },
    {
      name: 'Proveedores',
      path: '/suppliers',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Proveedores']),
      icon: () => <Truck size={15} />,
    },
    {
      name: 'Sucursales',
      path: '/branches',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Sucursales']),
      icon: () => <Store size={15} />,
    },
  ];
  const reports_routes = [
    {
      name: 'Ventas por periodo',
      path: '/reports/sales-by-period',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Reportes']),
      icon: () => <Calendar size={15} />,
    },
    {
      name: 'Ventas por productos',
      path: '/reports/sales-by-product',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Reportes']),
      icon: () => <List size={15} />,
    },
  ];

  const planilas_routes = [
    {
      name: 'Nivel de Estudio',
      path: '/studyLevel',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Nivel de Estudio']),
      icon: () => <GraduationCap size={15} />,
    },
    {
      name: 'Estados del Empleado',
      path: '/statusEmployee',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Estados del Empleado']),
      icon: () => <BookUser size={15} />,
    },
    {
      name: 'Tipo de Contratación',
      path: '/contractTypes',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Tipo de Contratacion']),
      icon: () => <Handshake size={15} />,
    },
  ];

  const accounting_routes = [
    {
      name: 'Corte Gran Z',
      path: '/cash-cuts-big-z',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Contabilidad']),
      icon: () => <ClipboardCheck size={15} />,
    },
    {
      name: 'Corte X',
      path: '/cash-cuts-x',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Contabilidad']),
      icon: () => <ClipboardCheck size={15} />,
    },
    {
      name: 'Corte Z',
      path: '/cash-cuts-z',
      show: validateIfArrayContain && validateIfArrayContain(views, ['Contabilidad']),
      icon: () => <ClipboardCheck size={15} />,
    },
    {
      name: "IVA - Compras",
      path: "/iva/shopping-book",
      show: validateIfArrayContain && validateIfArrayContain(views, ["Contabilidad"]),
      icon: () => <List size={15} />,
    },
    {
      name: "IVA - CCF",
      path: "/iva/cff-book",
      show: validateIfArrayContain && validateIfArrayContain(views, ["Contabilidad"]),
      icon: () => <Truck size={15} />,
    },
    {
      name: "IVA - Facturas",
      path: "/iva/fe-book",
      show: validateIfArrayContain && validateIfArrayContain(views, ["Contabilidad"]),
      icon: () => <Store size={15} />,
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
              'Compras',
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
                      'compras',
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
                              'compras',
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
                            {administration_routes.map((item, index) => (
                              <>
                                {item.show && (
                                  <li className="py-1" key={index}>
                                    <NavLink
                                      to={item.path}
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
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

            {validateIfArrayContain(views, ['Contabilidad']) && (
              <>
                <ul className="flex flex-col gap-1.5">
                  <SidebarLinkGroup
                    activeCondition={validate_pathname(pathname, ['contabilidad'])}
                    isOpen={openGroup === 'contabilidad'}
                    onGroupClick={() => handleGroupClick('contabilidad')}
                  >
                    {(handleClick, open) => (
                      <>
                        <div
                          className={classNames(
                            validate_pathname(pathname, ['contabilidad']) &&
                              'bg-gray-200 dark:bg-gray-700',
                            'group relative cursor-pointer flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700'
                          )}
                          onClick={handleClick}
                        >
                          <div className="flex items-center gap-2.5">
                            <FolderCheck size={iconSize} />
                            Contabilidad
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
                            {accounting_routes.map((item) => (
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
            <li>
              <NavLink
                to="/actionRol"
                className={({ isActive }) =>
                  `group relative flex items-center gap-2.5 rounded-sm py-4 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    isActive && 'bg-gray-200 dark:bg-gray-700'
                  }`
                }
              >
                <ShieldHalf />
                Permisos
              </NavLink>
            </li>
          </ul>
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
