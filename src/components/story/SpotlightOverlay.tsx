import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '../../hooks/useStory';

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 12;

export default function SpotlightOverlay() {
  const { isOpen, activeAnnotation, currentAnnotations, spotlightEnabled } = useStory();

  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const rafRef = useRef(0);

  const annotation = currentAnnotations[activeAnnotation];

  const measure = useCallback(() => {
    if (!annotation) {
      setTargetRect(null);
      return;
    }
    const el = document.querySelector(`[data-tour="${annotation.target}"]`);
    if (!el) {
      setTargetRect(null);
      return;
    }
    const r = el.getBoundingClientRect();
    setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
  }, [annotation]);

  useEffect(() => {
    if (!isOpen || !annotation) {
      setTargetRect(null);
      return;
    }

    // Small delay for page transition to settle
    const timeout = setTimeout(() => {
      measure();
      const el = document.querySelector(`[data-tour="${annotation.target}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 350);

    const onUpdate = () => {
      rafRef.current = requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onUpdate, true);
    window.addEventListener('resize', onUpdate);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onUpdate, true);
      window.removeEventListener('resize', onUpdate);
    };
  }, [isOpen, annotation, measure]);

  if (!isOpen || !spotlightEnabled || currentAnnotations.length === 0 || !targetRect) return null;

  return (
    <AnimatePresence>
      {targetRect && (
        <>
          {/* Dim overlay with spotlight cutout */}
          <motion.div
            key="spotlight-dim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              pointerEvents: 'none',
            }}
          >
            <svg width="100%" height="100%" style={{ display: 'block' }}>
              <defs>
                <mask id="spotlight-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={targetRect.left - PADDING}
                    y={targetRect.top - PADDING}
                    width={targetRect.width + PADDING * 2}
                    height={targetRect.height + PADDING * 2}
                    rx={12}
                    fill="black"
                  />
                </mask>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="rgba(0,0,0,0.6)"
                mask="url(#spotlight-mask)"
              />
            </svg>
          </motion.div>

          {/* Spotlight border ring */}
          <motion.div
            key="spotlight-ring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              top: targetRect.top - PADDING,
              left: targetRect.left - PADDING,
              width: targetRect.width + PADDING * 2,
              height: targetRect.height + PADDING * 2,
              borderRadius: 12,
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 0 0 4px rgba(255,255,255,0.05)',
              zIndex: 10001,
              pointerEvents: 'none',
            }}
          />
        </>
      )}
    </AnimatePresence>
  );
}

