import { motion } from 'framer-motion';
import { useLocation } from 'react-router';
import type { ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}
