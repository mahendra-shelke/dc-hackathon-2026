import { motion } from 'framer-motion';
import {
  AlertTriangle, Server, ShieldCheck, Clock,
  Play, RotateCcw, Search,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useDiscovery } from '../hooks/useDiscovery';
import { useSimulation } from '../hooks/useSimulation';
import { riskColor } from '../theme/colors';
import type { DiscoveredDevice } from '../types';

const CNSA_DEADLINE = new Date('2027-01-01');
const TODAY = new Date();
const WEEKS_REMAINING = Math.floor(
  (CNSA_DEADLINE.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24 * 7),
);
const MIGRATION_VELOCITY = 420;

function getProjection(totalDevices: number, devicesReady: number) {
  const remaining = totalDevices - devicesReady;
  const weeksNeeded = Math.ceil(remaining / MIGRATION_VELOCITY);
  const date = new Date(TODAY.getTime() + weeksNeeded * 7 * 24 * 60 * 60 * 1000);
  const buffer = WEEKS_REMAINING - weeksNeeded;
  if (buffer >= 8) return { date, verdict: 'on-track' as const, label: 'On Track' };
  if (buffer >= 0) return { date, verdict: 'at-risk' as const, label: 'At Risk' };
  return { date, verdict: 'miss' as const, label: 'Will Miss Deadline' };
}

function buildRecommendations(devices: DiscoveredDevice[]) {
  const algoGroups = new Map<string, DiscoveredDevice[]>();
  for (const d of devices) {
    const algo = d.currentAlgorithm;
    if (!algoGroups.has(algo)) algoGroups.set(algo, []);
    algoGroups.get(algo)!.push(d);
  }

  return Array.from(algoGroups.entries())
    .map(([algo, devs]) => {
      const avgRisk = devs.reduce((s, d) => s + (d.assessment?.riskScore ?? 50), 0) / devs.length;
      const priority: 'Critical' | 'High' | 'Medium' = avgRisk >= 75 ? 'Critical' : avgRisk >= 50 ? 'High' : 'Medium';
      const noFw = devs.filter((d) => !d.assessment?.firmwareUpdateCapable).length;
      const recPqc = devs[0]?.assessment?.recommendedPqc ?? 'ML-DSA-65';
      let action = `Migrate to ${recPqc} hybrid certs via TrustEdge`;
      if (algo.includes('PSK') || algo.includes('AES')) action = `Provision PQC identity via TrustEdge Light → ${recPqc}`;
      if (noFw > 0) action = `${noFw} non-updatable — gateway-proxied PQC; rest → ${recPqc}`;
      return { issue: `${algo} devices`, count: devs.length, action, priority };
    })
    .sort((a, b) => {
      const order = { Critical: 0, High: 1, Medium: 2 };
      return order[a.priority] - order[b.priority];
    });
}

export default function BlueprintPage() {
  const { state: disc } = useDiscovery();
  const { state, isSimulated, startSimulation, resetSimulation } = useSimulation();
  const navigate = useNavigate();
  const discovered = disc.discoveredDevices;
  const hasDiscovery = discovered.length > 0;
  const totalFound = discovered.length;

  const weakCrypto = discovered.filter((d) => ['RSA-1024', 'RSA-2048', 'AES-128-PSK'].includes(d.currentAlgorithm)).length;
  const noCert = discovered.filter((d) => d.currentAlgorithm.includes('PSK') || d.currentAlgorithm.includes('AES')).length;

  const devicesReady = totalFound > 0 ? Math.floor(totalFound * (state.readinessScore / 100)) : 0;
  const projection = getProjection(totalFound || 1, devicesReady);
  const progressPercent = totalFound > 0 ? Math.round((devicesReady / totalFound) * 100) : 0;
  const recommendations = hasDiscovery ? buildRecommendations(discovered) : [];

  const circumference = 2 * Math.PI * 44;
  const offset = circumference * (1 - progressPercent / 100);
  const verdictColor = projection.verdict === 'miss' ? '#E5753C' : projection.verdict === 'at-risk' ? 'var(--theme-text-secondary)' : 'var(--theme-text)';

  const summaryCards = [
    { label: 'Devices', value: totalFound, icon: Server },
    { label: 'Weak Crypto', value: weakCrypto, icon: AlertTriangle, color: riskColor('high') },
    { label: 'No PKI Identity', value: noCert, icon: ShieldCheck, color: riskColor('critical') },
    { label: 'Weeks to Deadline', value: WEEKS_REMAINING, icon: Clock },
  ];

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>Readiness Blueprint</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--theme-text-muted)' }}>
            Fleet issues, recommendations, and CNSA 2.0 deadline projection
          </p>
        </div>
        <div className="flex gap-2">
          {hasDiscovery && !isSimulated && !state.isRunning && (
            <button
              data-tour="blueprint-apply"
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

      {!hasDiscovery && (
        <div
          className="rounded-xl p-10 flex flex-col items-center justify-center text-center"
          style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
        >
          <Search className="w-8 h-8 mb-3" style={{ color: 'var(--theme-text-muted)' }} />
          <h2 className="text-base font-semibold mb-1" style={{ color: 'var(--theme-text)' }}>No devices discovered yet</h2>
          <p className="text-sm mb-4" style={{ color: 'var(--theme-text-muted)' }}>
            Connect your platforms and run a fleet scan to generate the readiness blueprint.
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

      {hasDiscovery && <>
      {/* Summary cards */}
      <div data-tour="blueprint-summary" className="grid grid-cols-4 gap-4">
        {summaryCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4" style={{ color: color ?? 'var(--theme-text-muted)' }} />
              <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>{label}</span>
            </div>
            <div className="text-2xl font-bold" style={{ color: color ?? 'var(--theme-text)' }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
          </div>
        ))}
      </div>

      {/* Projection + Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Projection arc */}
        <div
          data-tour="blueprint-projection"
          className="rounded-xl p-5 flex flex-col items-center justify-center"
          style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
        >
          <div className="relative w-24 h-24 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="44" fill="none" strokeWidth="6" style={{ stroke: 'var(--theme-bar-bg)' }} />
              <motion.circle
                cx="50" cy="50" r="44" fill="none" strokeWidth="6"
                stroke={projection.verdict === 'miss' ? '#E5753C' : 'var(--theme-text-secondary)'}
                strokeLinecap="round" strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>{progressPercent}%</div>
              <div className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>ready</div>
            </div>
          </div>
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{
              backgroundColor: projection.verdict === 'miss' ? 'rgba(229,117,60,0.15)' : 'var(--theme-card-border)',
              color: verdictColor,
            }}
          >
            {projection.label}
          </span>
          <p className="text-[11px] mt-2 text-center" style={{ color: 'var(--theme-text-muted)' }}>
            Projected: {projection.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Recommendations table */}
        <div
          data-tour="blueprint-recommendations"
          className="lg:col-span-2 rounded-xl overflow-hidden"
          style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
        >
          <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>Recommendations</h2>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
                {['Issue', 'Devices', 'Action', 'Priority'].map((h) => (
                  <th key={h} className="text-left py-2.5 px-5 font-medium" style={{ color: 'var(--theme-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recommendations.map((r, i) => (
                <motion.tr
                  key={r.issue}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ borderBottom: '1px solid var(--theme-card-border)' }}
                >
                  <td className="py-2.5 px-5 font-medium" style={{ color: 'var(--theme-text)' }}>{r.issue}</td>
                  <td className="py-2.5 px-5" style={{ color: 'var(--theme-text-secondary)' }}>{r.count}</td>
                  <td className="py-2.5 px-5" style={{ color: 'var(--theme-text-secondary)' }}>{r.action}</td>
                  <td className="py-2.5 px-5">
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-semibold"
                      style={{
                        color: r.priority === 'Critical' ? riskColor('critical') : r.priority === 'High' ? riskColor('high') : 'var(--theme-text-muted)',
                        backgroundColor: r.priority === 'Critical' ? `${riskColor('critical')}18` : r.priority === 'High' ? `${riskColor('high')}18` : 'var(--theme-card-inner)',
                      }}
                    >
                      {r.priority}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discovered device issues */}
      {hasDiscovery && (
        <div
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
        >
          <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
            <h2 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
              Discovered Device Issues
            </h2>
          </div>
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
                {['Device', 'Algorithm', 'Risk', 'Recommended PQC', 'FW Update'].map((h) => (
                  <th key={h} className="text-left py-2.5 px-5 font-medium" style={{ color: 'var(--theme-text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {discovered
                .filter((d) => d.assessment && (d.assessment.riskLevel === 'critical' || d.assessment.riskLevel === 'high'))
                .map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: '1px solid var(--theme-card-border)' }}
                  >
                    <td className="py-2.5 px-5">
                      <div className="font-medium" style={{ color: 'var(--theme-text)' }}>{d.hostname}</div>
                      <div className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>{d.deviceType}</div>
                    </td>
                    <td className="py-2.5 px-5" style={{ color: 'var(--theme-text-secondary)' }}>{d.currentAlgorithm}</td>
                    <td className="py-2.5 px-5">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-semibold capitalize"
                        style={{ color: riskColor(d.assessment!.riskLevel), backgroundColor: `${riskColor(d.assessment!.riskLevel)}18` }}
                      >
                        {d.assessment!.riskLevel}
                      </span>
                    </td>
                    <td className="py-2.5 px-5" style={{ color: 'var(--theme-text-secondary)' }}>{d.assessment!.recommendedPqc}</td>
                    <td className="py-2.5 px-5" style={{ color: d.assessment!.firmwareUpdateCapable ? 'var(--theme-text-secondary)' : riskColor('critical') }}>
                      {d.assessment!.firmwareUpdateCapable ? 'Yes' : 'No'}
                    </td>
                  </motion.tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
      </>}
    </div>
  );
}
