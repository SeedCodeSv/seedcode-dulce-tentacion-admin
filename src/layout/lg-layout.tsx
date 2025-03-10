import { Dispatch, SetStateAction, useContext } from 'react';
import { motion } from 'framer-motion';
import { ThemeContext } from '@/hooks/useTheme';

interface Props {
  items: () => JSX.Element;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export const LgLayout = ({ items, isOpen = true }: Props) => {
  const initialStyles = isOpen
    ? { width: '280px', opacity: 1 }
    : { width: '0px', opacity: 0 };

    const { theme,context } = useContext(ThemeContext);

  return (
    <motion.div
      initial={initialStyles}
      animate={
        isOpen
          ? { width: '280px', opacity: 1 }
          : { width: '0px', opacity: 0 }
      }
      transition={{ duration: isOpen ? 0 : 0.3 }}
      style={{
        backgroundColor: theme.colors[context].menu.background,
        color: theme.colors[context].menu.textColor,
      }}
      className="fixed z-50 h-screen overflow-y-auto shadow-2xl"
    >
      {items()}
    </motion.div>
  );
};
