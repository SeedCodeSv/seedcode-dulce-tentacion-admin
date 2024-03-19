import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContext } from "../hooks/useTheme";
import NavBar from "./NavBar";
import { SideBar } from "./SideBar";

interface Props {
  children: JSX.Element;
  title: string;
}

function Layout(props: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const { theme, navbar } = useContext(ThemeContext);

  return (
    <>
      {navbar === "topbar" && (
        <>
          <div className="flex flex-col w-screen h-screen">
            <NavBar />
            <div className="w-full h-full overflow-y-auto bg-gray-50">
              {props.children}
            </div>
          </div>
        </>
      )}
      {navbar === "sidebar" && (
        <>
          <SideBar title={props.title}>{props.children}</SideBar>
        </>
      )}
    </>
  );
}

export default Layout;
