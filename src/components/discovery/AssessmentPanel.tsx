import { ShieldAlert, AlertTriangle, Cpu, TrendingUp } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import AnimatedNumber from '../common/AnimatedNumber';
import AssessmentTable from './AssessmentTable';
import { useDiscovery } from '../../hooks/useDiscovery';

export default function AssessmentPanel() {
  const { state } = useDiscovery();
  const assessed = state.discoveredDevices.filter((d) => d.assessment);
  const critical = assessed.filter((d) => d.assessment!.riskLevel === 'critical').length;
  const updatable = assessed.filter((d) => d.assessment!.firmwareUpdateCapable).length;
  const avgRisk = assessed.length > 0
    ? Math.round(assessed.reduce((sum, d) => sum + d.assessment!.riskScore, 0) / assessed.length)
    : 0;

  const stats = [
    { label: 'Total Assessed', value: assessed.length, icon: Cpu, color: '#0C6DFD' },
    { label: 'Critical Risk', value: critical, icon: AlertTriangle, color: '#EF4444' },
    { label: 'Firmware Updatable', value: updatable, icon: ShieldAlert, color: '#10B981' },
    { label: 'Avg Risk Score', value: avgRisk, icon: TrendingUp, color: '#F97316' },
  ];

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <GlassCard key={stat.label} className="p-4" delay={0.05}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${stat.color}20` }}>
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div>
                <AnimatedNumber value={stat.value} className="text-lg font-bold text-white" />
                <p className="text-[11px] text-slate-400">{stat.label}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Table */}
      <GlassCard className="p-4" delay={0.1}>
        <h3 className="text-sm font-semibold text-white mb-3">TrustCore Device Assessment</h3>
        <AssessmentTable />
      </GlassCard>
    </div>
  );
}
