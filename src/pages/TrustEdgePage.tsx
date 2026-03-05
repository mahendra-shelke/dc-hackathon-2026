import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Lock, Cpu, Cloud, KeyRound, RefreshCw,
  ChevronDown, ChevronUp, CheckCircle2, Fingerprint,
  Server, Globe, Layers, ArrowRight, Activity,
  FileKey, Download, Zap,
} from 'lucide-react';

/* ── TrustEdge Platform Features ── */
const platformFeatures = [
  {
    id: 'identity',
    icon: Fingerprint,
    title: 'Edge Device Identity',
    tagline: 'Hardware-bound X.509 identity for every device',
    detail:
      'TrustEdge provisions each IoT and edge device with a hardware-bound certificate identity. Even constrained devices (Cortex-M0+, 16 KB RAM) get a lightweight X.509 identity via EST enrollment, enabling zero-trust authentication from day one.',
    stats: [
      { label: 'Devices Supported', value: '50K+' },
      { label: 'Min. Memory', value: '8 KB' },
      { label: 'Enrollment', value: 'EST / SCEP' },
    ],
  },
  {
    id: 'lifecycle',
    icon: RefreshCw,
    title: 'Automated Certificate Lifecycle',
    tagline: 'Issue, renew, and revoke — without human intervention',
    detail:
      'Certificates expire. Devices go offline. TrustEdge automates the full lifecycle: initial enrollment via EST/SCEP, scheduled renewal before expiry, and instant revocation when a device is decommissioned or compromised. No more expired certs causing outages.',
    stats: [
      { label: 'Auto-Renewal', value: '100%' },
      { label: 'Avg. Latency', value: '<200 ms' },
      { label: 'Revocation', value: 'Instant' },
    ],
  },
  {
    id: 'crypto-agility',
    icon: KeyRound,
    title: 'PQC-Ready Crypto Agility',
    tagline: 'Swap algorithms without reflashing firmware',
    detail:
      'TrustEdge supports crypto agility — the ability to rotate from RSA/ECDSA to ML-DSA or ML-KEM without a full firmware update. Hybrid certificates bridge classical and post-quantum worlds, keeping your fleet interoperable while future-proofing against quantum threats.',
    stats: [
      { label: 'Algorithms', value: 'ML-KEM / ML-DSA' },
      { label: 'Hybrid Mode', value: 'Supported' },
      { label: 'Firmware Update', value: 'Not Required' },
    ],
  },
  {
    id: 'secure-boot',
    icon: Lock,
    title: 'Secure Boot & Firmware Signing',
    tagline: 'Only verified code runs on your devices',
    detail:
      'TrustEdge integrates with secure boot chains to validate firmware integrity at every startup. Code-signing certificates ensure that only authorized, cryptographically verified firmware is deployed. Tampered or unsigned images are rejected at the hardware level.',
    stats: [
      { label: 'Boot Validation', value: 'Hardware' },
      { label: 'Code Signing', value: 'X.509 Based' },
      { label: 'Tamper Detect', value: 'Real-time' },
    ],
  },
  {
    id: 'fleet-visibility',
    icon: Cloud,
    title: 'Fleet-Wide Visibility',
    tagline: 'Real-time cryptographic posture across your entire fleet',
    detail:
      'A single dashboard shows certificate status, algorithm usage, expiry timelines, and compliance gaps for every device in your fleet. Filter by device class, industry vertical, or risk level. Detect anomalies (e.g., a device running SHA-1) before they become vulnerabilities.',
    stats: [
      { label: 'Visibility', value: 'Real-time' },
      { label: 'Filters', value: 'Industry / Risk' },
      { label: 'Anomaly Detection', value: 'Yes' },
    ],
  },
  {
    id: 'hardware-security',
    icon: Cpu,
    title: 'Hardware Security Integration',
    tagline: 'TPM, secure enclaves, and HSM-backed key storage',
    detail:
      'Private keys never leave the hardware. TrustEdge leverages TPM 2.0, ARM TrustZone, and HSM modules to generate and store keys in tamper-resistant storage. Even if a device is physically compromised, the keys cannot be extracted.',
    stats: [
      { label: 'TPM 2.0', value: 'Supported' },
      { label: 'ARM TrustZone', value: 'Supported' },
      { label: 'HSM', value: 'FIPS 140-3' },
    ],
  },
];

/* ── Architecture Layers ── */
const architectureLayers = [
  { icon: Server, label: 'DigiCert ONE Cloud', desc: 'Centralized policy engine, CA hierarchy, and audit log' },
  { icon: Globe, label: 'TrustEdge Gateway', desc: 'Protocol translation, fleet orchestration, telemetry aggregation' },
  { icon: Layers, label: 'Device Agent / SDK', desc: 'Lightweight agent for cert enrollment, renewal, and key ops' },
  { icon: Cpu, label: 'Hardware Root of Trust', desc: 'TPM 2.0, Secure Enclave, HSM — tamper-proof key storage' },
];

/* ── Supported Protocols ── */
const protocols = [
  'EST (RFC 7030)', 'SCEP', 'ACME', 'CMP (RFC 4210)',
  'MQTT/TLS 1.3', 'OPC-UA', 'Matter/Thread', 'LoRaWAN',
];

/* ── Industry Support ── */
const industries = [
  { name: 'Medical / Healthcare', devices: '12,400+', color: '#EC4899' },
  { name: 'Industrial / SCADA', devices: '28,600+', color: '#EAB308' },
  { name: 'Automotive / V2X', devices: '8,200+', color: '#F97316' },
  { name: 'Smart Home / Consumer', devices: '15,800+', color: '#8B5CF6' },
  { name: 'Enterprise / IT', devices: '22,100+', color: '#06B6D4' },
];

export default function TrustEdgePage() {
  const [expandedFeature, setExpandedFeature] = useState<string | null>('identity');

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-3"
      >
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: 'rgba(229,117,60,0.12)',
              border: '1px solid rgba(229,117,60,0.25)',
            }}
          >
            <Shield className="w-6 h-6" style={{ color: '#E5753C' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
              DigiCert TrustEdge
            </h1>
            <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
              End-to-end device identity & certificate lifecycle for IoT at scale
            </p>
          </div>
        </div>

        {/* Hero Banner */}
        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: 'var(--theme-card)',
            border: '1px solid var(--theme-card-border)',
          }}
        >
          <p className="text-sm leading-relaxed max-w-3xl" style={{ color: 'var(--theme-text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--theme-text)' }}>TrustEdge</span> is DigiCert's
            industry-leading platform for securing IoT and edge device identities.
            From certificate provisioning to PQC migration, TrustEdge provides automated
            cryptographic lifecycle management for every device in your fleet — from
            8 KB microcontrollers to edge gateways running full Linux stacks.
          </p>
          <div className="flex gap-6 mt-4">
            {[
              { val: '50K+', lbl: 'Devices Managed', accent: false },
              { val: '<200ms', lbl: 'Enrollment Latency', accent: true },
              { val: '99.99%', lbl: 'Uptime SLA', accent: false },
              { val: 'CNSA 2.0', lbl: 'Compliant', accent: true },
            ].map((s) => (
              <div key={s.lbl} className="text-center">
                <div className="text-lg font-bold" style={{ color: s.accent ? '#E5753C' : 'var(--theme-text)' }}>{s.val}</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Platform Features */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
          Platform Capabilities
        </h2>
        <div className="space-y-3">
          {platformFeatures.map((feat) => {
            const isExpanded = expandedFeature === feat.id;
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                className="rounded-xl overflow-hidden transition-all"
                style={{
                  backgroundColor: 'var(--theme-card)',
                  border: isExpanded
                    ? '1px solid var(--theme-text-secondary)'
                    : '1px solid var(--theme-card-border)',
                }}
              >
                <button
                  type="button"
                  onClick={() => setExpandedFeature(isExpanded ? null : feat.id)}
                  className="w-full flex items-center gap-4 p-4 text-left"
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: isExpanded
                        ? 'rgba(229,117,60,0.12)'
                        : 'var(--theme-card-inner)',
                      border: `1px solid ${isExpanded ? 'rgba(229,117,60,0.25)' : 'var(--theme-card-border)'}`,
                    }}
                  >
                    <Icon
                      className="w-5 h-5"
                      style={{ color: isExpanded ? '#E5753C' : 'var(--theme-text-muted)' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                      {feat.title}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                      {feat.tagline}
                    </div>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--theme-text-muted)' }} />
                    : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--theme-text-muted)' }} />
                  }
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0">
                        <div
                          className="h-px mb-4"
                          style={{ backgroundColor: 'var(--theme-card-border)' }}
                        />
                        <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--theme-text-secondary)' }}>
                          {feat.detail}
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          {feat.stats.map((st) => (
                            <div
                              key={st.label}
                              className="rounded-lg p-3 text-center"
                              style={{
                                backgroundColor: 'var(--theme-card-inner)',
                                border: '1px solid var(--theme-card-border)',
                              }}
                            >
                              <div className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>
                                {st.value}
                              </div>
                              <div className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--theme-text-muted)' }}>
                                {st.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.section>

      {/* Architecture & Industry — side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Architecture */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl p-5"
          style={{
            backgroundColor: 'var(--theme-card)',
            border: '1px solid var(--theme-card-border)',
          }}
        >
          <h2 className="text-base font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
            Architecture Stack
          </h2>
          <div className="space-y-3">
            {architectureLayers.map((layer, i) => (
              <div key={layer.label} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: 'var(--theme-card-inner)',
                      border: '1px solid var(--theme-card-border)',
                    }}
                  >
                    <layer.icon className="w-4 h-4" style={{ color: 'var(--theme-text-secondary)' }} />
                  </div>
                  {i < architectureLayers.length - 1 && (
                    <div className="w-px h-4 mt-1" style={{ backgroundColor: 'var(--theme-card-border)' }} />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
                    {layer.label}
                  </div>
                  <div className="text-xs" style={{ color: 'var(--theme-text-muted)' }}>
                    {layer.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Industry + Protocols */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="space-y-6"
        >
          {/* Industry Support */}
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'var(--theme-card)',
              border: '1px solid var(--theme-card-border)',
            }}
          >
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--theme-text)' }}>
              Industry Coverage
            </h2>
            <div className="space-y-2">
              {industries.map((ind) => (
                <div key={ind.name} className="flex items-center justify-between py-1.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: ind.color }}
                    />
                    <span className="text-xs font-medium" style={{ color: 'var(--theme-text-secondary)' }}>
                      {ind.name}
                    </span>
                  </div>
                  <span className="text-xs font-mono" style={{ color: 'var(--theme-text-muted)' }}>
                    {ind.devices}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Supported Protocols */}
          <div
            className="rounded-xl p-5"
            style={{
              backgroundColor: 'var(--theme-card)',
              border: '1px solid var(--theme-card-border)',
            }}
          >
            <h2 className="text-base font-bold mb-3" style={{ color: 'var(--theme-text)' }}>
              Supported Protocols
            </h2>
            <div className="flex flex-wrap gap-2">
              {protocols.map((p) => (
                <span
                  key={p}
                  className="text-[11px] font-mono px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor: 'var(--theme-card-inner)',
                    border: '1px solid var(--theme-card-border)',
                    color: 'var(--theme-text-secondary)',
                  }}
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </motion.section>
      </div>

      {/* How It Works — Flow */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-xl p-5"
        style={{
          backgroundColor: 'var(--theme-card)',
          border: '1px solid var(--theme-card-border)',
        }}
      >
        <h2 className="text-base font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
          How TrustEdge Works
        </h2>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {[
            { icon: Download, label: 'Bootstrap', desc: 'Device boots with initial token', accent: false },
            { icon: FileKey, label: 'Enroll', desc: 'EST/SCEP cert enrollment', accent: false },
            { icon: Shield, label: 'Authenticate', desc: 'mTLS identity established', accent: false },
            { icon: Activity, label: 'Monitor', desc: 'Telemetry & health checks', accent: false },
            { icon: RefreshCw, label: 'Renew', desc: 'Auto-renewal before expiry', accent: false },
            { icon: Zap, label: 'Migrate', desc: 'PQC algorithm rotation', accent: true },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-2 flex-shrink-0">
              <div className="text-center">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-2"
                  style={{
                    backgroundColor: step.accent ? 'rgba(229,117,60,0.12)' : 'var(--theme-card-inner)',
                    border: step.accent ? '1px solid rgba(229,117,60,0.25)' : '1px solid var(--theme-card-border)',
                  }}
                >
                  <step.icon className="w-5 h-5" style={{ color: step.accent ? '#E5753C' : 'var(--theme-text-secondary)' }} />
                </div>
                <div className="text-xs font-semibold" style={{ color: step.accent ? '#E5753C' : 'var(--theme-text)' }}>
                  {step.label}
                </div>
                <div className="text-[10px] max-w-[100px]" style={{ color: 'var(--theme-text-muted)' }}>
                  {step.desc}
                </div>
              </div>
              {i < arr.length - 1 && (
                <ArrowRight className="w-4 h-4 flex-shrink-0 mt-[-16px]" style={{ color: 'var(--theme-text-dim)' }} />
              )}
            </div>
          ))}
        </div>
      </motion.section>

      {/* Compliance & Certifications Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="flex items-center gap-4 flex-wrap"
      >
        {[
          { label: 'NIST SP 800-208', accent: false },
          { label: 'CNSA 2.0', accent: true },
          { label: 'FIPS 140-3', accent: false },
          { label: 'Common Criteria EAL4+', accent: false },
          { label: 'IEC 62443', accent: false },
          { label: 'FDA UDI', accent: false },
          { label: 'Matter 1.2', accent: false },
        ].map((badge) => (
          <div
            key={badge.label}
            className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-1.5 rounded-lg"
            style={{
              backgroundColor: badge.accent ? 'rgba(229,117,60,0.12)' : 'var(--theme-card)',
              border: badge.accent ? '1px solid rgba(229,117,60,0.25)' : '1px solid var(--theme-card-border)',
              color: badge.accent ? '#E5753C' : 'var(--theme-text-muted)',
            }}
          >
            <CheckCircle2 className="w-3 h-3" style={{ color: badge.accent ? '#E5753C' : '#22C55E' }} />
            {badge.label}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
