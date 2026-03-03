import { useState, useEffect, useRef } from 'react';

export function useAnimatedCounter(
  target: number,
  duration = 1500,
  delay = 0
): number {
  const [value, setValue] = useState(0);
  const startTime = useRef<number | null>(null);
  const startValue = useRef(0);
  const rafId = useRef(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      startValue.current = value;
      startTime.current = null;

      const animate = (timestamp: number) => {
        if (startTime.current === null) startTime.current = timestamp;
        const elapsed = timestamp - startTime.current;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

        const current = Math.round(
          startValue.current + (target - startValue.current) * eased
        );
        setValue(current);

        if (progress < 1) {
          rafId.current = requestAnimationFrame(animate);
        }
      };

      rafId.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(rafId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, delay]);

  return value;
}
