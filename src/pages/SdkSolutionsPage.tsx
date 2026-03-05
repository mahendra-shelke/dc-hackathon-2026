import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Cpu, ChevronDown, ChevronUp, CheckCircle2,
  Terminal, Copy, Layers, ArrowRight, Zap, Package,
  Wifi, Lock, Fingerprint, RefreshCw,
  Download, Activity, Code2,
} from 'lucide-react';

/* ── SDK definitions ── */
const sdks = [
  {
    id: 'trustedge',
    name: 'TrustEdge',
    badge: 'Greenfield',
    badgeColor: '#22c55e',
    tagline: 'Service + CLI for device provisioning & cert lifecycle',
    icon: Shield,
    features: [
      { icon: Lock, label: 'Secure Auth', desc: 'MQTT, SCEP & EST' },
      { icon: Zap, label: 'Single Binary', desc: 'Service + CLI' },
      { icon: RefreshCw, label: 'Auto Lifecycle', desc: 'Provision, renew, revoke via DTM' },
      { icon: Activity, label: 'TrustEdge Light', desc: 'Key gen & cert issuance' },
    ],
    languages: [],
    stats: [
      { label: 'Arch', value: 'x64 / ARM32 / ARM64' },
      { label: 'Protocols', value: 'MQTT / SCEP / EST' },
      { label: 'Modes', value: 'Service + CLI' },
      { label: 'Compliance', value: 'CNSA 2.0' },
    ],
  },
  {
    id: 'trustcore-light',
    name: 'TrustEdge Light',
    badge: 'Brownfield',
    badgeColor: '#E5753C',
    tagline: 'Kernel hooks — NanoCrypto, NanoSSL, NanoROOT telemetry',
    icon: Cpu,
    features: [
      { icon: Package, label: 'Kernel Hooks', desc: 'NanoROOT + NanoSMP' },
      { icon: Fingerprint, label: 'Cert Discovery', desc: 'X.509, DER, PEM' },
      { icon: Activity, label: 'Crypto Telemetry', desc: 'NanoCrypto + NanoSSL' },
      { icon: Wifi, label: 'Multi-Transport', desc: 'UART, BLE, NB-IoT' },
    ],
    languages: ['C', 'C++', 'Java', 'Python'],
    stats: [
      { label: 'Min. RAM', value: '8 KB' },
      { label: 'Core', value: 'NanoCrypto + NanoROOT' },
      { label: 'Formats', value: 'X.509, DER, PEM' },
      { label: 'OS Required', value: 'No' },
    ],
  },
];

/* ── SDK Code Snippets ── */
const sdkSnippets: Record<string, Record<string, string>> = {
  trustedge: {
    python: `from digicert_trustedge import TrustEdge, MqttClient

# Initialize TrustEdge — connects to Device Trust Manager
edge = TrustEdge(
    endpoint="dtm.digicert.com",
    device_id="gateway-edge-12",
    enrollment="est",          # est | scep
    auth_token="Bearer <bootstrap_token>"
)

# Enroll device identity via EST
cert = edge.enroll()
print(f"Identity:  {cert.subject}")
print(f"Algorithm: {cert.algorithm}")
print(f"Issuer:    {cert.issuer}")
print(f"Expiry:    {cert.not_after}")

# Secure MQTT communication (3.1.1 / 5.0 over TLS)
mqtt = MqttClient(edge, protocol="5.0")
mqtt.publish("device/telemetry", payload=cert.to_dict())

# Automated lifecycle — renewal managed by DTM
edge.enable_auto_renewal(days_before_expiry=30)

# Start as service (continuous management)
edge.run_service()`,
    rust: `use digicert_trustedge::{TrustEdge, Config, Enrollment, MqttClient};

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let edge = TrustEdge::new(Config {
        endpoint:   "dtm.digicert.com".into(),
        device_id:  "gateway-edge-12".into(),
        enrollment: Enrollment::Est,
        auth_token: "<bootstrap_token>".into(),
    })?;

    // Enroll device identity via EST
    let cert = edge.enroll()?;
    println!("Identity:  {}", cert.subject);
    println!("Algorithm: {}", cert.algorithm);
    println!("Issuer:    {}", cert.issuer);

    // Secure MQTT 5.0 communication over TLS
    let mqtt = MqttClient::new(&edge)?;
    mqtt.publish("device/telemetry", &cert.to_json())?;

    // Auto-renewal via Device Trust Manager
    edge.enable_auto_renewal(30)?;
    edge.run_service()?;

    Ok(())
}`,
    java: `import com.digicert.trustedge.TrustEdge;
import com.digicert.trustedge.Certificate;
import com.digicert.trustedge.Enrollment;
import com.digicert.trustedge.MqttClient;

public class GreenfieldSetup {
    public static void main(String[] args) throws Exception {
        TrustEdge edge = TrustEdge.builder()
            .endpoint("dtm.digicert.com")
            .deviceId("gateway-edge-12")
            .enrollment(Enrollment.EST)
            .authToken("<bootstrap_token>")
            .build();

        // Enroll device identity via EST
        Certificate cert = edge.enroll();
        System.out.printf("Identity:  %s%n", cert.getSubject());
        System.out.printf("Algorithm: %s%n", cert.getAlgorithm());

        // Secure MQTT 5.0 over TLS
        MqttClient mqtt = new MqttClient(edge);
        mqtt.publish("device/telemetry", cert.toJson());

        // Auto-renewal via Device Trust Manager
        edge.enableAutoRenewal(30);
        edge.runService();
    }
}`,
  },
  'trustcore-light': {
    python: `from digicert_trustedge_light import TrustEdgeLight, KernelHook

# Initialize TrustEdge Light — kernel hooks into crypto layer
core = TrustEdgeLight(
    endpoint="dtm.digicert.com",
    device_id="meter-node-114",
    transport="nb-iot",       # uart | ble | nb-iot
    auth_token="Bearer <bootstrap_token>"
)

# NanoROOT kernel hook — tap into OS crypto subsystem
hook = KernelHook(core)
hook.attach()  # hooks into cert stores, TLS sessions, key ops

# NanoCert — probe local certificate stores
result = hook.probe_certs()
print(f"Cert Status:  {result.status}")       # none | classical | hybrid | pqc
print(f"Algorithm:    {result.algorithm}")
print(f"Issuer:       {result.issuer}")
print(f"FW Hash:      {result.firmware_sha256}")

# NanoCrypto telemetry — report to DTM
core.report_telemetry({
    "nano_crypto": result.crypto_state,
    "nano_ssl":    result.tls_sessions,
    "cert":        result.to_dict(),
})`,
    c: `#include <digicert/trustedge_light.h>
#include <digicert/nano_root.h>
#include <digicert/nano_crypto.h>

int main(void) {
    /* Initialize TrustEdge Light (≥ 8KB RAM) */
    dc_core_config_t cfg = {
        .endpoint  = "dtm.digicert.com",
        .device_id = "scada-plc-07",
        .transport = DC_TRANSPORT_UART,
        .auth      = "<bootstrap_token>",
    };
    dc_core_t *core = dc_core_init(&cfg);

    /* NanoROOT — attach kernel hooks */
    dc_nano_root_attach(core);

    /* NanoCert — probe certificate stores */
    dc_cert_result_t cert;
    dc_nano_cert_probe(core, &cert);

    printf("Status:    %s\\n", dc_cert_status_str(cert.status));
    printf("Algorithm: %s\\n", cert.algorithm);
    printf("FW Hash:   %s\\n", cert.fw_sha256);

    /* NanoCrypto — report telemetry to DTM */
    dc_telemetry_t tel = { .cert = &cert };
    dc_nano_crypto_report(core, &tel);
    dc_core_free(core);
    return 0;
}`,
  },
};

/* ── How It All Comes Together (flow) ── */
const solutionFlow = [
  { icon: Download, label: 'Choose SDK', desc: 'Greenfield or brownfield', accent: false },
  { icon: Code2, label: 'Integrate', desc: '8+ languages supported', accent: false },
  { icon: Fingerprint, label: 'Discover', desc: 'Certs, algorithms, identity gaps', accent: false },
  { icon: Activity, label: 'Report', desc: 'Telemetry → DTM', accent: false },
  { icon: Layers, label: 'Inventory', desc: 'Full fleet snapshot', accent: false },
  { icon: Zap, label: 'Migrate', desc: 'PQC rotation', accent: true },
];

/* ── Comparison Table ── */
const comparisonRows = [
  { feature: 'Target Devices', trustedge: 'Greenfield — new deployments', light: 'Brownfield — existing / legacy devices' },
  { feature: 'Delivery', trustedge: 'Single executable (service + CLI)', light: 'Kernel module' },
  { feature: 'OS Support', trustedge: 'Debian 11.x+, Ubuntu 22.04+, Raspberry Pi OS', light: 'Linux, FreeRTOS, Zephyr, bare-metal' },
  { feature: 'Architectures', trustedge: 'x64, ARM32, ARM64', light: 'ARM, MIPS, RISC-V, x86' },
  { feature: 'Min. Resources', trustedge: 'Standard Linux environment', light: '8 KB RAM · 8 MHz CPU · No OS required' },
  { feature: 'Cert Management', trustedge: 'EST / SCEP enrollment + full lifecycle', light: 'Probe & report only' },
  { feature: 'Communication', trustedge: 'MQTT 3.1.1 & 5.0 over TLS', light: 'UART / BLE / NB-IoT' },
  { feature: 'Modes', trustedge: 'DTM-managed service + standalone CLI', light: 'Background telemetry agent' },
  { feature: 'Auto-Renewal', trustedge: 'Yes — via Device Trust Manager', light: 'Via DTM orchestration' },
  { feature: 'Software Updates', trustedge: 'Artifact handler for updates & scripts', light: 'Firmware hash verification' },
  { feature: 'Telemetry', trustedge: 'Full device + cert + MQTT telemetry', light: 'Lightweight cert + hardware telemetry' },
  { feature: 'Languages', trustedge: 'Rust, C, C++, Java, C#, Python, Go, Node.js', light: 'Rust, C, C++, Java, C#, Python, Go, Node.js' },
];

export default function SdkSolutionsPage() {
  const [expandedSdk, setExpandedSdk] = useState<string>('trustedge');
  const [activeSnippetSdk, setActiveSnippetSdk] = useState<string>('trustedge');
  const [activeSnippetLang, setActiveSnippetLang] = useState<string>('python');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [showComparison, setShowComparison] = useState(false);

  /* Listen for demo-mode expand commands */
  useEffect(() => {
    const handler = (e: Event) => {
      const sdk = (e as CustomEvent).detail;
      if (sdk === 'trustedge' || sdk === 'trustcore-light') {
        setExpandedSdk(sdk);
      }
    };
    window.addEventListener('demo:expand-sdk', handler);
    return () => window.removeEventListener('demo:expand-sdk', handler);
  }, []);

  function handleCopy() {
    const text = sdkSnippets[activeSnippetSdk]?.[activeSnippetLang];
    if (text) {
      navigator.clipboard.writeText(text);
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    }
  }

  const snippetLangs = Object.keys(sdkSnippets[activeSnippetSdk] || {});

  return (
    <div className="p-6 space-y-5 max-w-7xl mx-auto">
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
            <Package className="w-6 h-6" style={{ color: '#E5753C' }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
              DigiCert SDK Solutions
            </h1>
            <p className="text-sm" style={{ color: 'var(--theme-text-muted)' }}>
              Two SDKs. Every device. Complete PQC readiness inventory from day one.
            </p>
          </div>
        </div>

        {/* Hero stats */}
        <div
          className="rounded-2xl p-4 flex items-center gap-8"
          style={{
            backgroundColor: 'var(--theme-card)',
            border: '1px solid var(--theme-card-border)',
          }}
        >
          <p className="text-xs leading-relaxed flex-1" style={{ color: 'var(--theme-text-secondary)' }}>
            <span className="font-semibold" style={{ color: '#22c55e' }}>TrustEdge</span> for new devices (service + CLI).{' '}
            <span className="font-semibold" style={{ color: '#E5753C' }}>TrustEdge Light</span> for legacy hardware (kernel hooks, 8 KB).
            Complete inventory for timely PQC migration.
          </p>
          <div className="flex gap-6 flex-shrink-0">
            {[
              { val: '8 KB', lbl: 'Min. RAM', accent: true },
              { val: '8+', lbl: 'Languages', accent: false },
              { val: 'CNSA 2.0', lbl: 'Compliant', accent: true },
            ].map((s) => (
              <div key={s.lbl} className="text-center">
                <div className="text-sm font-bold" style={{ color: s.accent ? '#E5753C' : 'var(--theme-text)' }}>{s.val}</div>
                <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* SDK Cards — Side by side */}
      <motion.div
        data-tour={expandedSdk === 'trustedge' ? 'sdk-trustedge' : 'sdk-light'}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {sdks.map((sdk) => {
          const isExpanded = expandedSdk === sdk.id;
          const Icon = sdk.icon;
          return (
            <div
              key={sdk.id}
              data-tour={sdk.id === 'trustedge' ? 'sdk-trustedge' : 'sdk-light'}
              className="rounded-2xl overflow-hidden transition-all"
              style={{
                backgroundColor: 'var(--theme-card)',
                border: `1px solid ${isExpanded ? `${sdk.badgeColor}40` : 'var(--theme-card-border)'}`,
              }}
            >
              {/* Header */}
              <button
                type="button"
                onClick={() => setExpandedSdk(isExpanded ? '' : sdk.id)}
                className="w-full text-left px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: `${sdk.badgeColor}18`,
                      border: `1px solid ${sdk.badgeColor}30`,
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color: sdk.badgeColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold" style={{ color: 'var(--theme-text)' }}>{sdk.name}</span>
                      <span
                        className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full"
                        style={{ backgroundColor: `${sdk.badgeColor}18`, color: sdk.badgeColor }}
                      >
                        {sdk.badge}
                      </span>
                    </div>
                    <div className="text-[11px]" style={{ color: 'var(--theme-text-muted)' }}>{sdk.tagline}</div>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--theme-text-muted)' }} />
                    : <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--theme-text-muted)' }} />
                  }
                </div>
              </button>

              {/* Stats — always visible */}
              <div className="px-4 pb-3">
                <div className="grid grid-cols-4 gap-2">
                  {sdk.stats.map((st) => (
                    <div
                      key={st.label}
                      className="rounded-md p-2 text-center"
                      style={{ backgroundColor: 'var(--theme-card-inner)' }}
                    >
                      <div className="text-[11px] font-bold" style={{ color: 'var(--theme-text)' }}>{st.value}</div>
                      <div className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--theme-text-muted)' }}>{st.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Expandable features */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3">
                      <div className="h-px" style={{ backgroundColor: 'var(--theme-card-border)' }} />

                      {/* Features */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        {sdk.features.map((feat) => {
                          const FeatIcon = feat.icon;
                          return (
                            <div key={feat.label} className="flex items-center gap-2 py-1">
                              <FeatIcon className="w-3 h-3 flex-shrink-0" style={{ color: sdk.badgeColor }} />
                              <span className="text-[11px] font-medium" style={{ color: 'var(--theme-text)' }}>{feat.label}</span>
                              <span className="text-[10px]" style={{ color: 'var(--theme-text-muted)' }}>— {feat.desc}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Languages */}
                      {sdk.languages.length > 0 && (
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex gap-1 flex-wrap">
                            {sdk.languages.map((lang) => (
                              <span
                                key={lang}
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                                style={{
                                  backgroundColor: 'var(--theme-card-inner)',
                                  color: 'var(--theme-text-muted)',
                                }}
                              >
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        data-tour="sdk-comparison"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
      >
        <button
          type="button"
          onClick={() => setShowComparison(!showComparison)}
          className="w-full flex items-center justify-between px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <Layers className="w-4 h-4" style={{ color: 'var(--theme-text-secondary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>
              SDK Comparison — TrustEdge vs TrustEdge Light
            </span>
          </div>
          {showComparison
            ? <ChevronUp className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
            : <ChevronDown className="w-4 h-4" style={{ color: 'var(--theme-text-muted)' }} />
          }
        </button>

        <AnimatePresence>
          {showComparison && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                        {['Feature', 'TrustEdge (Greenfield)', 'TrustEdge Light (Brownfield)'].map((h, i) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-semibold uppercase tracking-wider px-5 py-3"
                          style={{
                            color: i === 1 ? '#22c55e' : i === 2 ? '#E5753C' : 'var(--theme-text-dim)',
                            borderBottom: '1px solid var(--theme-card-border)',
                            borderTop: '1px solid var(--theme-card-border)',
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.feature}>
                        <td
                          className="px-5 py-2.5 text-xs font-medium"
                          style={{ color: 'var(--theme-text)', borderBottom: '1px solid var(--theme-card-border)' }}
                        >
                          {row.feature}
                        </td>
                        <td
                          className="px-5 py-2.5 text-[11px]"
                          style={{ color: 'var(--theme-text-secondary)', borderBottom: '1px solid var(--theme-card-border)' }}
                        >
                          {row.trustedge}
                        </td>
                        <td
                          className="px-5 py-2.5 text-[11px]"
                          style={{ color: 'var(--theme-text-secondary)', borderBottom: '1px solid var(--theme-card-border)' }}
                        >
                          {row.light}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* SDK Code Snippets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-2xl overflow-hidden"
        style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
      >
        <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5" style={{ color: 'var(--theme-text-secondary)' }} />
            <span className="text-sm font-semibold" style={{ color: 'var(--theme-text)' }}>Code Examples</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] px-2.5 py-1.5 rounded-md transition-colors"
            style={{ backgroundColor: 'var(--theme-card-inner)', color: 'var(--theme-text-muted)' }}
          >
            {copiedSnippet ? (
              <><CheckCircle2 className="w-3 h-3" style={{ color: '#22c55e' }} /> Copied!</>
            ) : (
              <><Copy className="w-3 h-3" /> Copy</>
            )}
          </button>
        </div>

        <div className="px-5 pt-4 flex items-center gap-3 flex-wrap">
          {/* SDK toggle */}
          <div className="flex gap-1 rounded-lg p-0.5" style={{ backgroundColor: 'var(--theme-card-inner)' }}>
            {sdks.map((sdk) => (
              <button
                key={sdk.id}
                type="button"
                onClick={() => {
                  setActiveSnippetSdk(sdk.id);
                  const langs = Object.keys(sdkSnippets[sdk.id] || {});
                  if (!langs.includes(activeSnippetLang)) setActiveSnippetLang(langs[0] || 'python');
                }}
                className="text-[11px] font-medium px-3 py-1.5 rounded-md transition-colors"
                style={{
                  backgroundColor: activeSnippetSdk === sdk.id ? 'var(--theme-card)' : 'transparent',
                  color: activeSnippetSdk === sdk.id ? sdk.badgeColor : 'var(--theme-text-dim)',
                  border: activeSnippetSdk === sdk.id ? '1px solid var(--theme-card-border)' : '1px solid transparent',
                }}
              >
                {sdk.name}
              </button>
            ))}
          </div>

          {/* Language tabs */}
          <div className="flex gap-1">
            {snippetLangs.map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setActiveSnippetLang(lang)}
                className="text-[10px] font-mono px-2 py-1 rounded-md transition-colors"
                style={{
                  backgroundColor: activeSnippetLang === lang ? 'var(--theme-card-inner)' : 'transparent',
                  color: activeSnippetLang === lang ? 'var(--theme-text)' : 'var(--theme-text-dim)',
                  border: activeSnippetLang === lang ? '1px solid var(--theme-card-border)' : '1px solid transparent',
                }}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5">
          <pre
            className="text-[11px] leading-relaxed p-4 rounded-xl overflow-x-auto font-mono"
            style={{ backgroundColor: 'var(--theme-bg)', color: 'var(--theme-text-secondary)', border: '1px solid var(--theme-card-border)' }}
          >
            {sdkSnippets[activeSnippetSdk]?.[activeSnippetLang] || '// Select an SDK and language above'}
          </pre>
        </div>
      </motion.div>

      {/* How It All Comes Together */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-xl p-4"
        style={{
          backgroundColor: 'var(--theme-card)',
          border: '1px solid var(--theme-card-border)',
        }}
      >
        <h2 className="text-sm font-bold mb-3" style={{ color: 'var(--theme-text)' }}>
          How It Works
        </h2>
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2">
          {solutionFlow.map((step, i, arr) => (
            <div key={step.label} className="flex items-center gap-2 flex-shrink-0">
              <div className="text-center">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mx-auto mb-1.5"
                  style={{
                    backgroundColor: step.accent ? 'rgba(229,117,60,0.12)' : 'var(--theme-card-inner)',
                    border: step.accent ? '1px solid rgba(229,117,60,0.25)' : '1px solid var(--theme-card-border)',
                  }}
                >
                  <step.icon className="w-4 h-4" style={{ color: step.accent ? '#E5753C' : 'var(--theme-text-secondary)' }} />
                </div>
                <div className="text-[11px] font-semibold" style={{ color: step.accent ? '#E5753C' : 'var(--theme-text)' }}>
                  {step.label}
                </div>
                <div className="text-[10px] max-w-[110px]" style={{ color: 'var(--theme-text-muted)' }}>
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

      {/* Compliance badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 flex-wrap"
      >
        {[
          { label: 'NIST SP 800-208', accent: false },
          { label: 'CNSA 2.0', accent: true },
          { label: 'FIPS 140-3', accent: false },
          { label: 'IEC 62443', accent: false },
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
