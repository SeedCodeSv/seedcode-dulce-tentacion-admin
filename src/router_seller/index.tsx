import { createBrowserRouter } from 'react-router-dom';
import Error404 from '../pages/Error404';
import NewSales from '../pages/NewSales';
import SalesReportContigencePage from '../pages/SalesReportContigencePage';
import Expenses from '../pages/Expenses';
import { useContext, useMemo } from 'react';
import HomeSeller from '../pages/Seller/HomeSeller';
import Customers from '../pages/Customers';
import { ActionsContext } from '../hooks/useActions';

export const router_seller = () => {
  /* eslint-disable react-hooks/rules-of-hooks */
  const { roleActions } = useContext(ActionsContext);

  const views = useMemo(() => {
    if (roleActions) {
      return roleActions.view.map((view) => view.name);
    }
    return [];
  }, [roleActions]);
  /* eslint-enable react-hooks/rules-of-hooks */

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
    {
      path: '/homeSeller',
      element: <HomeSeller />,
    },
  ]);
};
