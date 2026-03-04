import { Cpu, ShieldAlert, FileWarning, AlertTriangle, Clock, Database, ShieldOff } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import StatCard from '../components/common/StatCard';
import ReadinessGauge from '../components/charts/ReadinessGauge';
import IndustryDonut from '../components/charts/IndustryDonut';
import AnimatedNumber from '../components/common/AnimatedNumber';
import { useSimulation } from '../hooks/useSimulation';
import { deviceGroups } from '../data/devices';
import { totalDevices, countByStatus, expiringCerts, countByRisk, totalDataAtRisk, daysUntil, formatNumber } from '../utils';

export default function ExecutiveDashboard() {
  const { state, isSimulated, discoveredDeviceGroups } = useSimulation();
  const hasDiscovery = discoveredDeviceGroups.length > 0;
  const allDeviceGroups = hasDiscovery ? [...deviceGroups, ...discoveredDeviceGroups] : deviceGroups;

  const total = totalDevices(allDeviceGroups);
  const discoveredCount = hasDiscovery ? totalDevices(discoveredDeviceGroups) : 0;
  const noCertCount = deviceGroups.filter((d) => d.certStatus === 'none').reduce((s, d) => s + d.count, 0);
  const readyCount = isSimulated ? state.devicesReady : countByStatus(allDeviceGroups, 'ready') + (hasDiscovery ? countByStatus(discoveredDeviceGroups, 'hybrid') : 0);
  const readyPct = Math.round((readyCount / total) * 100);
  const expiring = expiringCerts(allDeviceGroups, 12);
  const critical = isSimulated ? Math.round(countByRisk(deviceGroups, 'critical') * (1 - state.riskReduction / 100)) : countByRisk(allDeviceGroups, 'critical');
  const dataAtRisk = isSimulated ? Math.round(totalDataAtRisk(deviceGroups) * (1 - state.riskReduction / 100)) : totalDataAtRisk(allDeviceGroups);
  const cnsaDays = daysUntil('2027-01-01');

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Executive Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">Post-Quantum Cryptography Fleet Readiness Overview</p>
      </div>

      {/* Top row: Gauge + Stats */}
      <div className="grid grid-cols-12 gap-6">
        {/* Gauge */}
        <GlassCard className="col-span-4 p-6 flex items-center justify-center" delay={0.1}>
          <ReadinessGauge score={isSimulated ? state.readinessScore : 15} />
        </GlassCard>

        {/* Stat cards */}
        <div className="col-span-8 grid grid-cols-2 gap-4">
          <div className="relative">
            <StatCard
              label="Total Devices"
              value={total}
              format={formatNumber}
              icon={Cpu}
              delay={0.15}
            />
            {hasDiscovery && (
              <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-medium rounded-full" style={{ backgroundColor: 'var(--theme-card-inner)', color: 'var(--theme-text-secondary)', border: '1px solid var(--theme-card-border)' }}>
                +{discoveredCount} from Discovery
              </span>
            )}
          </div>
          <StatCard
            label="PQC Ready"
            value={readyPct}
            suffix="%"
            icon={ShieldAlert}
            iconColor={readyPct > 50 ? '#10B981' : '#EF4444'}
            delay={0.2}
            trend={isSimulated ? 'up' : undefined}
          />
          <StatCard
            label="Certs Expiring (12mo)"
            value={isSimulated ? Math.max(0, expiring - state.certsUpdated) : expiring}
            format={formatNumber}
            icon={FileWarning}
            iconColor="#F97316"
            delay={0.25}
            trend={isSimulated ? 'down' : undefined}
          />
          <StatCard
            label="Critical Risk Devices"
            value={critical}
            format={formatNumber}
            icon={AlertTriangle}
            iconColor="#EF4444"
            delay={0.3}
            trend={isSimulated ? 'down' : undefined}
          />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-12 gap-6">
        {/* Industry breakdown */}
        <GlassCard className="col-span-5 p-6" delay={0.35}>
          <h3 className="text-sm font-semibold text-white mb-4">Device Distribution by Industry</h3>
          <IndustryDonut />
        </GlassCard>

        {/* Quick stats */}
        <div className="col-span-7 grid grid-cols-2 gap-4">
          <GlassCard className="p-5" delay={0.4}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Database className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">HNDL Data at Risk</p>
                <div className="flex items-baseline gap-1">
                  <AnimatedNumber value={dataAtRisk} className="text-2xl font-bold text-red-400" />
                  <span className="text-sm text-slate-400">TB</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Harvest Now, Decrypt Later exposure</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5" delay={0.45}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">CNSA 2.0 Deadline</p>
                <div className="flex items-baseline gap-1">
                  <AnimatedNumber value={cnsaDays} className="text-2xl font-bold text-yellow-400" />
                  <span className="text-sm text-slate-400">days</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">January 2027 compliance target</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5" delay={0.48}>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-600/10">
                <ShieldOff className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">No Crypto Identity</p>
                <div className="flex items-baseline gap-1">
                  <AnimatedNumber value={noCertCount} className="text-2xl font-bold text-red-500" />
                  <span className="text-sm text-slate-400">devices</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Zero certificates — highest unknown risk</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="col-span-2 p-5" delay={0.5}>
            <h3 className="text-sm font-semibold text-white mb-3">Migration Status</h3>
            <div className="flex gap-3">
              {[
                { label: 'Not Ready', count: countByStatus(allDeviceGroups, 'not-ready'), color: '#EF4444' },
                { label: 'Hybrid', count: countByStatus(allDeviceGroups, 'hybrid'), color: '#3B82F6' },
                { label: 'PQC Ready', count: countByStatus(allDeviceGroups, 'ready'), color: '#10B981' },
              ].map((s) => {
                const pct = Math.round((s.count / total) * 100);
                return (
                  <div key={s.label} className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">{s.label}</span>
                      <span className="text-xs font-medium" style={{ color: s.color }}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">{s.count.toLocaleString()} devices</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
