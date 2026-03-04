import { motion } from 'framer-motion';
import {
  Map, CheckCircle2, Lock, Server, Cpu, Radio,
  ShieldCheck, AlertTriangle, TrendingUp, Clock, Users,
  ChevronRight,
} from 'lucide-react';
import { blueprintSteps } from '../data/blueprint';
import { deviceGroups } from '../data/devices';
import { useSimulation } from '../hooks/useSimulation';
import type { BlueprintStep } from '../types';

const CNSA_DEADLINE = new Date('2027-01-01');
const TODAY = new Date();
const WEEKS_REMAINING = Math.floor(
  (CNSA_DEADLINE.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24 * 7),
);

const TOTAL_DEVICES = deviceGroups.reduce((s, d) => s + d.count, 0);
const MIGRATION_VELOCITY = 420; // devices per week (static for demo)

// Verdict returns a color token string — resolved in JSX via style or class
function getProjectedCompletion(devicesReady: number): {
  date: Date;
  weeksLeft: number;
  verdict: 'on-track' | 'at-risk' | 'miss';
  label: string;
  // color is now a CSS variable string or the single accent hex
  color: string;
} {
  const remaining = TOTAL_DEVICES - devicesReady;
  const weeksNeeded = Math.ceil(remaining / MIGRATION_VELOCITY);
  const projectedDate = new Date(TODAY.getTime() + weeksNeeded * 7 * 24 * 60 * 60 * 1000);
  const buffer = WEEKS_REMAINING - weeksNeeded;

  if (buffer >= 8) {
    // on-track → plain off-white text, no accent needed
    return { date: projectedDate, weeksLeft: weeksNeeded, verdict: 'on-track', label: 'On Track', color: 'var(--theme-text)' };
  } else if (buffer >= 0) {
    // at-risk → subdued secondary text
    return { date: projectedDate, weeksLeft: weeksNeeded, verdict: 'at-risk', label: 'At Risk', color: 'var(--theme-text-secondary)' };
  } else {
    // miss → the one place the orange accent is permitted
    return { date: projectedDate, weeksLeft: weeksNeeded, verdict: 'miss', label: 'Will Miss Deadline', color: '#E5753C' };
  }
}

const stepIcons = [Radio, AlertTriangle, Server, ShieldCheck, Cpu, CheckCircle2];

function StepCard({ step, index }: { step: BlueprintStep; index: number }) {
  const Icon = stepIcons[index];
  const isDone = step.status === 'done';
  const isActive = step.status === 'active';
  const isLocked = step.status === 'locked';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="relative flex gap-4"
    >
      {/* Connector line */}
      {index < blueprintSteps.length - 1 && (
        <div
          className="absolute left-[21px] top-[44px] bottom-[-16px] w-0.5"
          style={{ backgroundColor: 'var(--theme-card-border)' }}
        />
      )}

      {/* Step icon */}
      <div
        className="relative w-11 h-11 rounded-full flex-shrink-0 flex items-center justify-center z-10 mt-1"
        style={{
          backgroundColor: 'var(--theme-card)',
          border: `2px solid ${isActive ? 'var(--theme-text-secondary)' : 'var(--theme-card-border)'}`,
          opacity: isLocked ? 0.55 : 1,
        }}
      >
        {isDone ? (
          <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--theme-text-secondary)' }} />
        ) : isLocked ? (
          <Lock className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
        ) : (
          <Icon className="w-5 h-5" style={{ color: 'var(--theme-text-muted)' }} />
        )}
      </div>

      {/* Content */}
      <div
        className="flex-1 rounded-xl p-4 mb-4"
        style={{
          backgroundColor: 'var(--theme-card)',
          border: `1px solid ${isActive ? 'var(--theme-text-secondary)' : 'var(--theme-card-border)'}`,
          opacity: isLocked ? 0.6 : 1,
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-[10px] font-bold uppercase tracking-widest"
                style={{ color: 'var(--theme-text-dim)' }}
              >
                Step {step.id}
              </span>

              {/* Done badge */}
              {isDone && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                  style={{
                    backgroundColor: 'var(--theme-card-border)',
                    color: 'var(--theme-text-secondary)',
                  }}
                >
                  Done
                </span>
              )}

              {/* In Progress badge — single orange accent use */}
              {isActive && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                  style={{ backgroundColor: 'rgba(229,117,60,0.15)', color: '#E5753C' }}
                >
                  In Progress
                </span>
              )}

              {/* Upcoming badge */}
              {isLocked && (
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                  style={{
                    backgroundColor: 'var(--theme-card-border)',
                    color: 'var(--theme-text-dim)',
                  }}
                >
                  Upcoming
                </span>
              )}
            </div>
            <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
              {step.title}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>
              {step.deviceCount.toLocaleString()}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>
              devices
            </div>
          </div>
        </div>
        <p className="text-xs leading-relaxed mb-3" style={{ color: 'var(--theme-text-secondary)' }}>
          {step.description}
        </p>
        <div className="flex flex-wrap gap-2 items-center">
          <span
            className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md"
            style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text-muted)' }}
          >
            <Users className="w-3 h-3" />
            {step.agentTool}
          </span>
          <span
            className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md"
            style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text-muted)' }}
          >
            <Clock className="w-3 h-3" />
            {step.timeWindowWeeks}w window
          </span>
          {step.deviceClasses.map((dc) => (
            <span
              key={dc}
              className="text-[10px] px-2 py-1 rounded-md capitalize"
              style={{ backgroundColor: 'var(--theme-card-border)', color: 'var(--theme-text-dim)' }}
            >
              {dc}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function BlueprintPage() {
  const { state } = useSimulation();
  const devicesReady = Math.floor(TOTAL_DEVICES * (state.readinessScore / 100));
  const projection = getProjectedCompletion(devicesReady);
  const progressPercent = Math.round((devicesReady / TOTAL_DEVICES) * 100);
  const noCertCount = deviceGroups
    .filter((d) => d.certStatus === 'none')
    .reduce((s, d) => s + d.count, 0);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - progressPercent / 100);

  // Verdict pill styling: only "miss" gets orange; others stay monochrome
  const verdictPillStyle: Record<string, React.CSSProperties> = {
    'on-track': {
      backgroundColor: 'var(--theme-card-border)',
      color: 'var(--theme-text)',
    },
    'at-risk': {
      backgroundColor: 'var(--theme-card-border)',
      color: 'var(--theme-text-secondary)',
    },
    miss: {
      backgroundColor: 'rgba(229,117,60,0.15)',
      color: '#E5753C',
    },
  };

  // KPI icon colors: all muted, no bright hues
  const kpiIcons = [
    { label: 'Total Fleet Devices', value: TOTAL_DEVICES.toLocaleString(), sub: 'across all industries', icon: Server },
    { label: 'Devices Migrated', value: devicesReady.toLocaleString(), sub: `${TOTAL_DEVICES - devicesReady} remaining`, icon: TrendingUp },
    { label: 'No Crypto Identity', value: noCertCount.toLocaleString(), sub: 'devices with zero certs', icon: AlertTriangle },
    { label: 'Weeks to Deadline', value: WEEKS_REMAINING, sub: 'CNSA 2.0 — Jan 1, 2027', icon: Clock },
  ];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <Map className="w-6 h-6" style={{ color: 'var(--theme-text-muted)' }} />
          <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
            PQC Readiness Blueprint
          </h1>
        </div>
        <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
          A device-aware, ordered migration plan. Will your fleet meet the CNSA 2.0 deadline?
        </p>
      </motion.div>

      {/* Top row — projection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Progress arc */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-6 flex flex-col items-center justify-center"
          style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
        >
          <div className="relative w-32 h-32 mb-3">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              {/* Track ring */}
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                strokeWidth="8"
                style={{ stroke: 'var(--theme-bar-bg)' }}
              />
              {/* Progress arc — secondary text tone, or orange on miss */}
              <motion.circle
                cx="60" cy="60" r="54"
                fill="none"
                strokeWidth="8"
                stroke={projection.verdict === 'miss' ? '#E5753C' : 'var(--theme-text-secondary)'}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--theme-text)' }}>
                {progressPercent}%
              </div>
              <div className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--theme-text-muted)' }}>
                migrated
              </div>
            </div>
          </div>

          {/* Verdict pill */}
          <div
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={verdictPillStyle[projection.verdict]}
          >
            {projection.label}
          </div>
        </motion.div>

        {/* KPI cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3">
          {kpiIcons.map(({ label, value, sub, icon: Icon }) => (
            <div
              key={label}
              className="rounded-xl p-4 flex flex-col gap-1"
              style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                <span className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>{label}</span>
              </div>
              <div className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
                {value}
              </div>
              <div className="text-[11px]" style={{ color: 'var(--theme-text-dim)' }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Migration velocity bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl px-5 py-4 flex items-center gap-4"
        style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
      >
        <TrendingUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--theme-text-muted)' }} />
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span style={{ color: 'var(--theme-text-secondary)' }}>
              Current migration velocity:{' '}
              <strong className="blueprint-velocity-strong">{MIGRATION_VELOCITY} devices/week</strong>
            </span>
            {/* Projected date: orange only when missing deadline */}
            <span
              style={{
                color: projection.verdict === 'miss' ? '#E5753C' : 'var(--theme-text-secondary)',
              }}
            >
              Projected completion:{' '}
              {projection.date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--theme-text-secondary)' }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Action pill — orange only on miss verdict */}
        <div
          className="flex-shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
          style={
            projection.verdict === 'miss'
              ? { backgroundColor: 'rgba(229,117,60,0.15)', color: '#E5753C' }
              : { backgroundColor: 'var(--theme-card-border)', color: 'var(--theme-text-secondary)' }
          }
        >
          <ChevronRight className="w-3.5 h-3.5" />
          {projection.verdict === 'miss' ? 'Increase velocity' : 'Maintain pace'}
        </div>
      </motion.div>

      {/* Blueprint steps */}
      <div>
        <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--theme-text)' }}>
          Migration Blueprint — Ordered Steps
        </h2>
        <div>
          {blueprintSteps.map((step, i) => (
            <StepCard key={step.id} step={step} index={i} />
          ))}
        </div>
      </div>

      {/* Two-agent strategy */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-base font-semibold mb-4" style={{ color: 'var(--theme-text)' }}>
          Two-Agent Strategy
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* TrustEdge Agent — neutral border, no blue */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center blueprint-agent-icon-bg">
                <ShieldCheck className="w-5 h-5" style={{ color: 'var(--theme-text-muted)' }} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>TrustEdge Agent</div>
                <div className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
                  Full-capability · Capable devices
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {[
                'Certificate lifecycle management (issue, renew, revoke)',
                'Full PQC cert deployment — hybrid and full-PQC modes',
                'Policy enforcement & compliance attestation',
                'Automatic rollback on failed deployment',
                'Real-time status reporting to Readiness Dashboard',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  <CheckCircle2
                    className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--theme-text-muted)' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div
              className="mt-4 rounded-lg px-3 py-2 text-xs"
              style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text-muted)' }}
            >
              Requires: ≥256KB RAM · Firmware update capable · Network reachable
            </div>
          </div>

          {/* Kernel Module + SDK — neutral border, orange accent only on icon */}
          <div
            className="rounded-2xl p-5"
            style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center blueprint-kernel-icon-bg">
                {/* One deliberate orange accent: the constrained-device icon */}
                <Cpu className="w-5 h-5" style={{ color: '#E5753C' }} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>Kernel Module + SDK</div>
                <div className="text-[11px]" style={{ color: 'var(--theme-text-secondary)' }}>
                  Lightweight · Brownfield devices
                </div>
              </div>
            </div>
            <ul className="space-y-2">
              {[
                'Telemetry-only: cert status, RAM, CPU, firmware hash',
                'Minimal footprint — as low as 8KB RAM, no TrustEdge dependency',
                'SDK in Python, C, Go — embed into existing firmware',
                'Supports ML-KEM-512 + FN-DSA-512 on constrained hardware',
                'Chunked data upload — battery and bandwidth efficient',
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 text-xs"
                  style={{ color: 'var(--theme-text-secondary)' }}
                >
                  <CheckCircle2
                    className="w-3.5 h-3.5 flex-shrink-0 mt-0.5"
                    style={{ color: 'var(--theme-text-muted)' }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            <div
              className="mt-4 rounded-lg px-3 py-2 text-xs"
              style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text-muted)' }}
            >
              Works on: ≥8KB RAM · No OS requirement · UART / BLE / NB-IoT
            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
