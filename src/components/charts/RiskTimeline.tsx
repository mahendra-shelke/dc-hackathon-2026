import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Industry } from '../../types';
import { industries } from '../../data/industries';
import { industryColor } from '../../theme/colors';
import AnimatedNumber from '../common/AnimatedNumber';

interface Particle {
  id: number;
  x: number;
  speed: number;
  size: number;
  opacity: number;
}

interface Props {
  selectedIndustry: Industry;
}

export default function RiskTimeline({ selectedIndustry }: Props) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const nextId = useRef(0);
  const industry = industries.find((i) => i.id === selectedIndustry)!;
  const color = industryColor(selectedIndustry);

  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => {
        const updated = prev
          .map((p) => ({ ...p, x: p.x + p.speed }))
          .filter((p) => p.x < 100);

        if (Math.random() > 0.3) {
          updated.push({
            id: nextId.current++,
            x: 0,
            speed: 0.3 + Math.random() * 0.4,
            size: 3 + Math.random() * 4,
            opacity: 0.4 + Math.random() * 0.6,
          });
        }
        return updated;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const todayX = 10;
  const threatX = 85;
  const windowYears = industry.hndlWindowYears;

  return (
    <div className="space-y-6">
      {/* Timeline SVG */}
      <div className="relative">
        <svg viewBox="0 0 800 120" className="w-full h-32">
          {/* Background gradient bar */}
          <defs>
            <linearGradient id={`risk-grad-${selectedIndustry}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity="0.1" />
              <stop offset="50%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Risk window */}
          <rect
            x={todayX * 8}
            y={35}
            width={(threatX - todayX) * 8}
            height={30}
            rx={4}
            fill={`url(#risk-grad-${selectedIndustry})`}
          />

          {/* Timeline line */}
          <line x1="40" y1="50" x2="720" y2="50" stroke="rgb(71, 85, 105)" strokeWidth="2" />

          {/* Particles */}
          {particles.map((p) => (
            <circle
              key={p.id}
              cx={40 + (p.x / 100) * 680}
              cy={50}
              r={p.size}
              fill={color}
              opacity={p.opacity}
            />
          ))}

          {/* Today marker */}
          <line x1={todayX * 8} y1="25" x2={todayX * 8} y2="75" stroke="#A1A1AA" strokeWidth="2" />
          <text x={todayX * 8} y="20" textAnchor="middle" fill="#A1A1AA" fontSize="11" fontWeight="600">TODAY</text>

          {/* CNSA 2.0 marker */}
          <line x1="400" y1="25" x2="400" y2="75" stroke="#EAB308" strokeWidth="2" strokeDasharray="4" />
          <text x="400" y="95" textAnchor="middle" fill="#EAB308" fontSize="10">CNSA 2.0 (2027)</text>

          {/* Quantum threat marker */}
          <line x1={threatX * 8} y1="25" x2={threatX * 8} y2="75" stroke="#EF4444" strokeWidth="2" />
          <text x={threatX * 8} y="20" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="600">Q-DAY</text>
          <text x={threatX * 8} y="95" textAnchor="middle" fill="#EF4444" fontSize="10">~2033</text>

          {/* HNDL window label */}
          <text x={((todayX + threatX) / 2) * 8} y="110" textAnchor="middle" fill="rgb(148, 163, 184)" fontSize="10">
            ← Harvest Now, Decrypt Later ({windowYears}yr window) →
          </text>
        </svg>
      </div>

      {/* Stats row */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedIndustry}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Data at Risk</p>
            <div className="text-2xl font-bold" style={{ color }}>
              <AnimatedNumber value={industry.dataAtRiskTB} /> <span className="text-sm">TB</span>
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">HNDL Window</p>
            <div className="text-2xl font-bold text-white">
              {windowYears} <span className="text-sm text-slate-400">years</span>
            </div>
          </div>
          <div className="bg-slate-800/30 rounded-lg p-4 text-center">
            <p className="text-xs text-slate-400 mb-1">Regulatory Deadline</p>
            <div className="text-sm font-semibold text-yellow-400 mt-1">
              {industry.regulatoryDeadline}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
