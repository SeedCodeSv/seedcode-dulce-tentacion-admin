import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import ProductsCategories from '../pages/ProductsCategories';
import Users from '../pages/Users';
import Employees from '../pages/Employees';
import Customers from '../pages/Customers';
import Branch from '../pages/Branch';
import Error404 from '../pages/Error404';
import Product from '../pages/Product';
import ExpensesCategories from '../pages/ExpensesCategories';
import Expenses from '../pages/Expenses';
import ActionRol from '../pages/ActionRol';
import Charges from '../pages/Charges';
import SubCategories from '../pages/SubCategories';
import NewSales from '../pages/NewSales';
import Configuration from '../pages/Configuration';
import SalesReportContigencePage from '../pages/SalesReportContigencePage';
import { useActionsRolStore } from '../store/actions_rol.store';
import { useEffect, useState } from 'react';
import Views from '../pages/Views';
import { useAuthStore } from '../store/auth.store';
import HomeSeller from '../pages/Seller/HomeSeller';
import ExpenseByDatesTransmitter from '../pages/ExpenseByDatesTransmitter';
import Supplier from '../pages/Supplier';
import ReportByBranchSalesByBranch from '../pages/ReportByBranchSalesByBranch';
import ReportExpensesByBranchPage from '../pages/ReportExpenseByBranchPage';
import PurchaseOrders from '../pages/PurchaseOrders';
import MostProductTransmitterSelledPage from '../pages/MostProductTransmitterSelledPage';
import Discount from '../pages/Promotions';
import AddPromotions from '../components/discounts/AddPromotions';
import StatusEmployee from '../pages/statusEmployee';
import ContratType from '../pages/ContratType';
import AddEmployee from '../components/employee/AddEmployee';
import VentasPorPeriodo from '../pages/reports/VentasPorPeriodo';
import StudyLevel from '@/pages/StudyLevel';
import AddActionRol from '@/components/Action_rol/AddActionRol';
import AddProduct from '@/pages/AddProduct';
import VentasPorProducto from '@/pages/reports/VentasPorProducto';
import NoAuthorization from '../pages/NoAuthorization';
import { JSX } from 'react/jsx-runtime';
import CushCatsBigZ from '@/pages/CashCutsBigZ';
import CashCutsX from '@/pages/CashCutsX';
import CushCatsZ from '@/pages/CashCutsZ';
import ShoppingBookIVA from '@/pages/iva/ShoppingBookIVA';
import Shopping from '@/pages/Shopping';
import CreateShopping from '@/components/shopping/CreateShoppingJson';

const Loading = () => {
  return <div>Cargando...</div>;
};

/* eslint-disable react-hooks/rules-of-hooks */
export const router = () => {
  const { role_view_action, OnGetActionsByRole } = useActionsRolStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      OnGetActionsByRole(user.roleId).then(() => setLoading(false));
    }
  }, [user]);

  /* eslint-enable react-hooks/rules-of-hooks */
  const views =
    role_view_action && role_view_action.view && role_view_action.view.map((view) => view.name);

  const checkAuthorization = (viewName: string, Component: JSX.Element) => {
    if (loading) {
      return <Loading />;
    }
    return views && views.includes(viewName) ? Component : <NoAuthorization />;
  };

  return createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/configuration',
      element: <Configuration />,
    },
    {
      path: '/actionRol',
      element: <ActionRol />,
    },
    {
      path: '/homeSeller',
      element: checkAuthorization('Inicio de ventas', <HomeSeller />),
    },
    {
      path: '/categories',
      element: checkAuthorization('Categorias', <ProductsCategories />),
    },
    {
      path: '/shopping',
      element: checkAuthorization('Compras', <Shopping />),
    },
    {
      path: '/CreateShopping',
      element: checkAuthorization('Compras', <CreateShopping />),
    },
    {
      path: '/subCategories',
      element: checkAuthorization('Sub Categorias', <SubCategories />),
    },
    {
      path: '/users',
      element: checkAuthorization('Usuarios', <Users />),
    },
    {
      path: '/employees',
      element: checkAuthorization('Empleados', <Employees />),
    },
    {
      path: '/charges',
      element: checkAuthorization('Cargos de Empleados', <Charges />),
    },
    {
      path: '/clients',
      element: checkAuthorization('Clientes', <Customers />),
    },
    {
      path: '/branches',
      element: checkAuthorization('Sucursales', <Branch />),
    },
    {
      path: '/products',
      element: checkAuthorization('Productos', <Product />),
    },
    {
      path: '/add-product',
      element: checkAuthorization('Productos', <AddProduct />),
    },
    {
      path: '/expensesCategories',
      element: checkAuthorization('Categorias de Gastos', <ExpensesCategories />),
    },
    {
      path: '/expenses',
      element: checkAuthorization('Gastos', <Expenses />),
    },
    {
      path: '/modules',
      element: checkAuthorization('Modulos', <Views />),
    },
    {
      path: '/newSales',
      element: checkAuthorization('Ventas', <NewSales />),
    },
    {
      path: '/most-product-transmitter-selled',
      element: checkAuthorization('Reportes', <MostProductTransmitterSelledPage />),
    },
    {
      path: '/expenses-by-dates-transmitter',
      element: checkAuthorization('Reportes', <ExpenseByDatesTransmitter />),
    },
    {
      path: '/sales-by-branch',
      element: checkAuthorization('Reportes', <ReportByBranchSalesByBranch />),
    },
    {
      path: '/expenses-by-branch',
      element: checkAuthorization('Reportes', <ReportExpensesByBranchPage />),
    },
    {
      path: '/sales-reports',
      element: checkAuthorization('Reporte de ventas', <SalesReportContigencePage />),
    },
    {
      path: '/suppliers',
      element: checkAuthorization('Proveedores', <Supplier />),
    },
    {
      path: '/purchase-orders',
      element: checkAuthorization('Ordenes de Compra', <PurchaseOrders />),
    },
    {
      path: '/discounts',
      element: checkAuthorization('Descuentos', <Discount />),
    },
    {
      path: '/statusEmployee',
      element: checkAuthorization('Estados del Empleado', <StatusEmployee />),
    },
    {
      path: '/contractTypes',
      element: checkAuthorization('Tipo de Contratacion', <ContratType />),
    },
    {
      path: '/studyLevel',
      element: checkAuthorization('Nivel de Estudio', <StudyLevel />),
    },
    {
      path: '/AddPromotions',
      element: checkAuthorization('Descuentos', <AddPromotions />),
    },
    {
      path: '/AddEmployee',
      element: checkAuthorization('Empleados', <AddEmployee />),
    },
    {
      path: '/AddActionRol',
      element: <AddActionRol />,
    },
    {
      path: '/reports/sales-by-period',
      element: checkAuthorization('Ventas por Periodo', <VentasPorPeriodo />),
    },
    {
      path: '/reports/sales-by-product',
      element: checkAuthorization('Ventas por Productos', <VentasPorProducto />),
    },
    {
      path: '/cash-cuts-big-z',
      element: checkAuthorization('Contabilidad', <CushCatsBigZ />),
    },
    {
      path: '/cash-cuts-x',
      element: checkAuthorization('Contabilidad', <CashCutsX />),
    },
    {
      path: '/cash-cuts-z',
      element: checkAuthorization('Contabilidad', <CushCatsZ />),
    },
    {
      path: "iva/shopping-book",
      element: <ShoppingBookIVA />,
    },
    {
      path: '*',
      element: <Error404 />,
    },
  ]);
};
