import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Tables from "../pages/Tables";
import ProductsCategories from "../pages/ProductsCategories";
import Users from "../pages/Users";
import Employees from "../pages/Employees";
import Customers from "../pages/Customers";
import Branch from "../pages/Branch";
import Error404 from "../pages/Error404";
import Product from "../pages/Product";
import ExpensesCategories from "../pages/ExpensesCategories";
import Expenses from "../pages/Expenses";
import ActionRol from "../pages/ActionRol"
import NewSales from "../pages/NewSales"
import Configuration from "../pages/Configuration";
export const router = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/tables",
      element: <Tables />,
    },
    {
      path: "/categories",
      element: <ProductsCategories />,
    },
    {
      path: "/users",
      element: <Users />,
    },
    {
      path: "/employees",
      element: <Employees />,
    },
    {
      path: "/clients",
      element: <Customers />,
    },
    {
      path: "/branches",
      element: <Branch />,
    },
    {
      path: "/products",
      element: <Product />,
    },
    {
      path: "/expensesCategories",
      element: <ExpensesCategories />,
    },
    {
      path: "/expenses",
      element: <Expenses/>
    },
    {
      path: "/actionRol",
      element: <ActionRol/>
    },
    {
      path: "/newSales",
      element: <NewSales/>
    },
    {
      path: "/configuration",
      element: <Configuration/>
    },
    {
      path: "*",
      element: <Error404 />,
    },
  ]);
};
