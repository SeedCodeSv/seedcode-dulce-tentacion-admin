import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Tables from "../pages/Tables";

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
  ]);
};
