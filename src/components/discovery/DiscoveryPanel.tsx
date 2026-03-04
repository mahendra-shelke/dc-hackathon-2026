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
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>Network Scan</h3>
          <ScanVisualization />
        </GlassCard>

        {/* Log */}
        <GlassCard className="col-span-7 p-4" delay={0.1}>
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>Discovery Log</h3>
          <DiscoveryLog />
        </GlassCard>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Devices Found', value: deviceCount },
          { label: 'Connectors Active', value: connectedCount },
          { label: 'Algorithms Detected', value: algos.size },
          { label: 'Industries', value: new Set(state.discoveredDevices.map((d) => d.industry)).size },
        ].map((stat) => (
          <GlassCard key={stat.label} className="p-4 text-center" delay={0.15}>
            <AnimatedNumber value={stat.value} className="text-xl font-bold" />
            <p className="text-[11px] mt-1" style={{ color: 'var(--theme-text-muted)' }}>{stat.label}</p>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
