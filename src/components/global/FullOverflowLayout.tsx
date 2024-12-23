import { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface Props {
  children: ReactNode
  show: boolean
}

function FullPageLayout({ children, show }: Props) {
  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div
            className="w-screen h-screen fixed top-0 left-0 z-[2000] bg-gradient-to-b from-gray-700/60 to-gray-950/40 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="w-screen h-screen fixed top-0 left-0 flex justify-center items-center z-[3001]"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default FullPageLayout
