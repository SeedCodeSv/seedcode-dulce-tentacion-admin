import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useContext } from 'react';

import { ThemeContext } from '@/hooks/useTheme';

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
            animate={{ opacity: 0.5 }}
            className="fixed inset-0 bg-black z-[60]"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={props.onClose}
          />
          <motion.div
            animate={{ y: props.open ? 0 : '100%' }}
            className={classNames(
              context,
              'fixed bottom-0 dark:bg-gray-800 left-1 z-[60] right-1 p-5 bg-white shadow-xl rounded-t-2xl border dark:border-white'
            )}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            exit={{ y: '100%' }}
            initial={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100) props.onClose();
            }}
          >
            <div className="flex items-center justify-center w-full">
              <span className="w-16 h-2 bg-gray-300 border rounded dark:bg-gray-400" />
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
