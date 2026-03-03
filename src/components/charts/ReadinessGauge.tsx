import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  score: number; // 0-100
  size?: number;
  label?: string;
}

export default function ReadinessGauge({ score, size = 240, label = 'Fleet Readiness' }: Props) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI * 1.5; // 270 degrees
  const center = size / 2;

  useEffect(() => {
    const timeout = setTimeout(() => setAnimatedScore(score), 300);
    return () => clearTimeout(timeout);
  }, [score]);

  const progress = animatedScore / 100;
  const dashOffset = circumference * (1 - progress);

  const getColor = (s: number) => {
    if (s >= 70) return '#10B981';
    if (s >= 40) return '#EAB308';
    return '#EF4444';
  };
  const color = getColor(animatedScore);

  // Arc starts at 135deg (bottom-left) and goes 270deg clockwise
  const startAngle = 135;

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="rgb(51, 65, 85)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference * 2}`}
          transform={`rotate(${startAngle} ${center} ${center})`}
          opacity={0.5}
        />

        {/* Progress arc */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference * 2}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: dashOffset }}
          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
          transform={`rotate(${startAngle} ${center} ${center})`}
          style={{ filter: `drop-shadow(0 0 8px ${color}80)` }}
        />

        {/* Center text */}
        <text x={center} y={center - 8} textAnchor="middle" className="fill-white text-4xl font-bold" style={{ fontSize: 48 }}>
          <motion.tspan
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {animatedScore}
          </motion.tspan>
        </text>
        <text x={center} y={center + 20} textAnchor="middle" className="fill-slate-400" style={{ fontSize: 13 }}>
          / 100
        </text>
      </svg>
      <p className="text-sm text-slate-400 -mt-2">{label}</p>
    </div>
  );
}
