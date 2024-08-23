import { Switch } from '@nextui-org/react';
import { NavLink, useLocation } from 'react-router-dom';
import LOGO from '../assets/MADNESS.png';
import {
  Home,
  ChevronDown,
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
import { useConfigurationStore } from '../store/perzonalitation.store';
import useWindowSize from '../hooks/useWindowSize';
import { validate_pathname } from '@/utils/filters';
import SidebarLinkGroup from './SidebarLinkGroup';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Barcode } from 'lucide-react';
import SidebarLinkList from '@/components/global/SidebarLinkList ';

export const LayoutItems = () => {
  const { theme, toggleContext, context } = useContext(ThemeContext);
  useEffect(() => {
    if (context === 'dark') {
      document.getElementsByTagName('body')[0].classList.add('dark');
    } else {
      document.getElementsByTagName('body')[0].classList.remove('dark');
    }
  }, [context]);

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
  const linksProductManagement = [
    { viewName: 'Productos', to: '/products', icon: Barcode, label: 'Productos' },
    {
      viewName: 'Categorias de Productos',
      to: '/categories',
      icon: Boxes,
      label: 'Categorías ',
    },
    {
      viewName: 'Sub Categorias',
      to: '/subCategories',
      icon: List,
      label: 'Sub Categorías',
    },
    {
      viewName: 'Compras',
      to: '/shopping',
      icon: ShoppingBag,
      label: 'Compras',
    },
    {
      viewName: 'Ordenes de Compra',
      to: '/purchase-orders',
      icon: List,
      label: 'Ordenes de Compra',
    },
  ];

  const linkAdministration = [
    {
      viewName: 'Usuarios',
      to: '/users',
      icon: User,
      label: 'Usuarios',
    },
    {
      viewName: 'Empleados',
      to: '/employees',
      icon: UserCheck,
      label: 'Empleados',
    },
    {
      viewName: 'Proveedores',
      to: '/suppliers',
      icon: Truck,
      label: 'Proveedores',
    },
    {
      viewName: 'Sucursales',
      to: '/branches',
      icon: Store,
      label: 'Sucursales',
    },
    {
      viewName: 'Clientes',
      to: '/clients',
      icon: BookUser,
      label: 'Clientes',
    },
    {
      viewName: 'Permisos',
      to: '/actionRol',
      icon: FolderCheck,
      label: 'Permisos',
    },
  ];
  const linkReports = [
    {
      viewName: 'Ventas por Periodo',
      to: '/reports/sales-by-period',
      icon: Calendar,
      label: 'Ventas por Periodo',
    },
    {
      viewName: 'Ventas por Productos',
      to: '/reports/sales-by-product',
      icon: List,
      label: 'Ventas por Productos',
    },
  ];

  const linkPlanification = [
    {
      viewName: 'Nivel de Estudio',
      to: '/studyLevel',
      icon: GraduationCap,
      label: 'Nivel de Estudio',
    },
    {
      viewName: 'Tipo de Contratacion',
      to: '/contractTypes',
      icon: Handshake,
      label: 'Tipo de Contratacion',
    },
    {
      viewName: 'Estados del Empleado',
      to: '/statusEmployee',
      icon: BookUser,
      label: 'Estados del Empleado',
    },
  ];

  const linkAccounting = [
    {
      viewName: 'Corte Gran Z',
      to: '/cash-cuts-big-z',
      icon: ClipboardCheck,
      label: 'Corte Gran Z',
    },
    {
      viewName: 'Correlativos',
      to: '/correlative',
      icon: ClipboardCheck,
      label: 'Correlativos',
    },
    {
      viewName: 'Corte X',
      to: '/cash-cuts-x',
      icon: ClipboardCheck,
      label: 'Corte X',
    },

    {
      viewName: 'Corte Z',
      to: '/cash-cuts-z',
      icon: ClipboardCheck,
      label: 'Corte Z',
    },
    {
      viewName: 'IVA de Compras',
      to: '/iva/shopping-book',
      icon: List,
      label: 'IVA-Compras',
    },

    {
      viewName: 'IVA de CCF',
      to: '/iva/ccf-book',
      icon: Truck,
      label: 'IVA-CCF',
    },
    {
      viewName: 'IVA de FE',
      to: '/iva/fe-book',
      icon: Store,
      label: 'IVA - Facturas',
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
                      <SidebarLinkList links={linksProductManagement} />
                    </motion.div>
                  </>
                )}
              </SidebarLinkGroup>
            </ul>
          </>

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
                      <SidebarLinkList links={linkAdministration} />
                    </motion.div>
                  </>
                )}
              </SidebarLinkGroup>
            </ul>
          </>

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
                        validate_pathname(pathname, ['reports']) && 'bg-gray-200 dark:bg-gray-700',
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
                      <SidebarLinkList links={linkReports} />
                    </motion.div>
                  </>
                )}
              </SidebarLinkGroup>
            </ul>
          </>

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
                      <SidebarLinkList links={linkPlanification} />
                    </motion.div>
                  </>
                )}
              </SidebarLinkGroup>
            </ul>
          </>

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
                      <SidebarLinkList links={linkAccounting} />
                    </motion.div>
                  </>
                )}
              </SidebarLinkGroup>
            </ul>
          </>
        </ul>
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
