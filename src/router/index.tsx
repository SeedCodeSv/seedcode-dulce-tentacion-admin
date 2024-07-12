import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import Tables from '../pages/Tables';
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
import { useEffect } from 'react';
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

/* eslint-disable react-hooks/rules-of-hooks */
export const router = () => {
  const { role_view_action, OnGetActionsByRole } = useActionsRolStore();
  const { user } = useAuthStore();
  useEffect(() => {
    if (user) {
      OnGetActionsByRole(user.roleId);
    }
  }, [user]);
  /* eslint-enable react-hooks/rules-of-hooks */
  const views =
    role_view_action && role_view_action.view && role_view_action.view.map((view) => view.name);
  return createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/homeSeller',
      element: views && views.includes('Inicio de ventas') && <HomeSeller />,
    },
    {
      path: '/tables',
      element: <Tables />,
    },
    {
      path: '/categories',
      element: views && views.includes('Categorias') && <ProductsCategories />,
    },
    {
      path: '/subCategories',
      element: views && views.includes('Categorias') && <SubCategories />,
    },
    {
      path: '/users',
      element: views && views.includes('Usuarios') && <Users />,
    },
    {
      path: '/employees',
      element: views && views.includes('Empleados') && <Employees />,
    },
    {
      path: '/charges',
      element: views && views.includes('Empleados') && <Charges />,
    },
    {
      path: '/clients',
      element: views && views.includes('Clientes') && <Customers />,
    },
    {
      path: '/branches',
      element: views && views.includes('Sucursales') && <Branch />,
    },
    {
      path: '/products',
      element: views && views.includes('Productos') && <Product />,
    },
    {
      path: '/add-product',
      element: views && views.includes('Productos') && <AddProduct />,
    },
    {
      path: '/expensesCategories',
      element: views && views.includes('Categoria de gastos') && <ExpensesCategories />,
    },
    {
      path: '/expenses',
      element: views && views.includes('Gastos') && <Expenses />,
    },
    {
      path: '/actionRol',
      element: <ActionRol />,
    },
    {
      path: '/modules',
      element: views && views.includes('Modulos') && <Views />,
    },
    {
      path: '/newSales',
      element: views && views.includes('Ventas') && <NewSales />,
    },
    // {
    //   path: '/reporters',
    //   element: views && views.includes('Reportes') && <Reporters />,
    // },
    {
      path: '/most-product-transmitter-selled',
      element: views && views.includes('Reportes') && <MostProductTransmitterSelledPage />,
    },
    {
      path: '/expenses-by-dates-transmitter',
      element: views && views.includes('Reportes') && <ExpenseByDatesTransmitter />,
    },
    {
      path: '/sales-by-branch',
      element: views && views.includes('Reportes') && <ReportByBranchSalesByBranch />,
    },
    {
      path: '/expenses-by-branch',
      element: views && views.includes('Reportes') && <ReportExpensesByBranchPage />,
    },
    {
      path: '/configuration',
      element: <Configuration />,
    },
    {
      path: 'sales-reports',
      element: views && views.includes('Reporte de ventas') && <SalesReportContigencePage />,
    },
    {
      path: '/suppliers',
      element: views && views.includes('Proveedores') && <Supplier />,
    },
    {
      path: '/purchase-orders',
      element: views && views.includes('Ordenes de compra') && <PurchaseOrders />,
    },
    {
      path: '/discounts',
      element: views && views.includes('Descuentos') && <Discount />,
    },
    {
      path: '/statusEmployee',
      element: views && views.includes('Estado del empleado') && <StatusEmployee />,
    },
    {
      path: '/contractTypes',
      element: views && views.includes('Tipo de contratacion') && <ContratType />,
    },
    {
      path: '/studyLevel',
      element: views && views.includes('Nivel de estudio') && <StudyLevel />,
    },
    {
      path: '/AddPromotions',
      element:  <AddPromotions />,
    },
    {
      path: '/AddEmployee',
      element: views && views.includes('Empleados') && <AddEmployee />,
    },
    // {
    //   path: '/UpdateEmployee/:id',
    //   element: <UpdateEmployee />,
    // },
    {
      path: '/AddActionRol',
      element: <AddActionRol />,
    },
    {
      path: '/reports/sales-by-period',
      element: <VentasPorPeriodo />,
    },
    {
      path: '*',
      element: <Error404 />,
    },
  ]);
};
