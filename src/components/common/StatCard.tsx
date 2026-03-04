import GlassCard from './GlassCard';
import AnimatedNumber from './AnimatedNumber';
import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  value: number;
  format?: (n: number) => string;
  icon: LucideIcon;
  iconColor?: string;
  suffix?: string;
  delay?: number;
  trend?: 'up' | 'down';
}

export default function StatCard({ label, value, format, icon: Icon, suffix, delay = 0, trend }: Props) {
  return (
    <GlassCard className="p-5" delay={delay}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider mb-2" style={{ color: 'var(--theme-text-muted)' }}>{label}</p>
          <div className="flex items-baseline gap-1">
            <AnimatedNumber value={value} format={format} className="text-2xl font-bold" />
            {suffix && <span className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>{suffix}</span>}
          </div>
          {trend && (
            <div className="mt-1 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
              {trend === 'down' ? '↓' : '↑'} vs pre-migration
            </div>
          )}
        </div>
        <Icon className="w-5 h-5" style={{ color: 'var(--theme-text-dim)' }} />
      </div>
    </GlassCard>
  );
}
