import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction, useContext, useEffect } from 'react';

import { ThemeContext } from '@/hooks/useTheme';
import { useLocation } from 'react-router';

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  items: () => JSX.Element;
}

export const SmLayout = ({ isOpen, setIsOpen, items }: Props) => {
  const { theme, context } = useContext(ThemeContext);

  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            animate={{ x: 0 }}
            className="fixed z-50 w-80 h-screen shadow-2xl"
            exit={{ x: -300 }}
            initial={{ x: -300 }}
            style={{
              backgroundColor: theme.colors[context].menu.background,
              color: theme.colors[context].menu.textColor,
            }}
            transition={{ duration: 0.2 }}
          >
            {items()}
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 0.5 }}
          className="fixed inset-0 bg-black z-40"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};
