import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cloud, CloudCog, Zap, Cpu, Globe, ChevronDown, Plug, Unplug } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import type { ConnectorConfig } from '../../types';

const iconMap: Record<string, typeof Cloud> = {
  Cloud, CloudCog, Zap, Cpu, Globe,
};

interface Props {
  connector: ConnectorConfig;
  onConnect: (id: string) => void;
  onDisconnect: (id: string) => void;
}

const statusDot: Record<string, string> = {
  disconnected: 'bg-slate-500',
  connecting: 'bg-yellow-400 animate-pulse',
  connected: 'bg-emerald-400',
  error: 'bg-red-400',
};

const statusLabel: Record<string, string> = {
  disconnected: 'Disconnected',
  connecting: 'Connecting...',
  connected: 'Connected',
  error: 'Error',
};

export default function ConnectorCard({ connector, onConnect, onDisconnect }: Props) {
  const [expanded, setExpanded] = useState(false);
  const Icon = iconMap[connector.icon] ?? Globe;
  const isConnected = connector.status === 'connected';
  const isConnecting = connector.status === 'connecting';

  return (
    <GlassCard className="p-4" hover delay={0.05}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${connector.color}20` }}>
            <Icon className="w-5 h-5" style={{ color: connector.color }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-white">{connector.name}</p>
              {connector.isNew && (
                <span
                  className="text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                  style={{ backgroundColor: 'rgba(229,117,60,0.2)', color: '#E5753C' }}
                >
                  New
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className={`w-2 h-2 rounded-full ${statusDot[connector.status]}`} />
              <span className="text-[11px] text-slate-400">{statusLabel[connector.status]}</span>
            </div>
          </div>
        </div>
        {isConnected && connector.devicesDiscovered > 0 && (
          <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            {connector.devicesDiscovered} devices
          </span>
        )}
      </div>

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between py-1.5 text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
      >
        <span>Configuration</span>
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-3.5 h-3.5" />
        </motion.div>
      </button>

      {/* Config fields */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pt-2">
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider">Endpoint</label>
                <input
                  type="text"
                  value={connector.endpoint}
                  readOnly
                  className="w-full mt-1 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                  style={{ backgroundColor: 'var(--theme-input-bg)', border: '1px solid var(--theme-input-border)', color: 'var(--theme-text)' }}
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider">Protocol</label>
                <p className="text-xs text-slate-300 mt-1">{connector.protocol}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connect/Disconnect button */}
      <div className="mt-3">
        {isConnected ? (
          <button
            onClick={() => onDisconnect(connector.id)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Unplug className="w-3.5 h-3.5" />
            Disconnect
          </button>
        ) : (
          <button
            onClick={() => onConnect(connector.id)}
            disabled={isConnecting}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--theme-text)', color: 'var(--theme-bg)' }}
          >
            <Plug className="w-3.5 h-3.5" />
            {isConnecting ? 'Connecting...' : 'Connect'}
          </button>
        )}
      </div>
    </GlassCard>
  );
}
