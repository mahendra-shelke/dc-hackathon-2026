import { NavLink, useLocation } from 'react-router';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Clock, Grid3X3, FlaskConical,
  FileKey, GitBranch, Play, RotateCcw, Shield, Radar,
  Palette, Check,
} from 'lucide-react';
import { useSimulation } from '../../hooks/useSimulation';
import { useTheme, themes } from '../../hooks/useTheme';
import { useState } from 'react';

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
  const { theme, setTheme, isLight } = useTheme();
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 backdrop-blur-xl flex flex-col z-50 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--theme-sidebar)',
        borderRight: '1px solid var(--theme-sidebar-border)',
      }}
    >
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: '1px solid var(--theme-sidebar-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#0C6DFD] flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide" style={{ color: 'var(--theme-text)' }}>DigiCert</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>PQC Fleet Readiness</div>
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
              <item.icon
                className="w-4 h-4 relative z-10 transition-colors"
                style={{ color: isActive ? '#0C6DFD' : 'var(--theme-text-muted)' }}
              />
              <span
                className={`relative z-10 transition-colors ${isActive ? 'font-medium' : ''}`}
                style={{ color: isActive ? 'var(--theme-text)' : 'var(--theme-text-muted)' }}
              >
                {item.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      {/* Theme Switcher */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setThemeOpen(!themeOpen)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
          style={{
            color: 'var(--theme-text-muted)',
            backgroundColor: themeOpen ? 'var(--theme-card)' : 'transparent',
          }}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Theme</span>
          <span className="ml-auto text-[10px] capitalize" style={{ color: 'var(--theme-text-dim)' }}>
            {themes.find((t) => t.id === theme)?.label}
          </span>
        </button>
        {themeOpen && (
          <div className="mt-1 space-y-0.5 px-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs transition-colors"
                style={{
                  backgroundColor: theme === t.id ? 'var(--theme-card)' : 'transparent',
                  color: 'var(--theme-text-secondary)',
                }}
              >
                <div
                  className="w-4 h-4 rounded-full border-2 shrink-0"
                  style={{
                    backgroundColor: t.preview,
                    borderColor: theme === t.id ? '#0C6DFD' : 'var(--theme-card-border)',
                  }}
                />
                <span className="flex-1 text-left">{t.label}</span>
                {theme === t.id && <Check className="w-3 h-3 text-[#0C6DFD]" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Simulation Button */}
      <div className="p-4" style={{ borderTop: '1px solid var(--theme-sidebar-border)' }}>
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
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--theme-text-muted)' }}>
              <span>Migrating...</span>
              <span>{Math.round(state.progress * 100)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-colors"
            style={{
              backgroundColor: isLight ? '#e2e8f0' : '#334155',
              color: 'var(--theme-text)',
            }}
          >
            <RotateCcw className="w-4 h-4" />
            Reset Simulation
          </button>
        )}
      </div>
    </aside>
  );
}
