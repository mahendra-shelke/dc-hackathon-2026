import { NavLink, useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, FlaskConical,
  Play, RotateCcw, Radar, Cpu,
  Palette, Check, Map, BookOpen, Shield,
} from 'lucide-react';
import DigiCertLogo from '../icons/DigiCertLogo';
import { useSimulation } from '../../hooks/useSimulation';
import { useTheme, themes } from '../../hooks/useTheme';
import { useStory } from '../../hooks/useStory';
import { useTrustEdge } from '../../hooks/useTrustEdge';
import { useState } from 'react';

// Core demo pages — keep this list short and executive-friendly
const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/kernel-module', icon: Cpu, label: 'Kernel Module + SDK' },
  { to: '/discovery', icon: Radar, label: 'Discovery' },
  { to: '/blueprint', icon: Map, label: 'Readiness Blueprint' },
  { to: '/algorithms', icon: FlaskConical, label: 'Algorithm Intel' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, isSimulated, startSimulation, resetSimulation } = useSimulation();
  const { theme, setTheme, isLight } = useTheme();
  const { isOpen, togglePanel } = useStory();
  const { isOpen: isTrustEdgeOpen, togglePanel: toggleTrustEdge } = useTrustEdge();
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 w-64 flex flex-col z-50 transition-colors duration-300"
      style={{
        backgroundColor: 'var(--theme-sidebar)',
        borderRight: '1px solid var(--theme-sidebar-border)',
      }}
    >
      {/* Logo */}
      <div className="p-5" style={{ borderBottom: '1px solid var(--theme-sidebar-border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden" style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}>
            <DigiCertLogo className="w-7 h-7" />
          </div>
          <div>
            <div className="text-sm font-bold tracking-wide" style={{ color: 'var(--theme-text)' }}>DigiCert</div>
            <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>PQC Migration Platform</div>
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
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon
                className="w-4 h-4 relative z-10 transition-colors"
                style={{ color: isActive ? 'var(--theme-text)' : 'var(--theme-text-muted)' }}
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
          type="button"
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
                type="button"
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
                    borderColor: theme === t.id ? 'var(--theme-text-secondary)' : 'var(--theme-card-border)',
                  }}
                />
                <span className="flex-1 text-left">{t.label}</span>
                {theme === t.id && <Check className="w-3 h-3" style={{ color: 'var(--theme-text)' }} />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Story Mode Toggle */}
      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={togglePanel}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
          style={{
            color: isOpen ? 'var(--theme-text)' : 'var(--theme-text-muted)',
            backgroundColor: isOpen ? 'var(--theme-card)' : 'transparent',
            border: isOpen ? '1px solid var(--theme-card-border)' : '1px solid transparent',
          }}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Story Mode</span>
          {isOpen && (
            <span className="ml-auto text-[10px] font-semibold" style={{ color: '#E5753C' }}>ON</span>
          )}
        </button>
      </div>

      {/* TrustEdge Toggle */}
      <div className="px-3 pb-2">
        <button
          type="button"
          onClick={toggleTrustEdge}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-colors"
          style={{
            color: isTrustEdgeOpen ? '#fff' : 'var(--theme-text-muted)',
            backgroundColor: isTrustEdgeOpen ? 'rgba(1, 116, 195, 0.2)' : 'transparent',
            border: isTrustEdgeOpen ? '1px solid rgba(0, 180, 255, 0.25)' : '1px solid transparent',
          }}
        >
          <Shield className="w-3.5 h-3.5" style={{ color: isTrustEdgeOpen ? '#00B4FF' : undefined }} />
          <span>TrustEdge</span>
          {isTrustEdgeOpen && (
            <span className="ml-auto text-[10px] font-semibold" style={{ color: '#00B4FF' }}>ON</span>
          )}
        </button>
      </div>

      {/* Simulation Button */}
      <div className="p-4" style={{ borderTop: '1px solid var(--theme-sidebar-border)' }}>
        {!isSimulated && !state.isRunning && (
          <button
            type="button"
            onClick={() => { startSimulation(); navigate('/blueprint'); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--theme-text)', color: 'var(--theme-bg)' }}
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
                className="h-full rounded-full"
                style={{ width: `${state.progress * 100}%`, backgroundColor: 'var(--theme-text-secondary)' }}
              />
            </div>
          </div>
        )}
        {isSimulated && !state.isRunning && (
          <button
            type="button"
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
