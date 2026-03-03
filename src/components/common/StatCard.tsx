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

export default function StatCard({ label, value, format, icon: Icon, iconColor = '#0C6DFD', suffix, delay = 0, trend }: Props) {
  return (
    <GlassCard className="p-5" delay={delay}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">{label}</p>
          <div className="flex items-baseline gap-1">
            <AnimatedNumber value={value} format={format} className="text-2xl font-bold text-white" />
            {suffix && <span className="text-sm text-slate-400">{suffix}</span>}
          </div>
          {trend && (
            <div className={`mt-1 text-xs ${trend === 'down' ? 'text-emerald-400' : 'text-red-400'}`}>
              {trend === 'down' ? '↓' : '↑'} vs pre-migration
            </div>
          )}
        </div>
        <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${iconColor}20` }}>
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
      </div>
    </GlassCard>
  );
}
