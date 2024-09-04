import { motion } from 'framer-motion';

interface Props {
  show: boolean;
}

function GlobalLoading({ show }: Props) {
  return (
    <>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center items-center flex-col"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 200000,
          }}
        >
          <div className="loader"></div>
          <p className="text-xl mt-5 text-white">Cargando...</p>
        </motion.div>
      )}
    </>
  );
}

export default GlobalLoading;
