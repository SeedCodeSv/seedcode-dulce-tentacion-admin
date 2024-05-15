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
import { useActionsRolStore } from "../store/actions_rol.store";
import { useEffect, useState } from "react";
export const router = () => {
  const { role_view_action, OnGetActionsByRole } = useActionsRolStore();
  const [userRoleId, setUserRoleId] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
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

  const views =
    role_view_action &&
    role_view_action.view &&
    role_view_action.view.map((view) => view.name);

  return createBrowserRouter([
    {
      path: "/",
      element: views && views.includes("Inicio") &&  <Home /> 
    },
    {
      path: "/tables",
      element: <Tables />,
    },
    {
      path: "/categories",
      element: views && views.includes("Categoria") && <ProductsCategories />,
    },
    {
      path: "/users",
      element: views && views.includes("Usuario") && <Users /> 
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
      path: "*",
      element: <Error404 />,
    },
  ]);
};
