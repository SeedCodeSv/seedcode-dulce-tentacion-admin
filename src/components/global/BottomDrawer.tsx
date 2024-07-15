import { ThemeContext } from "@/hooks/useTheme";
import classNames from "classnames";
import { AnimatePresence, motion } from "framer-motion";
import { useContext } from "react";

interface BottomDrawerProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
}

export default function BottomDrawer(props: BottomDrawerProps) {
  const { context } = useContext(ThemeContext);
  return (
    <AnimatePresence>
      {props.open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-[60]"
            onClick={props.onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: props.open ? 0 : "100%" }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) props.onClose();
            }}
            className={classNames(
              context ,
              "fixed bottom-0 dark:bg-gray-800 left-0 z-[60] right-0 p-4 bg-white shadow-xl rounded-t-2xl"
            )} //"fixed bottom-0 left-0 z-[60] right-0 p-4 bg-white shadow-xl rounded-t-2xl"}
          >
            <div className="flex items-center justify-center w-full">
              <span className="w-16 h-2 bg-gray-300 border rounded dark:bg-gray-400"></span>
            </div>
            <div className="w-full py-3">
              <p className="text-lg font-semibold text-center dark:text-white">{props.title}</p>
            </div>
            {props.children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
