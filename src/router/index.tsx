import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Tables from "../pages/Tables";
import ProductsCategories from "../pages/ProductsCategories";
import Users from "../pages/Users";
import Employees from "../pages/Employees";
import Customers from "../pages/Customers";
import Auth from "../pages/Auth";
import { useContext } from "react";
import { ThemeContext } from "../hooks/useSession";

export const router = () => {
  const { isAuth } = useContext(ThemeContext);

  return createBrowserRouter(
    isAuth
      ? [
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
        ]
      : [
          {
            path: "/",
            element: <Auth />,
          },
        ]
  );
};
