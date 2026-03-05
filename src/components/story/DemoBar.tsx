import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

/* ── Demo script ── */
interface DemoStep {
  route: string;
  title: string;
  action: string;   // brief "do this" instruction
  script: string;   // what to say
  onEnter?: () => void; // auto-action when step becomes active
}

const DEMO_STEPS: DemoStep[] = [
  /* ── Landing ── */
  {
    route: '/',
    title: 'Introduce Q-Shield',
    action: 'Point at the CNSA 2.0 deadline badge at the top',
    script:
      'This is DigiCert Q-Shield — a PQC Device Migration Assistant. CNSA 2.0 hits January 2027, roughly 90 weeks away. Every IoT device still running classical crypto becomes a liability.',
  },
  {
    route: '/',
    title: 'Three-step workflow',
    action: 'Point at the three step cards below',
    script:
      'Q-Shield gives your team a three-step workflow: Discover your fleet, review a migration blueprint, and track results. Let me walk through each one.',
  },

  /* ── SDK Solutions ── */
  {
    route: '/sdk-solutions',
    title: 'TrustEdge — Greenfield',
    action: 'TrustEdge card auto-expands',
    script:
      'TrustEdge is the full-featured agent for greenfield devices. A single binary — service plus CLI — that handles enrollment via EST or SCEP, automated cert renewal through Device Trust Manager, and secure MQTT. Runs on x64, ARM32, and ARM64.',
    onEnter: () => window.dispatchEvent(new CustomEvent('demo:expand-sdk', { detail: 'trustedge' })),
  },
  {
    route: '/sdk-solutions',
    title: 'TrustEdge Light — Brownfield',
    action: 'TrustEdge Light card auto-expands',
    script:
      'For brownfield and constrained devices — as little as 8 KB RAM, no OS — there\'s TrustEdge Light. It uses kernel hooks: NanoCrypto for PQC key generation, NanoROOT for certificate discovery, and NanoSSL for transport. Works over UART, BLE, or NB-IoT.',
    onEnter: () => window.dispatchEvent(new CustomEvent('demo:expand-sdk', { detail: 'trustcore-light' })),
  },

  /* ── Discovery ── */
  {
    route: '/discovery',
    title: 'Connect platforms',
    action: 'Point at connector cards, then toggle a few on',
    script:
      'Discovery is where the real work starts. Connect your IoT platforms — Azure IoT Hub, AWS IoT Core, Event Grid, or TrustEdge Light for direct device access.',
  },
  {
    route: '/discovery',
    title: 'Scan the fleet',
    action: 'Click "Scan Fleet" and let the progress bar fill',
    script:
      'Hit Scan Fleet. Q-Shield crawls each platform in parallel — pulling device metadata, current algorithms, cert status, and firmware update capabilities. Every device gets an automatic risk score.',
  },
  {
    route: '/discovery',
    title: 'Review discovered devices',
    action: 'Point at the device table — highlight a critical row',
    script:
      'We can already see which devices are running weak crypto — RSA-1024, pre-shared keys, no PKI identity. These are our critical risks. Let\'s move to the blueprint.',
  },

  /* ── Blueprint ── */
  {
    route: '/blueprint',
    title: 'Fleet summary',
    action: 'Point at summary cards at the top',
    script:
      'The Blueprint turns raw discovery data into an actionable plan. Summary at the top: total devices, how many use weak crypto, how many have no PKI identity, and weeks until the deadline.',
  },
  {
    route: '/blueprint',
    title: 'Deadline projection',
    action: 'Point at the projection arc',
    script:
      'The projection arc shows whether your current migration velocity will meet the CNSA 2.0 deadline. Green means on track, orange means at risk.',
  },
  {
    route: '/blueprint',
    title: 'Recommendations',
    action: 'Scroll to the recommendations table',
    script:
      'Prioritized recommendations — migrate RSA devices to ML-DSA-65 hybrid certs via TrustEdge, provision PQC identity for PSK devices via TrustEdge Light, and gateway-proxy non-updatable hardware.',
  },
  {
    route: '/blueprint',
    title: 'Run assessment',
    action: 'Click "Run Assessment" button',
    script:
      'One click runs a full readiness assessment. It projects whether your fleet will be CNSA 2.0 compliant by the deadline based on current migration velocity.',
  },

  /* ── Results ── */
  {
    route: '/results',
    title: 'Readiness score',
    action: 'Point at the readiness progress bar',
    script:
      'The Results page is the executive view. Your fleet PQC readiness score — updated after applying fixes — shows what percentage of devices are CNSA 2.0 compliant.',
  },
  {
    route: '/results',
    title: 'Risk & algorithm breakdown',
    action: 'Point at risk bars and algorithm list',
    script:
      'Risk breakdown by severity level, plus the full algorithm distribution across your fleet. Every device is accounted for.',
  },
  {
    route: '/results',
    title: 'Deprecation timeline',
    action: 'Scroll down to the timeline chart',
    script:
      'The deprecation timeline maps every classical algorithm against NIST and CNSA 2.0 milestones. The "Today" marker and 2027 deadline are highlighted. Anything still in your fleet is flagged directly on the chart.',
  },
  {
    route: '/results',
    title: 'Wrap up',
    action: 'Look at camera',
    script:
      'DigiCert Q-Shield: discover, assess, migrate — before the deadline hits.',
  },
];

/* ── Context ── */
import { createContext, useContext } from 'react';

interface DemoContextType {
  active: boolean;
  startDemo: () => void;
  stopDemo: () => void;
}

export const DemoContext = createContext<DemoContextType>({
  active: false,
  startDemo: () => {},
  stopDemo: () => {},
});
export const useDemoMode = () => useContext(DemoContext);

/* ── Component ── */
export default function DemoBar() {
  const { active, stopDemo } = useDemoMode();
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const current = DEMO_STEPS[step];
  const total = DEMO_STEPS.length;

  const goTo = useCallback(
    (idx: number) => {
      const clamped = Math.max(0, Math.min(total - 1, idx));
      setStep(clamped);
      if (DEMO_STEPS[clamped].route !== location.pathname) {
        navigate(DEMO_STEPS[clamped].route);
      }
    },
    [total, location.pathname, navigate],
  );

  /* Keyboard shortcuts */
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        goTo(step + 1);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo(step - 1);
      }
      if (e.key === 'Escape') {
        stopDemo();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [active, step, goTo]);

  /* Navigate on step change + fire onEnter */
  useEffect(() => {
    if (!active) return;
    const target = DEMO_STEPS[step];
    if (target.route !== location.pathname) {
      navigate(target.route);
    }
    // Fire onEnter with a small delay so the target page has mounted
    if (target.onEnter) {
      const t = setTimeout(target.onEnter, 120);
      return () => clearTimeout(t);
    }
  }, [active, step]); // intentionally minimal deps

  /* Reset step when activated */
  useEffect(() => {
    if (active) {
      setStep(0);
      navigate('/');
    }
  }, [active]); // intentionally minimal deps

  if (!active) return null;

  // Invisible — keyboard only (→ / Space = next, ← = back, Esc = stop)
  return null;
}


