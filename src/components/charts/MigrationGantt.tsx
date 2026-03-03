import { motion } from 'framer-motion';
import { migrationTimelines } from '../../data/migration';
import { industries } from '../../data/industries';
import type { MigrationPhase } from '../../types';

const phaseColors: Record<MigrationPhase, string> = {
  discover: '#0C6DFD',
  test: '#8B5CF6',
  'deploy-hybrid': '#F97316',
  'full-pqc': '#10B981',
};

const totalMonths = 60; // 5 years
const startYear = 2026;

export default function MigrationGantt() {
  return (
    <div className="space-y-6">
      {/* Timeline header */}
      <div className="flex items-end pl-32">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-1 text-xs text-slate-500 border-l border-slate-700/30 pl-1">
            {startYear + i}
          </div>
        ))}
      </div>

      {/* Industry rows */}
      {migrationTimelines.map((timeline, rowIdx) => {
        const ind = industries.find((i) => i.id === timeline.industry)!;
        return (
          <div key={timeline.industry} className="flex items-center gap-2">
            {/* Label */}
            <div className="w-28 shrink-0 text-right pr-2">
              <div className="text-sm font-medium text-white">{ind.label.split(' / ')[0]}</div>
              <div className="text-[10px] text-slate-500">{ind.totalDevices.toLocaleString()} devices</div>
            </div>

            {/* Gantt bars */}
            <div className="flex-1 relative h-10 bg-slate-800/20 rounded-lg overflow-hidden border border-slate-700/20">
              {/* Vertical year lines */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 border-l border-slate-700/20"
                  style={{ left: `${((i + 1) * 12 / totalMonths) * 100}%` }}
                />
              ))}

              {/* Phase bars */}
              {timeline.phases.map((phase, phaseIdx) => {
                const left = (phase.startMonth / totalMonths) * 100;
                const width = (phase.durationMonths / totalMonths) * 100;
                return (
                  <motion.div
                    key={phase.phase}
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: `${width}%`, opacity: 1 }}
                    transition={{ delay: rowIdx * 0.15 + phaseIdx * 0.1, duration: 0.6 }}
                    className="absolute top-1 bottom-1 rounded-md flex items-center justify-center"
                    style={{
                      left: `${left}%`,
                      backgroundColor: phaseColors[phase.phase],
                      opacity: 0.85,
                    }}
                    title={`${phase.label}: ${phase.product}`}
                  >
                    <span className="text-[9px] font-semibold text-white/90 truncate px-1">
                      {phase.label.split(' ')[0]}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Deadline markers */}
      <div className="flex items-end pl-32 relative">
        <div className="flex-1 relative h-8">
          {/* CNSA 2.0 - Jan 2027 = month 12 */}
          <div className="absolute" style={{ left: `${(12 / totalMonths) * 100}%` }}>
            <div className="w-px h-6 bg-yellow-400/60 mx-auto" />
            <div className="text-[10px] text-yellow-400 font-medium whitespace-nowrap -translate-x-1/2">CNSA 2.0</div>
          </div>
          {/* EU CRA - 2027 */}
          <div className="absolute" style={{ left: `${(18 / totalMonths) * 100}%` }}>
            <div className="w-px h-6 bg-orange-400/60 mx-auto" />
            <div className="text-[10px] text-orange-400 font-medium whitespace-nowrap -translate-x-1/2">EU CRA</div>
          </div>
          {/* Full compliance 2033 */}
          <div className="absolute" style={{ left: `${(56 / totalMonths) * 100}%` }}>
            <div className="w-px h-6 bg-emerald-400/60 mx-auto" />
            <div className="text-[10px] text-emerald-400 font-medium whitespace-nowrap -translate-x-1/2">Full PQC Target</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-700/30">
        {Object.entries(phaseColors).map(([phase, color]) => (
          <div key={phase} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
            <span className="text-xs text-slate-400 capitalize">{phase.replace(/-/g, ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
