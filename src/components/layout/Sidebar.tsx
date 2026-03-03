import { NavLink, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Clock, Grid3X3, FlaskConical,
  FileKey, GitBranch, Play, RotateCcw, Shield, Radar,
} from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Executive Dashboard' },
  { to: '/discovery', icon: Radar, label: 'Discovery' },
  { to: '/hndl', icon: Clock, label: 'HNDL Risk Timeline' },
  { to: '/fleet', icon: Grid3X3, label: 'Fleet Heatmap' },
  { to: '/algorithms', icon: FlaskConical, label: 'Algorithm Matrix' },
  { to: '/certificates', icon: FileKey, label: 'Certificate Impact' },
  { to: '/migration', icon: GitBranch, label: 'Migration Sequencer' },
];

export default function Sidebar() {
  const location = useLocation();
  const { state, isSimulated, startSimulation, resetSimulation } = useSimulation();

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 flex flex-col z-50">
      {/* Logo */}
      <div className="p-5 border-b border-slate-700/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0C6DFD] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white tracking-wide">DigiCert</div>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest">PQC Fleet Readiness</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors group"
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-[#0C6DFD]/15 border border-[#0C6DFD]/30 rounded-lg"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-[#0C6DFD]' : 'text-slate-400 group-hover:text-slate-200'}`} />
              <span className={`relative z-10 ${isActive ? 'text-white font-medium' : 'text-slate-400 group-hover:text-slate-200'}`}>
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Simulation Button */}
      <div className="p-4 border-t border-slate-700/50">
        {!isSimulated && !state.isRunning && (
          <button
            onClick={startSimulation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0C6DFD] hover:bg-[#0955CC] text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            Simulate Migration
          </button>
        )}
        {state.isRunning && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Migrating...</span>
              <span>{Math.round(state.progress * 100)}%</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#0C6DFD] rounded-full"
                style={{ width: `${state.progress * 100}%` }}
              />
            </div>
          </div>
        )}
        {isSimulated && !state.isRunning && (
          <button
            onClick={resetSimulation}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Simulation
          </button>
        )}
      </div>
    </aside>
  );
}
