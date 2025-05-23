import { Button, Switch } from '@heroui/react';
import { NavLink, useLocation } from 'react-router-dom';
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
  BookCheck,
  BadgeDollarSign,
  MapPinned,
  Tag,
  DatabaseBackup,
  HandCoins,
  Book,
  X,
  ListOrdered,
  ArrowDownUp,
  ShoppingBasket,
  FileCog
} from 'lucide-react';
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Barcode } from 'lucide-react';
import { FaChartLine } from 'react-icons/fa';

import LOGO from '../assets/dulce-logo.png';
import { ThemeContext } from '../hooks/useTheme';
import { useConfigurationStore } from '../store/perzonalitation.store';
import useWindowSize from '../hooks/useWindowSize';

import SidebarLinkGroup from './SidebarLinkGroup';
import { hexToRgba } from './utils';

import { validate_pathname } from '@/utils/filters';
import SidebarLinkList from '@/components/global/SidebarLinkList ';


interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LayoutItems = (props: Props) => {
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
    ,
    {
      viewName: 'Categorias de Productos',
      to: '/categories',
      icon: Boxes,
      label: 'Categorías ',
    },
    {
      viewName: 'Sub Categorias',
      to: '/sub-categories',
      icon: List,
      label: 'Sub Categorías',
    },
    {
      viewName: 'Ordenes de producción',
      to: '/production-orders',
      icon: ListOrdered,
      label: 'Ordenes de producción',
    },
    {
      viewName: 'Tipos de ordenes de producción',
      to: '/production-order-types',
      icon: ListOrdered,
      label: 'Tipos de Ordenes de producción',
    },
    {
      viewName: 'Compras',
      to: '/shopping',
      icon: ShoppingBag,
      label: 'Compras',
    },
    {
      viewName: 'Ajuste de Inventario',
      to: '/inventary-adjustment',
      icon: FileCog,
      label: 'Ajuste de Inventario',
    },
    {
      viewName: 'Ordenes de Compra',
      to: '/purchase-orders',
      icon: ShoppingBasket,
      label: 'Ordenes de Compra',
    },
    {
      viewName: 'Notas de remisión',
      to: '/note-referal',
      icon: FaChartLine,
      label: 'Ver Notas de remisión',
    },
    { viewName: 'Control de existencias', 
      to: '/MWSC',
       icon: Barcode, 
       label: 'Control de existencias' 
      }

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
      to: '/action-rol',
      icon: FolderCheck,
      label: 'Permisos',
    },
    {
      viewName: 'Invalidaciones',
      to: '/reports/sales-invalidation',
      icon: BadgeDollarSign,
      label: 'Invalidaciones',
    },
    {
      viewName: 'Puntos de Venta',
      to: '/points-of-sales',
      icon: MapPinned,
      label: 'Puntos de Venta',
    },
  ];
  const linkReports = [
    {
      viewName: 'Ventas por Periodo',
      to: '/sales-by-period',
      icon: Calendar,
      label: 'Ventas por Periodo',
    },
    {
      viewName: 'Ventas por Productos',
      to: '/reports/sales-by-product',
      icon: List,
      label: 'Ventas por Productos',
    },
    {
      viewName: 'Ventas',
      to: '/sales',
      icon: Tag,
      label: 'Ventas facturación electronica',
    },
    {
      viewName: 'Contingencias',
      to: '/contingence-section',
      icon: DatabaseBackup,
      label: 'Contingencias',
    },
    {
      viewName: 'Movimientos',
      to: '/movement',
      icon: ArrowDownUp,
      label: 'Movimientos',
    },
    {
      viewName: 'Kardex',
      to: '/kardex-inventory',
      icon: List,
      label: 'Kardex',
    },
    {
      viewName: 'Ver invalidaciones',
      to: '/list-invalidations',
      icon: List,
      label: 'Ver invalidaciones',
    },


  ];

  const linkPlanification = [
    {
      viewName: 'Nivel de Estudio',
      to: '/study-level',
      icon: GraduationCap,
      label: 'Nivel de Estudio',
    },
    {
      viewName: 'Tipo de Contratacion',
      to: '/contract-types',
      icon: Handshake,
      label: 'Tipo de Contratacion',
    },
    {
      viewName: 'Estados del Empleado',
      to: '/status-employee',
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
      viewName: 'Correlativos',
      to: '/correlative',
      icon: BookCheck,
      label: 'Correlativos',
    },
    {
      viewName: 'Catalogos de Cuentas',
      to: '/account-catalogs',
      icon: BookCheck,
      label: 'Catálogos de Cuentas',
    },
    {
      viewName: 'Tipos de partida',
      to: '/type-accounting',
      icon: BookCheck,
      label: 'Tipos de partida',
    },
    {
      viewName: 'Partidas contables',
      to: '/accounting-items',
      icon: BookCheck,
      label: 'Partidas contables',
    },
    {
      viewName: 'Reportes contables',
      to: '/report-accounting',
      icon: BookCheck,
      label: 'Reportes contables',
    },
  ];

  const booksLinks = [
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

  const annexesLinks = [
    {
      viewName: 'Anexos de compras',
      to: '/anexos-iva-compras',
      icon: HandCoins,
      label: 'Anexos de compras',
    },
    {
      viewName: 'Anexos de consumidor final',
      to: '/anexos-fe',
      icon: HandCoins,
      label: 'Anexos de consumidor final',
    },
    {
      viewName: 'Anexos ventas a contribuyentes',
      to: '/anexos-ccfe',
      icon: HandCoins,
      label: 'Anexos ventas a contribuyentes',
    },
  ];
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const handleGroupClick = (group: string) => {
    setOpenGroup(openGroup === group ? null : group);
  };

  return (
    <>
      <div className="flex justify-between items-center h-[70px]">
        {personalization.length === 0 ? (
          <div className="flex items-center pl-5 w-full shadow">
            <img alt="LOGO" className="max-h-12" src={LOGO} />
          </div>
        ) : (
          <>
            {personalization.map((item) => (
              <div key={item.id} className="flex items-center justify-center w-full shadow">
                <img alt="LOGO" className="max-h-12" src={item.logo} />
              </div>
            ))}
          </>
        )}
        {props.isOpen && (
          <Button isIconOnly onPress={() => props.setIsOpen(false)}>
            <X />
          </Button>
        )}
      </div>
      <>
        <ul className="mt-2">
          <li>
            <NavLink
              className={`group relative flex items-center gap-2.5 rounded-sm py-4 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700
                `}
              style={({ isActive }) => ({
                backgroundColor: isActive
                  ? hexToRgba(theme.colors[context].menu.textColor, 0.3)
                  : theme.colors[context].menu.background,
                color: theme.colors[context].menu.textColor,
              })}
              to="/"
            >
              <Home />
              Inicio
            </NavLink>
          </li>

          <>
            <ul className="flex flex-col gap-1.5">
              <SidebarLinkGroup
                activeCondition={
                  validate_pathname(pathname, [
                    'products',
                    'categories',
                    'subCategories',
                    'orders',
                    'compras',
                    'MWSC'
                  ]) && openGroup === 'gestion-productos'
                }
                isOpen={openGroup === 'gestion-productos'}
                onGroupClick={() => handleGroupClick('gestion-productos')}
              >
                {(handleClick, open) => (
                  <>
                    <button
                      className={classNames(
                        'group w-full relative flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium duration-300 ease-in-out'
                      )}
                      style={{
                        backgroundColor: validate_pathname(pathname, [
                          'products',
                          'categories',
                          'subCategories',
                          'orders',
                          'compras',
                          'MWSC'

                        ])
                          ? hexToRgba(theme.colors[context].menu.textColor, 0.3)
                          : theme.colors[context].menu.background,
                        color: theme.colors[context].menu.textColor,
                      }}
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
                    </button>
                    <motion.div
                      animate={{
                        opacity: open ? 1 : 0,
                        height: open ? 'auto' : 0,
                      }}
                      className="overflow-hidden transform translate"
                      initial={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
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
                activeCondition={
                  validate_pathname(pathname, [
                    'employees',
                    'clients',
                    'users',
                    'branches',
                    'suppliers',
                    'pointsOfSale',
                  ]) && openGroup === 'administración'
                }
                isOpen={openGroup === 'administración'}
                onGroupClick={() => handleGroupClick('administración')}
              >
                {(handleClick, open) => (
                  <>
                    <button
                      className={classNames(
                        'group relative w-full flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium text-body duration-300 ease-in-out'
                      )}
                      style={{
                        backgroundColor: validate_pathname(pathname, [
                          'employees',
                          'clients',
                          'users',
                          'branches',
                          'suppliers',
                          'pointsOfSale',
                        ])
                          ? hexToRgba(theme.colors[context].menu.textColor, 0.3)
                          : theme.colors[context].menu.background,
                        color: theme.colors[context].menu.textColor,
                      }}
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
                    </button>
                    <motion.div
                      animate={{
                        opacity: open ? 1 : 0,
                        height: open ? 'auto' : 0,
                      }}
                      className="overflow-hidden transform translate"
                      initial={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
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
                activeCondition={validate_pathname(pathname, ['gestion-reports'])}
                isOpen={openGroup === 'gestion-reports'}
                onGroupClick={() => handleGroupClick('gestion-reports')}
              >
                {(handleClick, open) => (
                  <>
                    <button
                      className={classNames(
                        'group relative w-full flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700'
                      )}
                      style={{
                        backgroundColor: validate_pathname(pathname, ['gestion-reports'])
                          ? hexToRgba(theme.colors[context].menu.textColor, 0.3)
                          : theme.colors[context].menu.background,
                        color: theme.colors[context].menu.textColor,
                      }}
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
                    </button>
                    <motion.div
                      animate={{
                        opacity: open ? 1 : 0,
                        height: open ? 'auto' : 0,
                      }}
                      className="overflow-hidden transform translate"
                      initial={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
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
                activeCondition={
                  validate_pathname(pathname, [
                    'Nivel de Estudio',
                    'Estados del Empleado',
                    'Tipo de Contratacion',
                  ]) && openGroup === 'planillas'
                }
                isOpen={openGroup === 'planillas'}
                onGroupClick={() => handleGroupClick('planillas')}
              >
                {(handleClick, open) => (
                  <>
                    <button
                      className={classNames(
                        'group relative w-full flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50'
                      )}
                      style={{
                        backgroundColor: validate_pathname(pathname, [
                          'Nivel de Estudio',
                          'Estados del Empleado',
                          'Tipo de Contratacion',
                        ])
                          ? hexToRgba(theme.colors[context].menu.textColor, 0.3)
                          : theme.colors[context].menu.background,
                        color: theme.colors[context].menu.textColor,
                      }}
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
                    </button>
                    <motion.div
                      animate={{
                        opacity: open ? 1 : 0,
                        height: open ? 'auto' : 0,
                      }}
                      className="overflow-hidden transform translate"
                      initial={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
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
                activeCondition={
                  validate_pathname(pathname, [
                    '/anexos-iva-compras',
                    '/anexos-fe',
                    '/anexos-ccfe',
                  ]) && openGroup === 'anexos'
                }
                isOpen={openGroup === 'anexos'}
                onGroupClick={() => handleGroupClick('anexos')}
              >
                {(handleClick, open) => (
                  <>
                    <button
                      className={classNames(
                        'group relative w-full flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700'
                      )}
                      style={{
                        backgroundColor: validate_pathname(pathname, [
                          '/anexos-iva-compras',
                          '/anexos-fe',
                          '/anexos-ccfe',
                        ])
                          ? hexToRgba(theme.colors[context].menu.textColor, 0.3)
                          : theme.colors[context].menu.background,
                        color: theme.colors[context].menu.textColor,
                      }}
                      onClick={handleClick}
                    >
                      <div className="flex items-center gap-2.5">
                        <FolderCheck size={iconSize} />
                        Anexos
                      </div>
                      <ChevronDown
                        className={classNames(open && ' rotate-180', 'items-end justify-end ')}
                        size={iconSize}
                      />
                    </button>
                    <motion.div
                      animate={{
                        opacity: open ? 1 : 0,
                        height: open ? 'auto' : 0,
                      }}
                      className="overflow-hidden transform translate"
                      initial={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SidebarLinkList links={annexesLinks} />
                    </motion.div>
                  </>
                )}
              </SidebarLinkGroup>
            </ul>
          </>
          <>
            <ul className="flex flex-col gap-1.5">
              <SidebarLinkGroup
                activeCondition={
                  validate_pathname(pathname, [
                    '/iva/shopping-book',
                    '/iva/ccf-book',
                    '/iva/fe-book',
                  ]) && openGroup === 'books'
                }
                isOpen={openGroup === 'books'}
                onGroupClick={() => handleGroupClick('books')}
              >
                {(handleClick, open) => (
                  <>
                    <button
                      className={classNames(
                        'group relative w-full cursor-pointer flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700'
                      )}
                      style={{
                        backgroundColor: validate_pathname(pathname, [
                          '/iva/shopping-book',
                          '/iva/ccf-book',
                          '/iva/fe-book',
                        ])
                          ? hexToRgba(theme.colors[context].menu.textColor, 0.3)
                          : theme.colors[context].menu.background,
                        color: theme.colors[context].menu.textColor,
                      }}
                      onClick={handleClick}
                    >
                      <div className="flex items-center gap-2.5">
                        <Book size={iconSize} />
                        Libros de IVA
                      </div>
                      <ChevronDown
                        className={classNames(open && ' rotate-180', 'items-end justify-end ')}
                        size={iconSize}
                      />
                    </button>
                    <motion.div
                      animate={{
                        opacity: open ? 1 : 0,
                        height: open ? 'auto' : 0,
                      }}
                      className="overflow-hidden transform translate"
                      initial={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <SidebarLinkList links={booksLinks} />
                    </motion.div>
                  </>
                )}
              </SidebarLinkGroup>
            </ul>
          </>
          <>
            <ul className="flex flex-col gap-1.5">
              <SidebarLinkGroup
                activeCondition={
                  validate_pathname(pathname, [
                    'cash-cuts-big-z',
                    'cash-cuts-x',
                    'cash-cuts-z',
                    'correlative',
                    'accountCatalogs',
                    'type-accounting',
                    'accounting-items',
                    'report-accounting',
                  ]) && openGroup === 'contabilidad'
                }
                isOpen={openGroup === 'contabilidad'}
                onGroupClick={() => handleGroupClick('contabilidad')}
              >
                {(handleClick, open) => (
                  <>
                    <button
                      className={classNames(
                        'group relative w-full cursor-pointer flex justify-between items-center gap-2.5 rounded-sm px-4 py-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-gray-50 dark:hover:bg-gray-700'
                      )}
                      style={{
                        backgroundColor: validate_pathname(pathname, [
                          'cash-cuts-big-z',
                          'cash-cuts-x',
                          'cash-cuts-z',
                          'correlative',
                          'accountCatalogs',
                          'type-accounting',
                          'accounting-items',
                          'report-accounting',
                        ])
                          ? hexToRgba(theme.colors[context].menu.textColor, 0.3)
                          : theme.colors[context].menu.background,
                        color: theme.colors[context].menu.textColor,
                      }}
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
                    </button>
                    <motion.div
                      animate={{
                        opacity: open ? 1 : 0,
                        height: open ? 'auto' : 0,
                      }}
                      className="overflow-hidden transform translate"
                      initial={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
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
        className={' flex w-full py-4 pl-5 cursor-pointer :-coffee-green hover:font-semibold'}
        style={{
          backgroundColor: theme.colors[context].menu.background,
          color: theme.colors[context].menu.textColor,
        }}
      >
        <Switch
          className="relative"
          isSelected={context === 'dark'}
          size={windowSize.width > 768 ? undefined : 'sm'}
          onValueChange={(isDark) => toggleContext(isDark ? 'dark' : 'light')}
        >
          <p
            className="relative text-sm lg:text-base"
            style={{ color: theme.colors[context].menu.textColor }}
          >
            {context === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          </p>
        </Switch>
      </div>
    </>
  );
};
