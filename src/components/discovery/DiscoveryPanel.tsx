import GlassCard from '../common/GlassCard';
import ScanVisualization from './ScanVisualization';
import DiscoveryLog from './DiscoveryLog';
import AnimatedNumber from '../common/AnimatedNumber';
import { useDiscovery } from '../../hooks/useDiscovery';

export default function DiscoveryPanel() {
  const { state, connectedCount } = useDiscovery();
  const deviceCount = state.discoveredDevices.length;
  const algos = new Set(state.discoveredDevices.map((d) => d.currentAlgorithm));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Radar */}
        <GlassCard className="col-span-5 p-4" delay={0.05}>
          <h3 className="text-sm font-semibold text-white mb-2">Network Scan</h3>
          <ScanVisualization />
        </GlassCard>

        {/* Log */}
        <GlassCard className="col-span-7 p-4" delay={0.1}>
          <h3 className="text-sm font-semibold text-white mb-2">Discovery Log</h3>
          <DiscoveryLog />
        </GlassCard>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Devices Found', value: deviceCount, color: '#0C6DFD' },
          { label: 'Connectors Active', value: connectedCount, color: '#10B981' },
          { label: 'Algorithms Detected', value: algos.size, color: '#F97316' },
          { label: 'Industries', value: new Set(state.discoveredDevices.map((d) => d.industry)).size, color: '#8B5CF6' },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-4 text-center" delay={0.15}>
            <span style={{ color: stat.color }}><AnimatedNumber value={stat.value} className="text-xl font-bold" /></span>
            <p className="text-[11px] text-slate-400 mt-1">{stat.label}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
