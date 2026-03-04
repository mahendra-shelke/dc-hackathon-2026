import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ShieldCheck, ChevronDown, ChevronUp, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { kernelAgents } from '../../data/blueprint';
import type { KernelAgent } from '../../types';

function heartbeatLabel(offsetMs: number): string {
  const secs = Math.abs(Math.round(offsetMs / 1000));
  if (secs < 60) return `${secs}s ago`;
  return `${Math.floor(secs / 60)}m ago`;
}

function certBadge(certStatus: KernelAgent['certStatus']) {
  switch (certStatus) {
    case 'none':
      return { label: 'No Cert', bg: 'var(--theme-card-inner)', color: '#E5753C' };
    case 'classical':
      return { label: 'Classical', bg: 'var(--theme-card-inner)', color: 'var(--theme-text-muted)' };
    case 'hybrid':
      return { label: 'Hybrid', bg: 'var(--theme-card-inner)', color: 'var(--theme-text-secondary)' };
    case 'pqc':
      return { label: 'PQC', bg: 'var(--theme-card-inner)', color: 'var(--theme-text)' };
  }
}

function AgentRow({ agent, tick }: { agent: KernelAgent; tick: number }) {
  const badge = certBadge(agent.certStatus);
  // Simulate heartbeat drift — slightly different offset each tick
  const effectiveOffset = agent.lastHeartbeat - tick * 1000;
  const isMissed = Math.abs(effectiveOffset) > 30000;

  return (
    <tr
      style={{ borderBottom: '1px solid var(--theme-card-border)' }}
    >
      <td className="py-2.5 pr-4">
        <div className="flex items-center gap-2">
          {agent.agentType === 'trustEdge' ? (
            <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--theme-text-muted)' }} />
          ) : (
            <Cpu className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--theme-text-secondary)' }} />
          )}
          <div>
            <div className="text-xs font-medium" style={{ color: 'var(--theme-text)' }}>
              {agent.hostname}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>
              {agent.ip}
            </div>
          </div>
        </div>
      </td>
      <td className="py-2.5 pr-4">
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
          style={{ backgroundColor: badge.bg, color: badge.color }}
        >
          {badge.label}
        </span>
      </td>
      <td className="py-2.5 pr-4">
        <span className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
          {agent.currentAlgorithm === 'None' ? (
            <span style={{ color: '#E5753C' }}>—</span>
          ) : (
            agent.currentAlgorithm
          )}
        </span>
      </td>
      <td className="py-2.5 pr-4">
        <span className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>
          {agent.memoryKB >= 1000
            ? `${(agent.memoryKB / 1024).toFixed(0)} MB`
            : `${agent.memoryKB} KB`}
        </span>
      </td>
      <td className="py-2.5">
        <div className="flex items-center gap-1.5">
          {isMissed ? (
            <WifiOff className="w-3 h-3" style={{ color: '#E5753C' }} />
          ) : (
            <Wifi className="w-3 h-3" style={{ color: 'var(--theme-text-muted)' }} />
          )}
          <span
            className="text-[10px]"
            style={{ color: isMissed ? '#E5753C' : 'var(--theme-text-muted)' }}
          >
            {heartbeatLabel(effectiveOffset)}
          </span>
        </div>
      </td>
    </tr>
  );
}

export default function KernelAgentPanel() {
  const [expanded, setExpanded] = useState(true);
  const [tick, setTick] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTick((t) => t + 1);
    }, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const trustEdgeAgents = kernelAgents.filter((a) => a.agentType === 'trustEdge');
  const kernelModuleAgents = kernelAgents.filter((a) => a.agentType === 'kernelModule');
  const noCertAgents = kernelAgents.filter((a) => a.certStatus === 'none');

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
        style={{ borderBottom: expanded ? '1px solid var(--theme-card-border)' : 'none' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1">
            <div className="agent-icon-circle w-7 h-7 rounded-full flex items-center justify-center z-10">
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: 'var(--theme-text-muted)' }} />
            </div>
            <div className="agent-icon-circle w-7 h-7 rounded-full flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5" style={{ color: 'var(--theme-text-secondary)' }} />
            </div>
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
              Agent Coverage
            </div>
            <div className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>
              {trustEdgeAgents.length} TrustEdge · {kernelModuleAgents.length} Kernel Module
              {noCertAgents.length > 0 && (
                <span className="ml-2 agent-no-cert-label">
                  · {noCertAgents.length} No-Cert Detected
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <div className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--theme-card-inner)', color: 'var(--theme-text-secondary)' }}>
              <ShieldCheck className="w-3 h-3" />
              TrustEdge: {trustEdgeAgents.length}
            </div>
            <div className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--theme-card-inner)', color: 'var(--theme-text-muted)' }}>
              <Cpu className="w-3 h-3" />
              Kernel Mod: {kernelModuleAgents.length}
            </div>
            {noCertAgents.length > 0 && (
              <div className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--theme-card-inner)', color: '#E5753C' }}>
                <AlertTriangle className="w-3 h-3" />
                No Cert: {noCertAgents.length}
              </div>
            )}
          </div>
          {expanded ? (
            <ChevronUp className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
          )}
        </div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 pt-2">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      {['Device / Agent', 'Cert Status', 'Algorithm', 'Memory', 'Heartbeat'].map((h) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-semibold uppercase tracking-wider pb-2 pr-4"
                          style={{ color: 'var(--theme-text-dim)' }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {kernelAgents.map((agent) => (
                      <AgentRow key={agent.id} agent={agent} tick={tick} />
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className="mt-3 flex items-center gap-2 text-[10px] pt-3"
                style={{ borderTop: '1px solid var(--theme-card-border)', color: 'var(--theme-text-dim)' }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live telemetry · Heartbeat every 5s · Chunked upload — battery efficient
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
