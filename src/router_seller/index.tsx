import { createBrowserRouter } from 'react-router-dom';
import Error404 from '../pages/Error404';
import NewSales from '../pages/NewSales';
import SalesReportContigencePage from '../pages/SalesReportContigencePage';
import Expenses from '../pages/Expenses';
import { useEffect, useState } from 'react';
import { useActionsRolStore } from '../store/actions_rol.store';
import HomeSeller from '../pages/Seller/HomeSeller';
import Customers from '../pages/Customers';

/* eslint-disable react-hooks/rules-of-hooks */
export const router_seller = () => {
  const { role_view_action, OnGetActionsByRole } = useActionsRolStore();
  const [userRoleId, setUserRoleId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user && user.roleId) {
        setUserRoleId(user.roleId);
      }
    }
  }, []);

  useEffect(() => {
    if (userRoleId) {
      OnGetActionsByRole(userRoleId);
    }
  }, [OnGetActionsByRole, userRoleId]);
  /* eslint-enable react-hooks/rules-of-hooks */

  const views =
    role_view_action && role_view_action.view && role_view_action.view.map((view) => view.name);
  return createBrowserRouter([
    {
      path: '/',
      element: <HomeSeller />,
    },
    {
      path: '/expenses',
      element: views && views.includes('Gastos') && <Expenses />,
    },
    {
      path: '/newSales',
      element: views && views.includes('Ventas') && <NewSales />,
    },
    {
      path: '/clients',
      element: views && views.includes('Clientes') && <Customers />,
    },
    {
      path: 'sales-reports',
      element: views && views.includes('Reporte de ventas') && <SalesReportContigencePage />,
    },
    {
      path: '*',
      element: <Error404 />,
    },
  ]);
};
