import GlassCard from '../components/common/GlassCard';
import FleetHeatmapGrid from '../components/charts/FleetHeatmapGrid';

export default function FleetHeatmapPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Fleet Heatmap</h1>
        <p className="text-sm text-slate-400 mt-1">
          PQC readiness status across all device groups — click any cell for details
        </p>
      </div>

      <GlassCard className="p-6" delay={0.1}>
        <FleetHeatmapGrid />
      </GlassCard>
    </div>
  );
}
