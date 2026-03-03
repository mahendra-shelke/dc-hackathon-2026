import { useAnimatedCounter } from '../../hooks/useAnimatedCounter';

interface Props {
  value: number;
  format?: (n: number) => string;
  className?: string;
  duration?: number;
}

export default function AnimatedNumber({ value, format, className = '', duration = 1500 }: Props) {
  const animated = useAnimatedCounter(value, duration);
  const display = format ? format(animated) : animated.toLocaleString();

  return <span className={className}>{display}</span>;
}
