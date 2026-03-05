import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Shield, Lock, Cpu, Cloud, KeyRound, RefreshCw } from 'lucide-react';
import { useTrustEdge, type TrustEdgeFeature } from '../../hooks/useTrustEdge';

const featureIcons: Record<TrustEdgeFeature['icon'], typeof Shield> = {
  shield: Shield,
  lock: Lock,
  cpu: Cpu,
  cloud: Cloud,
  key: KeyRound,
  refresh: RefreshCw,
};

export default function TrustEdgePanel() {
  const { isOpen, activeFeature, features, closePanel, goToFeature, nextFeature, prevFeature } =
    useTrustEdge();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          key="trustedge-panel"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed top-0 right-0 bottom-0 z-40 flex flex-col overflow-hidden"
          style={{
            width: 340,
            backgroundColor: '#0f1117',
            borderLeft: '2px solid rgba(0, 180, 255, 0.15)',
            boxShadow: '-12px 0 40px rgba(0,0,0,0.6), -2px 0 8px rgba(0,100,200,0.15)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #0174C3 0%, #00B4FF 100%)',
                  boxShadow: '0 2px 8px rgba(1, 116, 195, 0.4)',
                }}
              >
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: '#fff' }}>
                  TrustEdge
                </div>
                <div className="text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Device Security Platform
                </div>
              </div>
            </div>
            <button
              onClick={closePanel}
              className="w-7 h-7 flex items-center justify-center rounded-md transition-colors hover:bg-white/10"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* About Section */}
          <div className="px-5 pt-4 pb-3">
            <div
              className="rounded-xl p-4"
              style={{
                background: 'linear-gradient(135deg, rgba(1, 116, 195, 0.12) 0%, rgba(0, 180, 255, 0.06) 100%)',
                border: '1px solid rgba(0, 180, 255, 0.15)',
              }}
            >
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <span className="font-semibold" style={{ color: '#00B4FF' }}>DigiCert TrustEdge</span> is the
                industry-leading platform for securing IoT and edge device identities at scale. From certificate
                provisioning to PQC migration, TrustEdge provides end-to-end cryptographic lifecycle management
                for every device in your fleet.
              </p>
            </div>
          </div>

          {/* Feature List */}
          <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1.5">
            {features.map((feature) => {
              const isActive = feature.id === activeFeature;
              const IconComp = featureIcons[feature.icon];
              return (
                <button
                  key={feature.id}
                  onClick={() => goToFeature(feature.id)}
                  className="w-full text-left rounded-xl p-3.5 transition-all group"
                  style={{
                    backgroundColor: isActive ? 'rgba(1, 116, 195, 0.12)' : 'transparent',
                    border: isActive
                      ? '1px solid rgba(0, 180, 255, 0.2)'
                      : '1px solid transparent',
                  }}
                >
                  <div className="flex items-start gap-3">
                    {/* Feature icon */}
                    <div
                      className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, #0174C3, #00B4FF)'
                          : 'rgba(255,255,255,0.06)',
                        border: isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                      }}
                    >
                      <IconComp
                        className="w-3.5 h-3.5"
                        style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.4)' }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="text-sm font-semibold leading-tight mb-1"
                        style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.65)' }}
                      >
                        {feature.title}
                      </div>
                      <div
                        className="text-xs leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.4)' }}
                      >
                        {feature.tagline}
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail */}
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="mt-3 ml-10 overflow-hidden"
                    >
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: 'rgba(255,255,255,0.55)' }}
                      >
                        {feature.detail}
                      </p>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Navigation */}
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
          >
            <button
              onClick={prevFeature}
              disabled={activeFeature === 1}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30"
              style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Prev
            </button>
            <span className="text-[11px] tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
              {activeFeature} / {features.length}
            </span>
            <button
              onClick={nextFeature}
              disabled={activeFeature === features.length}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg transition-colors disabled:opacity-30"
              style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.06)' }}
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Branding Footer */}
          <div
            className="px-5 py-3 flex items-center justify-center gap-2"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.2)' }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <path
                d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
                fill="#0174C3"
                opacity="0.8"
              />
              <path
                d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z"
                stroke="#00B4FF"
                strokeWidth="1"
                fill="none"
              />
              <path d="M10 12.5l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[10px] font-medium tracking-wider" style={{ color: 'rgba(255,255,255,0.3)' }}>
              POWERED BY DIGICERT
            </span>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
