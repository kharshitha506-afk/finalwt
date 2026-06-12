import { motion } from 'framer-motion'
import Sidebar from '../components/Sidebar'
import ParticleBackground from '../components/ParticleBackground'

export default function SubjectLayout({ subject, children }) {
  return (
    <div className="flex min-h-screen bg-void overflow-hidden">
      <Sidebar subject={subject} />
      <div className="flex-1 ml-16 lg:ml-56 relative min-h-screen">
        {/* Ambient glow */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-15 z-0"
          style={{ background: subject.gradient }} />
        <div className="fixed bottom-0 left-16 lg:left-56 w-[300px] h-[300px] rounded-full blur-[80px] pointer-events-none opacity-8 z-0"
          style={{ background: subject.secondary }} />
        {/* Particles */}
        <div className="fixed inset-0 pointer-events-none z-0" style={{ left: '64px' }}>
          <ParticleBackground color={subject.primary} count={30} />
        </div>
        {/* Content */}
        <motion.main
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
