import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  delay?: number;
}

export default function GlassCard({ children, className = '', hover = false, onClick, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      onClick={onClick}
      className={`
        bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl
        ${hover ? 'cursor-pointer hover:bg-slate-800/60 hover:border-slate-600/50 transition-colors' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
