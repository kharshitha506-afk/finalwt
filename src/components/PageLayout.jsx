import { motion } from 'framer-motion'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
}

export default function PageLayout({ children, className = '' }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className={`min-h-screen pt-20 pb-8 bg-void bg-grid ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </motion.div>
  )
}
