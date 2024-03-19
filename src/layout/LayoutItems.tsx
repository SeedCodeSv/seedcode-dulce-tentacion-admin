import { Image } from "@nextui-org/react";
import { NavLink } from "react-router-dom";
import LOGO from "../assets/react.svg";
import {
  Coffee,
  Home,
  Box,
  Store,
  User,
  BookUser,
  Users,
  Book,
} from "lucide-react";
import { useContext } from "react";
import { ThemeContext } from "../hooks/useTheme";

export const LayoutItems = () => {
  const { theme } = useContext(ThemeContext);
  return (
    <>
      <div
        className="flex items-center justify-center w-full border-b shadow h-14"
        style={{
          backgroundColor: theme.colors.dark,
          color: theme.colors.primary,
        }}
      >
        <Image src={LOGO} className="w-[50px]" />
        <p className="font-sans text-sm ml-3 font-bold text-coffee-brown">
          COFFEE PLACE
        </p>
      </div>
      <NavLink
        to={"/"}
        className={
          " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 hover:border-coffee-green"
        }
        style={({ isActive }) => {
          return {
            backgroundColor: isActive ? "#dedede" : "transparent",
            borderLeftColor: isActive ? theme.colors.dark : "transparent",
            borderLeftWidth: 5,
          };
        }}
      >
        <Home size={20} />
        <p className="ml-2 text-base">Inicio</p>
      </NavLink>
      <NavLink
        to={"/products"}
        className={({ isActive }) => {
          return (
            (isActive
              ? "text-coffee-green font-semibold bg-gray-50 border-coffee-green"
              : "text-coffee-brown font-semibold border-white") +
            " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 hover:border-coffee-green"
          );
        }}
      >
        <Coffee size={20} />
        <p className="ml-2 text-base">Productos</p>
      </NavLink>
      <NavLink
        to={"/categories"}
        className={
            " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 hover:border-coffee-green"
          }
          style={({ isActive }) => {
            return {
              backgroundColor: isActive ? "#dedede" : "transparent",
              borderLeftColor: isActive ? theme.colors.dark : "transparent",
              borderLeftWidth: 5,
            };
          }}
      >
        <Box size={20} />
        <p className="ml-2 text-base">Categorías</p>
      </NavLink>
      <NavLink
        to={"/branches"}
        className={({ isActive }) => {
          return (
            (isActive
              ? "text-coffee-green font-semibold bg-gray-50 border-coffee-green"
              : "text-coffee-brown font-semibold border-white") +
            " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 hover:border-coffee-green"
          );
        }}
      >
        <Store size={20} />
        <p className="ml-2 text-base">Sucursales</p>
      </NavLink>
      <NavLink
        to={"/users"}
        className={({ isActive }) => {
          return (
            (isActive
              ? "text-coffee-green font-semibold bg-gray-50 border-coffee-green"
              : "text-coffee-brown font-semibold border-white") +
            " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 hover:border-coffee-green"
          );
        }}
      >
        <User size={20} />
        <p className="ml-2 text-base">Usuarios</p>
      </NavLink>
      <NavLink
        to={"/employees"}
        className={({ isActive }) => {
          return (
            (isActive
              ? "text-coffee-green font-semibold bg-gray-50 border-coffee-green"
              : "text-coffee-brown font-semibold border-white") +
            " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 hover:border-coffee-green"
          );
        }}
      >
        <Users size={20} />
        <p className="ml-2 text-base">Empleados</p>
      </NavLink>
      <NavLink
        to={"/clients"}
        className={({ isActive }) => {
          return (
            (isActive
              ? "text-coffee-green font-semibold bg-gray-50 border-coffee-green"
              : "text-coffee-brown font-semibold border-white") +
            " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 hover:border-coffee-green"
          );
        }}
      >
        <BookUser size={20} />
        <p className="ml-2 text-base">Clientes</p>
      </NavLink>
      <NavLink
        to={"/reports"}
        className={({ isActive }) => {
          return (
            (isActive
              ? "text-coffee-green font-semibold bg-gray-50 border-coffee-green"
              : "text-coffee-brown font-semibold border-white") +
            " flex w-full py-4 pl-5 border-l-4 cursor-pointer hover:text-coffee-green hover:font-semibold hover:bg-gray-50 hover:border-coffee-green"
          );
        }}
      >
        <Book size={20} />
        <p className="ml-2 text-base">Reportes</p>
      </NavLink>
    </>
  );
};
