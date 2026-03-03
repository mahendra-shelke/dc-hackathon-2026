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
    { label: 'Total Devices', before: beforeTotal, after: afterTotal, icon: Cpu, color: '#0C6DFD', format: formatNumber },
    { label: 'PQC Ready / Hybrid', before: beforeReady, after: afterReady, icon: ShieldCheck, color: '#10B981', format: formatNumber },
    { label: 'Critical Risk', before: beforeCritical, after: afterCritical, icon: AlertTriangle, color: '#EF4444', format: formatNumber },
    { label: 'Data at Risk (TB)', before: beforeDataAtRisk, after: afterDataAtRisk, icon: Database, color: '#F97316', format: formatNumber },
  ];

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <GlassCard className="p-6 text-center" delay={0.05}>
        <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto mb-3">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Discovery Pipeline Complete</h2>
        <p className="text-sm text-slate-400 mt-1">
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
                <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${kpi.color}20` }}>
                  <kpi.icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wider">{kpi.label}</p>
              </div>
              <div className="flex items-baseline justify-between">
                <div>
                  <p className="text-[10px] text-slate-500">Before</p>
                  <p className="text-lg font-bold text-slate-400">{kpi.format(kpi.before)}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600" />
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">After</p>
                  <p className="text-lg font-bold text-white">{kpi.format(kpi.after)}</p>
                </div>
              </div>
              {delta !== 0 && (
                <p className={`text-[11px] text-right mt-1 ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
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
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#0C6DFD] hover:bg-[#0955CC] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          View Updated Dashboard
        </button>
        <button
          onClick={resetDiscovery}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Run New Discovery
        </button>
      </div>
    </div>
  );
}
