import { motion } from 'framer-motion';
import {
  Shield, AlertTriangle, Clock, BookOpen, ArrowRight,
  ShieldOff, Cpu, Server, ChevronRight,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { deviceGroups } from '../data/devices';
import { useSimulation } from '../hooks/useSimulation';
import { useStory } from '../hooks/useStory';
import AnimatedNumber from '../components/common/AnimatedNumber';
import { totalDevices, countByRisk, daysUntil, formatNumber } from '../utils';

const CNSA_DEADLINE = new Date('2027-01-01');
const TODAY = new Date();
const WEEKS_REMAINING = Math.floor(
  (CNSA_DEADLINE.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24 * 7),
);

const problems = [
  {
    icon: ShieldOff,
    headline: 'Devices with no crypto identity',
    subtext: 'No certificate. No key material. No visibility. These are your biggest unknown.',
    stat: deviceGroups.filter((d) => d.certStatus === 'none').reduce((s, d) => s + d.count, 0),
    statLabel: 'uncredentialed devices',
  },
  {
    icon: AlertTriangle,
    headline: 'Critical-risk devices running expired algorithms',
    subtext: 'RSA-2048 and ECDSA are disallowed under CNSA 2.0. Most of your fleet still uses them.',
    stat: null,
    statLabel: 'using deprecated algos',
  },
  {
    icon: Clock,
    headline: 'No clear path to the deadline',
    subtext: 'Jan 1, 2027 is the CNSA 2.0 compliance target. Without a blueprint, you won\'t make it.',
    stat: WEEKS_REMAINING,
    statLabel: 'weeks to deadline',
  },
];

const solutionSteps = [
  {
    step: '01',
    title: 'Discover Everything',
    detail: 'TrustEdge for capable devices. A lightweight Kernel Module for brownfield hardware that can\'t run a full agent. Both phone home with cert status, memory, firmware version — including devices with zero cryptographic identity.',
    route: '/discovery',
  },
  {
    step: '02',
    title: 'Know Your Deadline',
    detail: 'NIST-standardized PQC algorithms (ML-KEM, ML-DSA) are ready. RSA and ECDSA have expiry dates. The Algorithm Intel page shows every classical algorithm\'s sunset date and the right PQC replacement for each device class.',
    route: '/algorithms',
  },
  {
    step: '03',
    title: 'Follow the Blueprint',
    detail: 'An ordered, device-aware migration plan tells you exactly what to do first, second, and third — and whether your current velocity will meet the CNSA 2.0 deadline.',
    route: '/blueprint',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { openPanel, goToChapter } = useStory();
  const { state } = useSimulation();
  const total = totalDevices(deviceGroups);
  const critical = countByRisk(deviceGroups, 'critical');
  const noCert = deviceGroups.filter((d) => d.certStatus === 'none').reduce((s, d) => s + d.count, 0);
  const cnsaDays = daysUntil('2027-01-01');
  const readinessPct = Math.round(state.readinessScore);

  function startGuidedTour() {
    openPanel();
    goToChapter(1);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div
        className="relative px-10 pt-14 pb-12"
        style={{ borderBottom: '1px solid var(--theme-card-border)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl"
        >
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-5"
            style={{
              backgroundColor: 'var(--theme-card)',
              border: '1px solid var(--theme-card-border)',
              color: 'var(--theme-text-secondary)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5753C]" />
            CNSA 2.0 Deadline: January 1, 2027 — {WEEKS_REMAINING} weeks away
          </div>

          <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: 'var(--theme-text)' }}>
            Your IoT fleet is not ready<br />for the quantum threat.
          </h1>
          <p className="text-lg mb-8 max-w-2xl" style={{ color: 'var(--theme-text-muted)' }}>
            Most brownfield devices run weak cryptography. Many have no certificates at all.
            DigiCert's PQC Fleet Platform discovers, assesses, and migrates your entire fleet
            — including devices that can't run a full agent.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={startGuidedTour}
              className="flex items-center gap-2.5 px-6 py-3 text-sm font-semibold rounded-xl transition-colors"
              style={{
                backgroundColor: 'var(--theme-text)',
                color: 'var(--theme-bg)',
              }}
            >
              <BookOpen className="w-4 h-4" />
              Start Guided Tour
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/blueprint')}
              className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium rounded-xl transition-colors"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--theme-card-border)',
                color: 'var(--theme-text-secondary)',
              }}
            >
              View Readiness Blueprint
            </button>
          </div>
        </motion.div>
      </div>

      <div className="px-10 py-8 space-y-10 max-w-6xl">
        {/* Key metrics bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-4 gap-4"
        >
          {[
            { label: 'Total Devices', value: total, format: formatNumber, icon: Server },
            { label: 'No Crypto Identity', value: noCert, format: formatNumber, icon: ShieldOff },
            { label: 'Critical Risk', value: critical, format: formatNumber, icon: AlertTriangle },
            { label: 'Days to CNSA 2.0', value: cnsaDays, format: undefined, icon: Clock },
          ].map(({ label, value, format, icon: Icon }) => (
            <div
              key={label}
              className="rounded-2xl p-5"
              style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-3.5 h-3.5" style={{ color: 'var(--theme-text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>{label}</span>
              </div>
              <span className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
                <AnimatedNumber value={value} format={format} className="" />
              </span>
            </div>
          ))}
        </motion.div>

        {/* Readiness meter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                Fleet PQC Readiness
              </div>
              <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                Run "Simulate Migration" in the sidebar to see the fleet progress
              </div>
            </div>
            <div className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
              {readinessPct}%
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--theme-text-secondary)' }}
              initial={{ width: 0 }}
              animate={{ width: `${readinessPct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>
            <span>0% — Not Started</span>
            <span>100% — CNSA 2.0 Compliant</span>
          </div>
        </motion.div>

        {/* Three problems */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl font-bold mb-5"
            style={{ color: 'var(--theme-text)' }}
          >
            The three problems your security team can't see
          </motion.h2>
          <div className="grid grid-cols-3 gap-4">
            {problems.map((p, i) => (
              <motion.div
                key={p.headline}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                className="rounded-2xl p-5"
                style={{
                  backgroundColor: 'var(--theme-card)',
                  border: '1px solid var(--theme-card-border)',
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E5753C]" />
                  <p.icon className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                </div>
                <div className="text-sm font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>
                  {p.headline}
                </div>
                <div className="text-xs leading-relaxed mb-3" style={{ color: 'var(--theme-text-muted)' }}>
                  {p.subtext}
                </div>
                {p.stat !== null && (
                  <div
                    className="text-2xl font-bold"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    {p.stat.toLocaleString()}
                    <span className="text-xs font-normal ml-2" style={{ color: 'var(--theme-text-dim)' }}>
                      {p.statLabel}
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Solution steps */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-xl font-bold mb-5"
            style={{ color: 'var(--theme-text)' }}
          >
            How DigiCert solves it
          </motion.h2>
          <div className="grid grid-cols-3 gap-4">
            {solutionSteps.map((s, i) => (
              <motion.button
                key={s.step}
                type="button"
                onClick={() => navigate(s.route)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 + i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left rounded-2xl p-5 group transition-all"
                style={{
                  backgroundColor: 'var(--theme-card)',
                  border: '1px solid var(--theme-card-border)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="text-3xl font-black"
                    style={{ color: 'var(--theme-text-dim)' }}
                  >
                    {s.step}
                  </span>
                  <ChevronRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--theme-text-muted)' }}
                  />
                </div>
                <div className="text-sm font-bold mb-2" style={{ color: 'var(--theme-text)' }}>
                  {s.title}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                  {s.detail}
                </div>
                <div
                  className="mt-4 text-[11px] font-semibold flex items-center gap-1"
                  style={{ color: '#E5753C' }}
                >
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Guided tour CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl p-8 flex items-center justify-between"
          style={{
            backgroundColor: 'var(--theme-card)',
            border: '1px solid var(--theme-card-border)',
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: 'var(--theme-card-inner)' }}
            >
              <Shield className="w-6 h-6" style={{ color: 'var(--theme-text-muted)' }} />
            </div>
            <div>
              <div className="text-base font-bold mb-1" style={{ color: 'var(--theme-text)' }}>
                Ready for the full walkthrough?
              </div>
              <div className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                The guided tour walks you through all 6 chapters — problem, discovery, deadlines, blueprint, algorithm selection, and proof.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={startGuidedTour}
            className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3 text-sm font-semibold rounded-xl transition-colors ml-6"
            style={{
              backgroundColor: 'var(--theme-text)',
              color: 'var(--theme-bg)',
            }}
          >
            <BookOpen className="w-4 h-4" />
            Start Guided Tour
          </button>
        </motion.div>

        {/* Agent coverage teaser */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="grid grid-cols-2 gap-4 pb-10"
        >
          {[
            {
              icon: Shield,
              title: 'TrustEdge Agent',
              tag: 'Full-capability devices',
              points: ['Certificate lifecycle — issue, renew, revoke', 'Full PQC + hybrid cert deployment', 'Policy enforcement & compliance attestation'],
              req: 'Requires ≥ 256KB RAM, firmware update capable',
            },
            {
              icon: Cpu,
              title: 'Kernel Module + SDK',
              tag: 'Brownfield IoT — constrained hardware',
              points: ['Telemetry-only: cert status, RAM, CPU, firmware hash', 'Runs on ≥ 8KB RAM — no OS requirement', 'SDK in Python, C, Go — embed into existing firmware'],
              req: 'Works on UART / BLE / NB-IoT',
            },
          ].map(({ icon: Icon, title, tag, points, req }) => (
            <div
              key={title}
              className="rounded-2xl p-5"
              style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: 'var(--theme-card-inner)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                </div>
                <div>
                  <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>{title}</div>
                  <div className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>{tag}</div>
                </div>
              </div>
              <ul className="space-y-1.5 mb-3">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-xs" style={{ color: 'var(--theme-text-secondary)' }}>
                    <span className="mt-0.5 text-[10px]" style={{ color: '#E5753C' }}>✓</span>
                    {p}
                  </li>
                ))}
              </ul>
              <div
                className="text-[10px] px-2.5 py-1.5 rounded-lg"
                style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text-dim)' }}
              >
                {req}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
