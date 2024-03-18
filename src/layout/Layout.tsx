import React, { Dispatch, SetStateAction, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ThemeContext } from "../hooks/useTheme";
import NavBar from "./NavBar";

interface Props {
  children: JSX.Element;
}

function Layout(props: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const { theme } = useContext(ThemeContext);

  return (
    <div className="flex flex-col w-screen h-screen">
      <NavBar />
      <div className="w-full h-full overflow-y-auto bg-gray-50">
        {props.children}
      </div>
    </div>
  );
}

export default Layout;
