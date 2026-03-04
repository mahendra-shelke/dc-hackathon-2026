import { useNavigate } from 'react-router';
import { ArrowRight, RotateCcw, Cpu, ShieldCheck, AlertTriangle, Database } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { useDiscovery } from '../../hooks/useDiscovery';
import { useSimulation } from '../../hooks/useSimulation';
import { deviceGroups } from '../../data/devices';
import { totalDevices, countByStatus, countByRisk, totalDataAtRisk, formatNumber } from '../../utils';

export default function DiscoverySummary() {
  const navigate = useNavigate();
  const { state, resetDiscovery } = useDiscovery();
  const { discoveredDeviceGroups } = useSimulation();

  const beforeTotal = totalDevices(deviceGroups);
  const afterTotal = beforeTotal + totalDevices(discoveredDeviceGroups);

  const beforeReady = countByStatus(deviceGroups, 'ready');
  const afterReady = beforeReady + countByStatus(discoveredDeviceGroups, 'hybrid') + countByStatus(discoveredDeviceGroups, 'ready');

  const beforeCritical = countByRisk(deviceGroups, 'critical');
  const afterCritical = beforeCritical + countByRisk(discoveredDeviceGroups, 'critical');

  const beforeDataAtRisk = totalDataAtRisk(deviceGroups);
  const afterDataAtRisk = beforeDataAtRisk + totalDataAtRisk(discoveredDeviceGroups);

  const verified = state.discoveredDevices.filter((d) => d.deployment?.status === 'verified').length;
  const failed = state.discoveredDevices.filter((d) => d.deployment?.status === 'failed').length;

  const kpis = [
    { label: 'Total Devices', before: beforeTotal, after: afterTotal, icon: Cpu, format: formatNumber },
    { label: 'PQC Ready / Hybrid', before: beforeReady, after: afterReady, icon: ShieldCheck, format: formatNumber },
    { label: 'Critical Risk', before: beforeCritical, after: afterCritical, icon: AlertTriangle, format: formatNumber },
    { label: 'Data at Risk (TB)', before: beforeDataAtRisk, after: afterDataAtRisk, icon: Database, format: formatNumber },
  ];

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <GlassCard className="p-6 text-center" delay={0.05}>
        <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'var(--theme-card-inner)', border: '2px solid var(--theme-card-border)' }}>
          <ShieldCheck className="w-7 h-7" style={{ color: 'var(--theme-text-secondary)' }} />
        </div>
        <h2 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Discovery Pipeline Complete</h2>
        <p className="text-sm mt-1" style={{ color: 'var(--theme-text-muted)' }}>
          {state.discoveredDevices.length} devices discovered — {verified} hybrid certs deployed, {failed} require attention
        </p>
      </GlassCard>

      {/* Before / After KPI comparison */}
      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const delta = kpi.after - kpi.before;
          const isPositive = kpi.label === 'Total Devices' || kpi.label === 'PQC Ready / Hybrid';
          return (
            <GlassCard key={kpi.label} className="p-4" delay={0.1}>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: 'var(--theme-card-inner)' }}>
                  <kpi.icon className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                </div>
                <p className="text-[11px] uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>{kpi.label}</p>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>Before</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--theme-text-muted)' }}>{kpi.format(kpi.before)}</p>
                </div>
                <ArrowRight className="w-4 h-4" style={{ color: 'var(--theme-text-dim)' }} />
                <div className="text-right">
                  <p className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>After</p>
                  <p className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>{kpi.format(kpi.after)}</p>
                </div>
              </div>
              {delta !== 0 && (
                <p className="text-[11px] text-right mt-1" style={{ color: isPositive ? 'var(--theme-text-secondary)' : '#E5753C' }}>
                  {delta > 0 ? '+' : ''}{kpi.format(delta)}
                </p>
              )}
            </GlassCard>
          );
        })}
      </div>

      {/* Action buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--theme-text)', color: 'var(--theme-bg)' }}
        >
          <ArrowRight className="w-4 h-4" />
          View Updated Dashboard
        </button>
        <button
          onClick={resetDiscovery}
          className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-colors"
          style={{ backgroundColor: 'var(--theme-card)', color: 'var(--theme-text)', border: '1px solid var(--theme-card-border)' }}
        >
          <RotateCcw className="w-4 h-4" />
          Run New Discovery
        </button>
      </div>
    </div>
  );
}
