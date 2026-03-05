import { motion } from 'framer-motion';
import {
  ArrowRight, Radar, Map, BarChart3, ChevronRight,
  Shield, BookOpen, Presentation,
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useStory } from '../hooks/useStory';
import { useDemoMode } from '../components/story/DemoBar';

const CNSA_DEADLINE = new Date('2027-01-01');
const TODAY = new Date();
const WEEKS_REMAINING = Math.floor(
  (CNSA_DEADLINE.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24 * 7),
);

const steps = [
  {
    step: '01',
    icon: Radar,
    title: 'Discover Your Fleet',
    detail: 'Connect your IoT platforms (Azure IoT, AWS IoT, Event Grid, TrustEdge Light) and scan every device — including those with zero cryptographic identity.',
    route: '/discovery',
  },
  {
    step: '02',
    icon: Map,
    title: 'Review the Blueprint',
    detail: 'See which devices run weak crypto, get prioritized recommendations, and check whether your migration velocity meets the CNSA 2.0 deadline.',
    route: '/blueprint',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Results & Timeline',
    detail: 'Check your fleet\'s PQC readiness score, risk breakdown, algorithm deprecation timeline, and whether you\'ll meet the January 2027 deadline.',
    route: '/results',
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { openPanel, goToChapter } = useStory();
  const { startDemo } = useDemoMode();

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
            data-tour="landing-deadline"
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

          <div data-tour="landing-hero">
            <h1 className="text-4xl font-bold leading-tight mb-4" style={{ color: 'var(--theme-text)' }}>
              DigiCert Q-Shield
            </h1>
            <p className="text-lg mb-2 max-w-2xl" style={{ color: 'var(--theme-text-muted)' }}>
              Discover, assess, and migrate your entire IoT device fleet to post-quantum cryptography
              before the CNSA 2.0 deadline — including brownfield devices that can't run a full agent.
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/discovery')}
              className="flex items-center gap-2.5 px-6 py-3 text-sm font-semibold rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--theme-text)', color: 'var(--theme-bg)' }}
            >
              <Radar className="w-4 h-4" />
              Start Discovery
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={startGuidedTour}
              className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium rounded-xl transition-colors"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--theme-card-border)',
                color: 'var(--theme-text-secondary)',
              }}
            >
              <BookOpen className="w-4 h-4" />
              Guided Tour
            </button>
            <button
              type="button"
              onClick={startDemo}
              className="flex items-center gap-2.5 px-6 py-3 text-sm font-medium rounded-xl transition-colors"
              style={{
                backgroundColor: 'transparent',
                border: '1px solid var(--theme-card-border)',
                color: 'var(--theme-text-secondary)',
              }}
            >
              <Presentation className="w-4 h-4" />
              Demo
            </button>
          </div>
        </motion.div>
      </div>

      <div className="px-10 py-8 space-y-10 max-w-5xl">
        {/* How it works */}
        <div>
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold mb-6"
            style={{ color: 'var(--theme-text)' }}
          >
            How it works
          </motion.h2>

          <div className="grid grid-cols-3 gap-4">
            {steps.map((s, i) => (
              <motion.button
                key={s.step}
                type="button"
                onClick={() => navigate(s.route)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="text-left rounded-2xl p-5 group transition-all"
                style={{
                  backgroundColor: 'var(--theme-card)',
                  border: '1px solid var(--theme-card-border)',
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black" style={{ color: 'var(--theme-text-dim)' }}>
                      {s.step}
                    </span>
                    <s.icon className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
                  </div>
                  <ChevronRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--theme-text-muted)' }}
                  />
                </div>
                <div className="text-sm font-bold mb-1.5" style={{ color: 'var(--theme-text)' }}>
                  {s.title}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                  {s.detail}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* What the platform covers */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
        >
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
            What this platform covers
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Multi-platform discovery', desc: 'Azure IoT Hub, AWS IoT Core, Azure Event Grid, TrustEdge Light, custom APIs' },
              { label: 'Risk assessment', desc: 'Per-device risk scoring, algorithm analysis, firmware update capability checks' },
              { label: 'PQC migration', desc: 'ML-DSA, ML-KEM hybrid certs via TrustEdge or TrustEdge Light' },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-xs font-semibold mb-1" style={{ color: 'var(--theme-text-secondary)' }}>
                  {item.label}
                </div>
                <div className="text-xs leading-relaxed" style={{ color: 'var(--theme-text-muted)' }}>
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          data-tour="landing-cta"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="rounded-2xl p-8 flex items-center justify-between"
          style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
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
                Ready to begin?
              </div>
              <div className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
                Connect your IoT platforms and discover your fleet in under a minute.
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/discovery')}
            className="flex-shrink-0 flex items-center gap-2.5 px-6 py-3 text-sm font-semibold rounded-xl transition-colors ml-6"
            style={{ backgroundColor: 'var(--theme-text)', color: 'var(--theme-bg)' }}
          >
            <Radar className="w-4 h-4" />
            Start Discovery
          </button>
        </motion.div>
      </div>
    </div>
  );
}
