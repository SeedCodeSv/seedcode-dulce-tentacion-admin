import { Dispatch, SetStateAction } from 'react';
import { motion } from 'framer-motion';

interface Props {
  items: () => JSX.Element;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LgLayout = ({ items, isOpen }: Props) => {
  return (
    <motion.div
      initial={{ width: '0px', opacity: 0 }}
      animate={{ width: isOpen ? '280px' : '0px', opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed z-50 h-screen overflow-y-auto bg-white dark:bg-gray-900 dark:text-white shadow-2xl"
    >
      {items()}
    </motion.div>
  );
};
