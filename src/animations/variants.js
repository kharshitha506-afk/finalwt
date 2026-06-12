// Shared Framer Motion variants — import these instead of redefining
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
}

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
}

export const slideLeft = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 24 },
}

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } },
}

export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -3, transition: { duration: 0.2 } },
}

export const glowPulse = {
  animate: {
    opacity: [0.4, 0.9, 0.4],
    scale: [1, 1.05, 1],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
  },
}

export const orbitSpin = {
  animate: {
    rotate: 360,
    transition: { duration: 8, repeat: Infinity, ease: 'linear' },
  },
}

export const transition = {
  fast: { duration: 0.2 },
  normal: { duration: 0.35, ease: 'easeOut' },
  slow: { duration: 0.6, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 300, damping: 24 },
}
