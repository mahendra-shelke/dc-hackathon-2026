import type { PqcStatus, RiskLevel } from '../../types';

const pqcStyles: Record<PqcStatus, string> = {
  'ready': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'hybrid': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'not-ready': 'bg-red-500/20 text-red-400 border-red-500/30',
};

const pqcLabels: Record<PqcStatus, string> = {
  'ready': 'PQC Ready',
  'hybrid': 'Hybrid',
  'not-ready': 'Not Ready',
};

const riskStyles: Record<RiskLevel, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

export function PqcBadge({ status }: { status: PqcStatus }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full border ${pqcStyles[status]}`}>
      {pqcLabels[status]}
    </span>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full border capitalize ${riskStyles[level]}`}>
      {level}
    </span>
  );
}
