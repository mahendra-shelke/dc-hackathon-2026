import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FlaskConical, Clock, Cpu, CheckCircle2, AlertTriangle,
  XCircle, Shield,
} from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import AlgorithmMatrix from '../components/charts/AlgorithmMatrix';
import { classicalAlgoDeprecations, deviceClassAdvisories, cnsaMilestones } from '../data/deprecations';
import { useStory } from '../hooks/useStory';
import type { ClassicalAlgoDeprecation } from '../types';

type Tab = 'matrix' | 'deprecation' | 'advisor';

const TODAY_YEAR = new Date().getFullYear();
const TODAY_MS = new Date().getTime();

function daysUntil(year: number | null): number | null {
  if (!year) return null;
  const target = new Date(`${year}-01-01`).getTime();
  return Math.max(0, Math.ceil((target - TODAY_MS) / (1000 * 60 * 60 * 24)));
}

function statusIcon(status: ClassicalAlgoDeprecation['status']) {
  switch (status) {
    case 'active':
      return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    case 'deprecated':
      return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    case 'disallowed':
      return <XCircle className="w-4 h-4 text-red-400" />;
    case 'sunset':
      return <XCircle className="w-4 h-4 text-red-600" />;
  }
}

function statusColor(status: ClassicalAlgoDeprecation['status']): string {
  switch (status) {
    case 'active': return '#10B981';
    case 'deprecated': return '#F59E0B';
    case 'disallowed': return '#EF4444';
    case 'sunset': return '#7F1D1D';
  }
}

const TIMELINE_START = 2022;
const TIMELINE_END = 2031;
const TIMELINE_SPAN = TIMELINE_END - TIMELINE_START;

function yearToPercent(year: number): number {
  return ((year - TIMELINE_START) / TIMELINE_SPAN) * 100;
}

function DeprecationTimeline() {
  const todayPercent = yearToPercent(
    TODAY_YEAR + new Date().getMonth() / 12,
  );

  return (
    <div className="space-y-6">
      {/* CNSA Key Milestones */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-[#0C6DFD]" />
          <h3 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
            NIST / CNSA 2.0 Key Dates
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {cnsaMilestones.map((m) => (
            <div
              key={m.year}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
              style={{ backgroundColor: m.color + '18', border: `1px solid ${m.color}40`, color: m.color }}
            >
              <span className="font-bold">{m.year}</span>
              <span style={{ color: 'var(--theme-text-secondary)' }}>{m.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Timeline chart header */}
      <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--theme-text)' }}>
          Classical Algorithm Deprecation Timeline
        </h3>

        {/* Year ruler */}
        <div className="relative mb-6">
          <div className="flex justify-between text-[10px] mb-1" style={{ color: 'var(--theme-text-dim)' }}>
            {Array.from({ length: TIMELINE_END - TIMELINE_START + 1 }, (_, i) => (
              <span key={i}>{TIMELINE_START + i}</span>
            ))}
          </div>
          <div className="h-0.5 relative" style={{ backgroundColor: 'var(--theme-card-border)' }}>
            {/* Today marker */}
            <div
              className="absolute top-[-4px] w-0.5 h-3 bg-[#0C6DFD]"
              style={{ left: `${todayPercent}%` }}
            />
            <div
              className="absolute top-[-18px] text-[9px] font-semibold text-[#0C6DFD] -translate-x-1/2"
              style={{ left: `${todayPercent}%` }}
            >
              Today
            </div>
            {/* CNSA 2027 marker */}
            <div
              className="absolute top-[-4px] w-0.5 h-3 bg-red-500"
              style={{ left: `${yearToPercent(2027)}%` }}
            />
            <div
              className="absolute top-[8px] text-[9px] font-semibold text-red-400 -translate-x-1/2"
              style={{ left: `${yearToPercent(2027)}%` }}
            >
              Deadline
            </div>
          </div>
        </div>

        {/* Algorithm rows */}
        <div className="space-y-3">
          {classicalAlgoDeprecations.map((algo) => {
            const days = daysUntil(algo.disallowedYear);
            const color = statusColor(algo.status);

            // Active bar spans from start to disallowed/sunset
            const barEnd = algo.sunsetYear ?? algo.disallowedYear ?? TIMELINE_END;
            const barStart = TIMELINE_START;
            const barLeft = yearToPercent(barStart);
            const barWidth = yearToPercent(barEnd) - barLeft;

            return (
              <div key={algo.id} className="flex items-center gap-3">
                <div className="w-32 flex-shrink-0 text-right">
                  <div className="text-xs font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {algo.name}
                  </div>
                  <div className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>
                    {algo.keySize}
                  </div>
                </div>
                <div className="flex-1 relative h-6">
                  {/* Background track */}
                  <div
                    className="absolute inset-y-1 inset-x-0 rounded-full"
                    style={{ backgroundColor: 'var(--theme-bar-bg)' }}
                  />
                  {/* Active span */}
                  <div
                    className="absolute inset-y-1 rounded-full"
                    style={{
                      left: `${barLeft}%`,
                      width: `${barWidth}%`,
                      backgroundColor: color + '35',
                      border: `1px solid ${color}50`,
                    }}
                  />
                  {/* Disallowed marker */}
                  {algo.disallowedYear && (
                    <div
                      className="absolute top-0 bottom-0 w-0.5"
                      style={{
                        left: `${yearToPercent(algo.disallowedYear)}%`,
                        backgroundColor: color,
                      }}
                    />
                  )}
                </div>
                <div className="w-28 flex-shrink-0 flex items-center gap-1.5">
                  {statusIcon(algo.status)}
                  <div>
                    <div className="text-[10px] font-semibold capitalize" style={{ color }}>
                      {algo.status}
                    </div>
                    {days !== null && days > 0 && (
                      <div className="text-[9px]" style={{ color: 'var(--theme-text-dim)' }}>
                        {days}d left
                      </div>
                    )}
                    {days === 0 && (
                      <div className="text-[9px] text-red-400">Now</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
          <h3 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
            Deprecation Details
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
                {['Algorithm', 'Status', 'Disallowed', 'Sunset', 'CNSA 2.0', 'Notes'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3"
                    style={{ color: 'var(--theme-text-dim)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {classicalAlgoDeprecations.map((algo) => {
                const color = statusColor(algo.status);
                return (
                  <tr key={algo.id} style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
                    <td className="px-4 py-3">
                      <div className="text-xs font-semibold" style={{ color: 'var(--theme-text)' }}>
                        {algo.name}
                      </div>
                      <div className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>
                        {algo.family}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="flex items-center gap-1.5 text-[10px] font-semibold"
                        style={{ color }}
                      >
                        {statusIcon(algo.status)}
                        {algo.status.charAt(0).toUpperCase() + algo.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                      {algo.disallowedYear ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                      {algo.sunsetYear ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                      {algo.cnsa20Status}
                    </td>
                    <td className="px-4 py-3 text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)', maxWidth: 280 }}>
                      {algo.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DeviceAdvisor() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
        Select a device class to see the recommended PQC algorithms based on resource constraints.
        Not every device can run the same algorithm as a cloud server.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {deviceClassAdvisories.map((advisory) => {
          const isSelected = selected === advisory.deviceClass;
          return (
            <motion.button
              key={advisory.deviceClass}
              onClick={() => setSelected(isSelected ? null : advisory.deviceClass)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="text-left rounded-2xl p-5 transition-all"
              style={{
                backgroundColor: isSelected ? advisory.color + '12' : 'var(--theme-card)',
                border: `1px solid ${isSelected ? advisory.color + '50' : 'var(--theme-card-border)'}`,
              }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <div
                    className="text-sm font-bold mb-0.5"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    {advisory.label}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                    RAM: {advisory.ramRange}
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: advisory.color + '20' }}
                >
                  <Cpu className="w-4 h-4" style={{ color: advisory.color }} />
                </div>
              </div>

              <div className="text-xs mb-3" style={{ color: 'var(--theme-text-secondary)' }}>
                <span className="font-medium" style={{ color: 'var(--theme-text)' }}>Examples: </span>
                {advisory.exampleDevices}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div
                  className="rounded-lg p-2.5"
                  style={{ backgroundColor: 'var(--theme-bg)' }}
                >
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--theme-text-dim)' }}>
                    Key Exchange
                  </div>
                  <div className="text-xs font-bold" style={{ color: advisory.color }}>
                    {advisory.recommendedKem}
                  </div>
                </div>
                <div
                  className="rounded-lg p-2.5"
                  style={{ backgroundColor: 'var(--theme-bg)' }}
                >
                  <div className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'var(--theme-text-dim)' }}>
                    Signatures
                  </div>
                  <div className="text-xs font-bold" style={{ color: advisory.color }}>
                    {advisory.recommendedSig}
                  </div>
                </div>
              </div>

              <div className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                {advisory.notes}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Summary table */}
      <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0C6DFD]" />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
              Algorithm Selection Summary
            </h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
                {['Device Class', 'RAM', 'Example Devices', 'KEM (Key Exchange)', 'Signature', 'Notes'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[10px] font-semibold uppercase tracking-wider px-4 py-3"
                    style={{ color: 'var(--theme-text-dim)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deviceClassAdvisories.map((a) => (
                <tr
                  key={a.deviceClass}
                  style={{
                    borderBottom: '1px solid var(--theme-card-border)',
                    backgroundColor: selected === a.deviceClass ? a.color + '08' : 'transparent',
                  }}
                >
                  <td className="px-4 py-3">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded"
                      style={{ backgroundColor: a.color + '18', color: a.color }}
                    >
                      {a.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                    {a.ramRange}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                    {a.exampleDevices}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: a.color }}>
                    {a.recommendedKem}
                  </td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: a.color }}>
                    {a.recommendedSig}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--theme-text-muted)', maxWidth: 240 }}>
                    {a.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const tabs: { id: Tab; label: string; icon: typeof FlaskConical }[] = [
  { id: 'matrix', label: 'Algorithm Matrix', icon: FlaskConical },
  { id: 'deprecation', label: 'Deprecation Timeline', icon: Clock },
  { id: 'advisor', label: 'Device Advisor', icon: Cpu },
];

export default function AlgorithmPage() {
  const { activeTabHint } = useStory();
  const [tab, setTab] = useState<Tab>('matrix');

  // React to story navigation
  useEffect(() => {
    if (activeTabHint === 'deprecation') setTab('deprecation');
    if (activeTabHint === 'advisor') setTab('advisor');
  }, [activeTabHint]);

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
          Algorithm Intelligence
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--theme-text-muted)' }}>
          NIST PQC standards, deprecation timelines, and device-aware algorithm recommendations
        </p>
      </div>

      {/* Tabs */}
      <div
        className="flex gap-1 p-1 rounded-xl w-fit"
        style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            type="button"
            key={id}
            onClick={() => setTab(id)}
            className="relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ color: tab === id ? 'var(--theme-text)' : 'var(--theme-text-muted)' }}
          >
            {tab === id && (
              <motion.div
                layoutId="algo-tab-bg"
                className="absolute inset-0 bg-[#0C6DFD]/15 border border-[#0C6DFD]/30 rounded-lg"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <Icon className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">{label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <motion.div
        key={tab}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        {tab === 'matrix' && (
          <div className="space-y-6">
            <GlassCard className="p-6" delay={0.1}>
              <AlgorithmMatrix />
            </GlassCard>
            <div className="grid grid-cols-3 gap-4">
              <GlassCard className="p-5" delay={0.2}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#0C6DFD]" />
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>ML-DSA (Dilithium)</h4>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                  FIPS 204 — Primary NIST signature standard. Lattice-based. Best general-purpose
                  choice for IoT device authentication and code signing.
                </p>
              </GlassCard>
              <GlassCard className="p-5" delay={0.3}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>ML-KEM (Kyber)</h4>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                  FIPS 203 — Key encapsulation mechanism for TLS key exchange. Compact sizes
                  make it suitable for even constrained devices.
                </p>
              </GlassCard>
              <GlassCard className="p-5" delay={0.4}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>SLH-DSA & FN-DSA</h4>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                  FIPS 205 (SPHINCS+) — Hash-based, conservative choice. FN-DSA (Falcon) —
                  Smallest signatures but complex implementation.
                </p>
              </GlassCard>
            </div>
          </div>
        )}

        {tab === 'deprecation' && <DeprecationTimeline />}
        {tab === 'advisor' && <DeviceAdvisor />}
      </motion.div>
    </div>
  );
}
