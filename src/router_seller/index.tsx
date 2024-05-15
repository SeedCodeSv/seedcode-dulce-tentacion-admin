import { createBrowserRouter } from "react-router-dom";
import Error404 from "../pages/Error404";
import NewSales from "../pages/NewSales";
import SalesReportContigencePage from "../pages/SalesReportContigencePage";
import Expenses from "../pages/Expenses";

export const router_seller = () => {
  return createBrowserRouter([
    {
      path: "/expenses",
      element: <Expenses />,
    },
    {
      path: "/newSales",
      element: <NewSales />,
    },
    {
      path: "sales-reports",
      element: <SalesReportContigencePage />,
    },
    {
      path: "*",
      element: <Error404 />,
    },
  ]);
};
