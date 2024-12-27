import { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';

interface Props {
  items: () => JSX.Element;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LgLayout = ({ items, isOpen = true }: Props) => {
  const initialStyles = isOpen
    ? { width: '280px', opacity: 1 }
    : { width: '0px', opacity: 0 };

  return (
    <motion.div
      initial={initialStyles}
      animate={
        isOpen
          ? { width: '280px', opacity: 1 }
          : { width: '0px', opacity: 0 }
      }
      transition={{ duration: isOpen ? 0 : 0.3 }}
      className="fixed z-50 h-screen overflow-y-auto bg-white dark:bg-gray-900 dark:text-white shadow-2xl"
    >
      {items()}
    </motion.div>
  );
};
