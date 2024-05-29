import { useContext, useMemo } from "react";
import { ActionsContext } from "../../hooks/useActions";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../hooks/useTheme";
import useWindowSize from "../../hooks/useWindowSize";
import { BookUser, Box, Home, SquareMenu } from "lucide-react";

function SalesMode() {
  const { roleActions } = useContext(ActionsContext);
  const { theme } = useContext(ThemeContext);

  const views = useMemo(() => {
    return roleActions?.view.map((vw) => vw.name);
  }, [roleActions]);

  const { windowSize } = useWindowSize();
  const iconSize = useMemo(() => {
    if (windowSize.width < 768) {
      return 14;
    } else if (windowSize.width < 1024) {
      return 16;
    } else if (windowSize.width < 1280) {
      return 18;
    } else if (windowSize.width < 1536) {
      return 20;
    } else {
      return 22;
    }
  }, [windowSize.width]);

  return (
    <>
      {views ? (
        <>
          <NavLink
            to={"/"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <Home size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Inicio</p>
          </NavLink>

          <NavLink
            to={"/newSales"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <Box size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Nueva venta</p>
          </NavLink>
          <NavLink
            to={"/clients"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <BookUser size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Clientes</p>
          </NavLink>
          <NavLink
            to={"/expenses"}
            className={({ isActive }) => {
              return (
                (isActive
                  ? "text-coffee-green font-semibold bg-gray-50 dark:bg-gray-700 border-coffee-green"
                  : "text-coffee-brown font-semibold border-white") +
                " flex items-center w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-coffee-green"
              );
            }}
            style={({ isActive }) => {
              return {
                borderLeftColor: isActive ? theme.colors.dark : "transparent",
                borderLeftWidth: 5,
              };
            }}
          >
            <SquareMenu size={iconSize} />
            <p className="ml-2 text-sm 2xl:text-base">Gastos</p>
          </NavLink>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default SalesMode;
