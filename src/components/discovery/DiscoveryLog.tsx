import { useEffect, useRef } from 'react';
import { useDiscovery } from '../../hooks/useDiscovery';

const typeColors: Record<string, string> = {
  info: 'text-slate-300',
  success: 'text-emerald-400',
  warning: 'text-yellow-400',
  error: 'text-red-400',
};

export default function DiscoveryLog() {
  const { state } = useDiscovery();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [state.logEntries.length]);

  return (
    <div
      ref={scrollRef}
      className="bg-slate-900/80 rounded-lg border border-slate-700/50 p-4 font-mono text-xs overflow-y-auto"
      style={{ maxHeight: 280, minHeight: 280 }}
    >
      {state.logEntries.length === 0 && (
        <p className="text-slate-600 italic">Waiting for scan to begin...</p>
      )}
      {state.logEntries.map((entry) => (
        <div key={entry.id} className="flex gap-2 py-0.5 leading-relaxed">
          <span className="text-slate-600 shrink-0">[{entry.timestamp}]</span>
          <span className={typeColors[entry.type]}>{entry.message}</span>
        </div>
      ))}
      {(state.pipelineStep === 'discovering' || state.pipelineStep === 'assessing' || state.pipelineStep === 'deploying') &&
        state.discoveryProgress < 100 && state.assessmentProgress < 100 && state.deploymentProgress < 100 && (
        <span className="inline-block w-2 h-3.5 bg-emerald-400 animate-pulse ml-1" />
      )}
    </div>
  );
}
