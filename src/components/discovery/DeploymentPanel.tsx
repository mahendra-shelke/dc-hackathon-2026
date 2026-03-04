import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Clock, XCircle } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import AnimatedNumber from '../common/AnimatedNumber';
import DiscoveryLog from './DiscoveryLog';
import { useDiscovery } from '../../hooks/useDiscovery';
import type { DeploymentStatus } from '../../types';

const statusConfig: Record<DeploymentStatus, { icon: typeof Clock; color: string; label: string }> = {
  pending: { icon: Clock, color: 'var(--theme-text-dim)', label: 'Pending' },
  updating: { icon: Loader2, color: 'var(--theme-text-secondary)', label: 'Updating' },
  verified: { icon: CheckCircle2, color: 'var(--theme-text)', label: 'Verified' },
  failed: { icon: XCircle, color: '#E5753C', label: 'Failed' },
};

export default function DeploymentPanel() {
  const { state } = useDiscovery();
  const devices = state.discoveredDevices;

  const counts: Record<DeploymentStatus, number> = {
    pending: devices.filter((d) => d.deployment?.status === 'pending').length,
    updating: devices.filter((d) => d.deployment?.status === 'updating').length,
    verified: devices.filter((d) => d.deployment?.status === 'verified').length,
    failed: devices.filter((d) => d.deployment?.status === 'failed').length,
  };

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <GlassCard className="p-5" delay={0.05}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>TrustEdge OTA Deployment</h3>
          <span className="text-sm font-mono" style={{ color: 'var(--theme-text-secondary)' }}>{state.deploymentProgress}%</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: 'var(--theme-text-secondary)' }}
            animate={{ width: `${state.deploymentProgress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Status counters */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {(Object.keys(counts) as DeploymentStatus[]).map((status) => {
            const cfg = statusConfig[status];
            return (
              <div key={status} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'var(--theme-card-inner)' }}>
                <cfg.icon className="w-4 h-4" style={{ color: cfg.color }} />
                <div>
                  <AnimatedNumber value={counts[status]} className="text-sm font-bold" />
                  <p className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>{cfg.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <div className="grid grid-cols-12 gap-4">
        {/* Device cards */}
        <div className="col-span-7">
          <GlassCard className="p-4" delay={0.1}>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--theme-text)' }}>Per-Device Status</h3>
            <div className="grid grid-cols-2 gap-2 max-h-[320px] overflow-y-auto pr-1">
              {devices.map((device) => {
                const dep = device.deployment;
                if (!dep) return null;
                const cfg = statusConfig[dep.status];
                const StatusIcon = cfg.icon;

                return (
                  <motion.div
                    key={device.id}
                    layout
                    className="flex items-center gap-2 p-2.5 rounded-lg"
                    style={{ backgroundColor: 'var(--theme-card-inner)', border: '1px solid var(--theme-card-border)' }}
                  >
                    <StatusIcon
                      className={`w-4 h-4 shrink-0 ${dep.status === 'updating' ? 'animate-spin' : ''}`}
                      style={{ color: cfg.color }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium truncate" style={{ color: 'var(--theme-text)' }}>{device.hostname}</p>
                      <p className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>{dep.algorithm}</p>
                    </div>
                    <span
                      className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                      style={{ color: cfg.color, backgroundColor: `${cfg.color}15` }}
                    >
                      {cfg.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </GlassCard>
        </div>

        {/* Deployment log */}
        <div className="col-span-5">
          <GlassCard className="p-4" delay={0.15}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>Deployment Log</h3>
            <DiscoveryLog />
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
