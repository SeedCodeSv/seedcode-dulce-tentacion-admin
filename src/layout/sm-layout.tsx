import { ThemeContext } from '@/hooks/useTheme';
import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction, useContext } from 'react';

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  items: () => JSX.Element;
}

export const SmLayout = ({ isOpen, setIsOpen, items }: Props) => {
  
  const {theme,context } = useContext(ThemeContext)
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: theme.colors[context].menu.background,
              color: theme.colors[context].menu.textColor
            }}
            className="fixed z-50 w-80 h-screen shadow-2xl"
          >
            {items()}
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black z-40"
          onClick={() => setIsOpen(false)}
        ></motion.div>
      )}
    </>
  );
};
