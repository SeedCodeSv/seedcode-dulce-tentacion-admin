import { AnimatePresence, motion } from 'framer-motion';
import { ReactNode, Suspense } from 'react';
import { useLocation } from 'react-router';

const AnimatedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        initial={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2, ease: 'easeIn' }}
      >
        <Suspense
          fallback={
            <div className="w-screen h-screen bg-white dark:bg-gray-800 flex flex-col justify-center items-center dark:text-white">
              <p>Preparando</p>
            </div>
          }
        >
          {children}
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

export default AnimatedRoute;
