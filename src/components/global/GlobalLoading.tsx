import { motion } from 'framer-motion';

interface Props {
  show: boolean;
}

function GlobalLoading({ show }: Props) {
  return (
    <>
      {show && (
        <motion.div
          animate={{ opacity: 1 }}
          className="flex justify-center items-center flex-col"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            zIndex: 200000,
          }}
          transition={{ duration: 0.5 }}
        >
          <div className="loader" />
          <p className="text-xl mt-5 text-white">Cargando...</p>
        </motion.div>
      )}
    </>
  );
}

export default GlobalLoading;
