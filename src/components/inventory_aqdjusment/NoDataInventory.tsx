import { motion } from 'framer-motion';

function NoDataInventory({ title }: { title?: string }) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center min-h-[calc(100vh-450px)] text-card-foreground "
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
          }}
          className="relative w-32 h-32 mb-"
          transition={{
            duration: 4,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            className="absolute inset-0 rounded-full bg-primary/20"
            transition={{
              duration: 4,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
          />

          <svg
            className="absolute inset-0 w-full h-full text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <motion.path
              animate={{ pathLength: 1 }}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              initial={{ pathLength: 0 }}
              strokeLinecap="round"
              strokeLinejoin="round"
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          </svg>
          <motion.svg
            animate={{
              rotate: [0, 15, 0, -15, 0],
            }}
            className="absolute -bottom-2 -right-2 w-10 h-10 text-secondary"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            transition={{
              duration: 5,
              ease: 'easeInOut',
              repeat: Infinity,
            }}
            viewBox="0 0 24 24"
          >
            <path
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>

        <motion.h2
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-semibold mb-2 text-foreground"
          initial={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {title === undefined ? 'No se encontraron productos seleccionados' : title}
        </motion.h2>
      </div>
    </motion.div>
  );
}

export default NoDataInventory;
