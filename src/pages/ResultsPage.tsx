import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import {
  Server, AlertTriangle, ShieldCheck, Clock,
  Search, Play, RotateCcw, ShieldOff, CheckCircle2, XCircle,
} from 'lucide-react';
import { useDiscovery } from '../hooks/useDiscovery';
import { useSimulation } from '../hooks/useSimulation';
import { riskColor } from '../theme/colors';
import { classicalAlgoDeprecations, cnsaMilestones } from '../data/deprecations';
import type { DiscoveredDevice } from '../types';
import type { ClassicalAlgoDeprecation } from '../types';

const CNSA_DEADLINE = new Date('2027-01-01');
const TODAY = new Date();
const WEEKS_REMAINING = Math.floor(
  (CNSA_DEADLINE.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24 * 7),
);

function riskBreakdown(devices: DiscoveredDevice[]) {
  const levels = ['critical', 'high', 'medium', 'low'] as const;
  return levels.map((level) => ({
    level,
    count: devices.filter((d) => d.assessment?.riskLevel === level).length,
  }));
}

function algoBreakdown(devices: DiscoveredDevice[]) {
  const map = new Map<string, number>();
  for (const d of devices) {
    map.set(d.currentAlgorithm, (map.get(d.currentAlgorithm) ?? 0) + 1);
  }
  return Array.from(map.entries())
    .map(([algo, count]) => ({ algo, count }))
    .sort((a, b) => b.count - a.count);
}

/* ── Deprecation Timeline helpers ── */
const TODAY_YEAR = new Date().getFullYear();
const TIMELINE_START = 2022;
const TIMELINE_END = 2036;
const TIMELINE_SPAN = TIMELINE_END - TIMELINE_START;

function yearToPercent(year: number): number {
  return ((year - TIMELINE_START) / TIMELINE_SPAN) * 100;
}

function statusIcon(status: ClassicalAlgoDeprecation['status']) {
  switch (status) {
    case 'active':
      return <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--theme-text-secondary)' }} />;
    case 'deprecated':
      return <AlertTriangle className="w-4 h-4" style={{ color: '#E5753C' }} />;
    case 'disallowed':
      return <XCircle className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />;
    case 'sunset':
      return <XCircle className="w-4 h-4" style={{ color: 'var(--theme-text-dim)' }} />;
  }
}

function statusColor(status: ClassicalAlgoDeprecation['status']): string {
  switch (status) {
    case 'active': return 'var(--theme-text-secondary)';
    case 'deprecated': return '#E5753C';
    case 'disallowed': return 'var(--theme-text-muted)';
    case 'sunset': return 'var(--theme-text-dim)';
  }
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state: disc } = useDiscovery();
  const { state, isSimulated, startSimulation, resetSimulation } = useSimulation();
  const discovered = disc.discoveredDevices;
  const hasDiscovery = discovered.length > 0;

  const total = discovered.length;
  const noCert = discovered.filter((d) => d.currentAlgorithm.includes('PSK') || d.currentAlgorithm.includes('AES')).length;
  const critical = discovered.filter((d) => d.assessment?.riskLevel === 'critical').length;
  const high = discovered.filter((d) => d.assessment?.riskLevel === 'high').length;
  const noFwUpdate = discovered.filter((d) => !d.assessment?.firmwareUpdateCapable).length;
  const readinessPct = Math.round(state.readinessScore);
  const risks = riskBreakdown(discovered);
  const algos = algoBreakdown(discovered);

  const fleetAlgoCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const d of discovered) {
      counts.set(d.currentAlgorithm, (counts.get(d.currentAlgorithm) ?? 0) + 1);
    }
    return counts;
  }, [discovered]);

  const todayPercent = yearToPercent(TODAY_YEAR + new Date().getMonth() / 12);

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>Fleet Results</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--theme-text-muted)' }}>
            PQC readiness score and vulnerability overview
          </p>
        </div>
        <div className="flex gap-2">
          {hasDiscovery && !isSimulated && !state.isRunning && (
            <button
              type="button"
              onClick={startSimulation}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg"
              style={{ backgroundColor: 'var(--theme-text)', color: 'var(--theme-bg)' }}
            >
              <Play className="w-4 h-4" /> Run Assessment
            </button>
          )}
          {state.isRunning && (
            <div className="flex items-center gap-3 min-w-[180px]">
              <span className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>{Math.round(state.progress * 100)}%</span>
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
                <motion.div className="h-full rounded-full" style={{ width: `${state.progress * 100}%`, backgroundColor: 'var(--theme-text-secondary)' }} />
              </div>
            </div>
          )}
          {isSimulated && !state.isRunning && (
            <button
              type="button"
              onClick={resetSimulation}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg"
              style={{ backgroundColor: 'var(--theme-card)', color: 'var(--theme-text)', border: '1px solid var(--theme-card-border)' }}
            >
              <RotateCcw className="w-4 h-4" /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!hasDiscovery && (
        <div
          className="rounded-xl p-10 flex flex-col items-center justify-center text-center"
          style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
        >
          <Search className="w-8 h-8 mb-3" style={{ color: 'var(--theme-text-muted)' }} />
          <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--theme-text)' }}>No results yet</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--theme-text-muted)' }}>
            Run a fleet discovery scan first to generate results.
          </p>
          <button
            type="button"
            onClick={() => navigate('/discovery')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-lg"
            style={{ backgroundColor: 'var(--theme-text)', color: 'var(--theme-bg)' }}
          >
            <Search className="w-4 h-4" /> Go to Discovery
          </button>
        </div>
      )}

      {hasDiscovery && (
        <>
          {/* Readiness score */}
          <motion.div
            data-tour="results-readiness"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="rounded-xl p-6"
            style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                Fleet PQC Readiness
              </div>
              <div className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
                {readinessPct}%
              </div>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{ backgroundColor: 'var(--theme-text-secondary)' }}
                initial={{ width: 0 }}
                animate={{ width: `${readinessPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>
              <span>0% — Not Started</span>
              <span>100% — CNSA 2.0 Compliant</span>
            </div>
          </motion.div>

          {/* Summary cards */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: 'Total Devices', value: total, icon: Server },
              { label: 'No PKI Identity', value: noCert, icon: ShieldOff, color: riskColor('critical') },
              { label: 'Critical', value: critical, icon: AlertTriangle, color: riskColor('critical') },
              { label: 'High Risk', value: high, icon: AlertTriangle, color: riskColor('high') },
              { label: 'Weeks Left', value: WEEKS_REMAINING, icon: Clock },
            ].map(({ label, value, icon: Icon, color }) => (
              <div
                key={label}
                className="rounded-xl p-4"
                style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-3.5 h-3.5" style={{ color: color ?? 'var(--theme-text-muted)' }} />
                  <span className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>{label}</span>
                </div>
                <div className="text-2xl font-bold" style={{ color: color ?? 'var(--theme-text)' }}>
                  {value.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* Risk breakdown + Algorithm breakdown */}
          <div data-tour="results-risk" className="grid grid-cols-2 gap-4">
            {/* Risk breakdown */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--theme-text)' }}>
                Risk Breakdown
              </h3>
              <div className="space-y-3">
                {risks.map(({ level, count }) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  return (
                    <div key={level}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium capitalize" style={{ color: riskColor(level) }}>
                          {level}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                          {count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: riskColor(level) }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Algorithm breakdown */}
            <div
              className="rounded-xl p-5"
              style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
            >
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--theme-text)' }}>
                Algorithms in Fleet
              </h3>
              <div className="space-y-2">
                {algos.map(({ algo, count }) => {
                  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                  const isWeak = algo.includes('RSA-1024') || algo.includes('AES-128');
                  return (
                    <div key={algo} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: isWeak ? riskColor('critical') : 'var(--theme-text-muted)' }}
                        />
                        <span className="text-xs font-medium" style={{ color: 'var(--theme-text)' }}>{algo}</span>
                      </div>
                      <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                        {count} ({pct}%)
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Non-updatable devices alert */}
          {noFwUpdate > 0 && (
            <div
              className="rounded-xl p-4 flex items-center gap-3"
              style={{ backgroundColor: `${riskColor('critical')}10`, border: `1px solid ${riskColor('critical')}30` }}
            >
              <ShieldCheck className="w-5 h-5 flex-shrink-0" style={{ color: riskColor('critical') }} />
              <div>
                <span className="text-xs font-semibold" style={{ color: riskColor('critical') }}>
                  {noFwUpdate} device{noFwUpdate !== 1 ? 's' : ''} cannot receive firmware updates
                </span>
                <span className="text-xs ml-1" style={{ color: 'var(--theme-text-muted)' }}>
                  — these require hardware replacement or gateway-proxied PQC.
                </span>
              </div>
            </div>
          )}

          {/* Device detail table */}
          <div
            className="rounded-xl overflow-hidden"
            style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
          >
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
              <h3 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>All Discovered Devices</h3>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
                  {['Device', 'Algorithm', 'Risk', 'Score', 'Recommended PQC', 'FW Update'].map((h) => (
                    <th key={h} className="text-left py-2.5 px-5 font-medium" style={{ color: 'var(--theme-text-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {discovered.map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    style={{ borderBottom: '1px solid var(--theme-card-border)' }}
                  >
                    <td className="py-2.5 px-5">
                      <div className="font-medium" style={{ color: 'var(--theme-text)' }}>{d.hostname}</div>
                      <div className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>{d.deviceType}</div>
                    </td>
                    <td className="py-2.5 px-5" style={{ color: 'var(--theme-text-secondary)' }}>{d.currentAlgorithm}</td>
                    <td className="py-2.5 px-5">
                      {d.assessment && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-semibold capitalize"
                          style={{ color: riskColor(d.assessment.riskLevel), backgroundColor: `${riskColor(d.assessment.riskLevel)}18` }}
                        >
                          {d.assessment.riskLevel}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-5" style={{ color: 'var(--theme-text-secondary)' }}>
                      {d.assessment?.riskScore ?? '—'}
                    </td>
                    <td className="py-2.5 px-5" style={{ color: 'var(--theme-text-secondary)' }}>
                      {d.assessment?.recommendedPqc ?? '—'}
                    </td>
                    <td className="py-2.5 px-5" style={{ color: d.assessment?.firmwareUpdateCapable ? 'var(--theme-text-secondary)' : riskColor('critical') }}>
                      {d.assessment?.firmwareUpdateCapable ? 'Yes' : 'No'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Deprecation Timeline */}
          <div data-tour="results-timeline" className="space-y-4">
            {/* CNSA Key Milestones */}
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4" style={{ color: 'var(--theme-text-secondary)' }} />
                <h3 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                  NIST / CNSA 2.0 Key Dates
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cnsaMilestones.map((m) => (
                  <div
                    key={m.year}
                    className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--theme-card-inner)',
                      border: '1px solid var(--theme-card-border)',
                      color: 'var(--theme-text-secondary)',
                    }}
                  >
                    <span className="font-bold" style={{ color: 'var(--theme-text)' }}>{m.year}</span>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline chart */}
            <div className="rounded-xl p-5 overflow-hidden" style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}>
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
                  <div className="absolute top-[-4px] w-0.5 h-3" style={{ left: `${todayPercent}%`, backgroundColor: 'var(--theme-text-secondary)' }} />
                  <div className="absolute top-[-18px] text-[9px] font-semibold -translate-x-1/2" style={{ left: `${todayPercent}%`, color: 'var(--theme-text-secondary)' }}>Today</div>
                  <div className="absolute top-[-4px] w-0.5 h-3" style={{ left: `${yearToPercent(2027)}%`, backgroundColor: '#E5753C' }} />
                  <div className="absolute top-[8px] text-[9px] font-semibold -translate-x-1/2" style={{ left: `${yearToPercent(2027)}%`, color: '#E5753C' }}>Deadline</div>
                </div>
              </div>

              {/* Algorithm rows */}
              <div className="space-y-3">
                {classicalAlgoDeprecations.map((algo) => {
                  const color = statusColor(algo.status);
                  const barEnd = algo.sunsetYear ?? algo.disallowedYear ?? TIMELINE_END;
                  const barWidth = yearToPercent(barEnd);
                  const hasDeprecatedSection = algo.deprecatedYear && algo.disallowedYear && algo.deprecatedYear < algo.disallowedYear;
                  const deprecatedLeft = algo.deprecatedYear ? yearToPercent(algo.deprecatedYear) : 0;
                  const deprecatedWidth = hasDeprecatedSection ? yearToPercent(algo.disallowedYear!) - deprecatedLeft : 0;

                  return (
                    <div key={algo.id} className="flex items-center gap-3 overflow-hidden">
                      <div className="w-32 flex-shrink-0 text-right">
                        <div className="text-xs font-semibold truncate" style={{ color: 'var(--theme-text)' }}>{algo.name}</div>
                        <div className="text-[10px] truncate" style={{ color: 'var(--theme-text-dim)' }}>
                          {algo.keySize}
                          {(fleetAlgoCounts.get(algo.name) ?? 0) > 0 && (
                            <span className="ml-1.5 font-semibold" style={{ color }}>· {fleetAlgoCounts.get(algo.name)} in fleet</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 relative h-6">
                        <div className="absolute inset-y-1 inset-x-0 rounded-full" style={{ backgroundColor: 'var(--theme-bar-bg)' }} />
                        {algo.deprecatedYear && (
                          <div className="absolute inset-y-1 rounded-l-full" style={{ left: '0%', width: `${deprecatedLeft}%`, backgroundColor: 'rgba(160, 160, 168, 0.14)', border: '1px solid rgba(160, 160, 168, 0.22)' }} />
                        )}
                        {hasDeprecatedSection && (
                          <div className="absolute inset-y-1" style={{ left: `${deprecatedLeft}%`, width: `${deprecatedWidth}%`, backgroundColor: 'rgba(229, 117, 60, 0.12)', border: '1px solid rgba(229, 117, 60, 0.22)' }} />
                        )}
                        {algo.status === 'sunset' && (
                          <div className="absolute inset-y-1 rounded-full" style={{ left: '0%', width: `${barWidth}%`, backgroundColor: 'rgba(76, 76, 84, 0.14)', border: '1px solid rgba(76, 76, 84, 0.22)' }} />
                        )}
                        {algo.deprecatedYear && algo.status !== 'sunset' && (
                          <div className="absolute top-0 bottom-0 w-px" style={{ left: `${yearToPercent(algo.deprecatedYear)}%`, borderLeft: '1px dashed var(--theme-text-muted)' }} />
                        )}
                        {algo.disallowedYear && (
                          <div className="absolute top-0 bottom-0 w-0.5" style={{ left: `${yearToPercent(algo.disallowedYear)}%`, backgroundColor: color }} />
                        )}
                      </div>
                      <div className="w-28 flex-shrink-0 flex items-center gap-1.5 overflow-hidden">
                        {statusIcon(algo.status)}
                        <div className="truncate">
                          <div className="text-[10px] font-semibold capitalize truncate" style={{ color }}>{algo.status}</div>
                          {algo.disallowedYear && algo.disallowedYear > TODAY_YEAR && (
                            <div className="text-[9px] truncate" style={{ color: 'var(--theme-text-dim)' }}>by {algo.disallowedYear}</div>
                          )}
                          {algo.status === 'sunset' && (
                            <div className="text-[9px]" style={{ color: '#E5753C' }}>Now</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
