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
        rounded-xl transition-colors duration-200
        ${hover ? 'cursor-pointer' : ''}
        ${className}
      `}
      style={{
        backgroundColor: 'var(--theme-card)',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'var(--theme-card-border)',
        ...(hover ? {} : {}),
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.backgroundColor = 'var(--theme-card-hover)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.backgroundColor = 'var(--theme-card)';
      } : undefined}
    >
      {children}
    </motion.div>
  );
}
