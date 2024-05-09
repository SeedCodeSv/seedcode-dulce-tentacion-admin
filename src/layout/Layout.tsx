import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContext } from "../hooks/useTheme";
import NavBar from "./NavBar";
import { SideBar } from "./SideBar";
import classNames from "classnames";

interface Props {
  children: JSX.Element;
  title: string;
}

function Layout(props: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const { context, navbar } = useContext(ThemeContext);

  return (
    <div className={classNames("w-full h-full", context === "dark" ? "dark" : "")}>
      {navbar === "topbar" && (
        <>
          <div className="flex flex-col w-screen h-screen">
            <NavBar />
            <div className="w-full h-full overflow-y-auto bg-gray-50 dark:bg-gray-800">
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
    </div>
  );
}

export default Layout;
