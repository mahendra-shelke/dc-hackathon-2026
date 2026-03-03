import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Industry } from '../types';
import { industries } from '../data/industries';
import { industryColor } from '../theme/colors';
import GlassCard from '../components/common/GlassCard';
import RiskTimeline from '../components/charts/RiskTimeline';

export default function HndlRiskPage() {
  const [selected, setSelected] = useState<Industry>('medical');

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">HNDL Risk Timeline</h1>
        <p className="text-sm text-slate-400 mt-1">
          "Harvest Now, Decrypt Later" — adversaries are collecting encrypted data today to decrypt with quantum computers tomorrow
        </p>
      </div>

      {/* Industry toggle */}
      <div className="flex gap-2">
        {industries.map((ind) => (
          <button
            key={ind.id}
            onClick={() => setSelected(ind.id)}
            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selected === ind.id ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {selected === ind.id && (
              <motion.div
                layoutId="hndl-tab"
                className="absolute inset-0 rounded-lg border"
                style={{
                  backgroundColor: `${industryColor(ind.id)}15`,
                  borderColor: `${industryColor(ind.id)}40`,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{ind.label.split(' / ')[0]}</span>
          </button>
        ))}
      </div>

      {/* Timeline */}
      <GlassCard className="p-6" delay={0.1}>
        <h3 className="text-sm font-semibold text-white mb-4">
          Data Exposure Timeline — {industries.find((i) => i.id === selected)?.label}
        </h3>
        <RiskTimeline selectedIndustry={selected} />
      </GlassCard>

      {/* Explanation cards */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard className="p-5" delay={0.2}>
          <div className="text-3xl mb-3">1.</div>
          <h4 className="text-sm font-semibold text-white mb-2">Harvest</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Nation-state actors intercept and store encrypted TLS traffic, device communications,
            and certificate exchanges from IoT devices today.
          </p>
        </GlassCard>
        <GlassCard className="p-5" delay={0.3}>
          <div className="text-3xl mb-3">2.</div>
          <h4 className="text-sm font-semibold text-white mb-2">Wait</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            The captured data remains encrypted using RSA/ECDSA while quantum computing
            capability matures. Estimates: cryptographically relevant quantum by 2030-2035.
          </p>
        </GlassCard>
        <GlassCard className="p-5" delay={0.4}>
          <div className="text-3xl mb-3">3.</div>
          <h4 className="text-sm font-semibold text-white mb-2">Decrypt</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Once quantum computers can run Shor's algorithm at scale, all historically
            captured RSA and ECC encrypted data becomes readable. Patient records, vehicle
            data, industrial secrets — all exposed.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
