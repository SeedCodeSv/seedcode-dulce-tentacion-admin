import { createBrowserRouter } from "react-router-dom";
import Error404 from "../pages/Error404";
import NewSales from "../pages/NewSales";
import SalesReportContigencePage from "../pages/SalesReportContigencePage";
import Expenses from "../pages/Expenses";
import HomeSeller from "../pages/Seller/HomeSeller";
import Customers from "../pages/Customers";
import Configuration from "../pages/Configuration";
import Test from "../pages/Test";
import NotaCredito from "../pages/NotaCredito";

export const router_seller = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <HomeSeller />,
    },
    {
      path: "/expenses",
      element: <Expenses />,
    },
    {
      path: "/newSales",
      element: <NewSales />,
    },
    {
      path: "/clients",
      element: <Customers />,
    },
    {
      path: "sales-reports",
      element: <SalesReportContigencePage />,
    },
    {
      path: "/configuration",
      element: <Configuration />,
    },
    {
      path: "/credit-note/:id",
      element: <NotaCredito />,
    },
    {
      path: "/test",
      element: <Test />,
    },
    {
      path: "*",
      element: <Error404 />,
    },
    {
      path: "/homeSeller",
      element: <HomeSeller />,
    },
  ]);
};
