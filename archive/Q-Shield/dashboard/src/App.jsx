import { useState, useEffect, useRef, useCallback } from 'react';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import {
  Shield, ShieldAlert, Zap, Activity,
  Wifi, WifiOff, AlertTriangle, Radio
} from 'lucide-react';
import './App.css';

const MAX_DATA_POINTS = 30;
const WS_URL = 'ws://localhost:8080';
const ATTACK_URL = 'http://localhost:8080/toggle-attack';

function App() {
  const [metrics, setMetrics] = useState({
    pqc_latency: 0,
    legacy_latency: 0,
    pqc_bandwidth: 0,
    legacy_bandwidth: 0,
    attack_active: false,
  });
  const [latencyHistory, setLatencyHistory] = useState([]);
  const [bandwidthHistory, setBandwidthHistory] = useState([]);
  const [connected, setConnected] = useState(false);
  const [attackLoading, setAttackLoading] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimer = useRef(null);

  // --- WebSocket connection with auto-reconnect ---
  const connectWS = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      console.log('[Q-Shield] WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMetrics(data);

        const now = new Date().toLocaleTimeString('en-US', {
          hour12: false, minute: '2-digit', second: '2-digit'
        });

        setLatencyHistory((prev) => {
          const next = [...prev, { time: now, PQC: data.pqc_latency, Legacy: data.legacy_latency }];
          return next.slice(-MAX_DATA_POINTS);
        });

        setBandwidthHistory((prev) => {
          const next = [...prev, { time: now, PQC: data.pqc_bandwidth, Legacy: data.legacy_bandwidth }];
          return next.slice(-MAX_DATA_POINTS);
        });
      } catch (e) {
        console.error('[Q-Shield] Parse error:', e);
      }
    };

    ws.onclose = () => {
      setConnected(false);
      console.log('[Q-Shield] WebSocket closed — reconnecting in 2s');
      reconnectTimer.current = setTimeout(connectWS, 2000);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    connectWS();
    return () => {
      wsRef.current?.close();
      clearTimeout(reconnectTimer.current);
    };
  }, [connectWS]);

  // --- Toggle attack ---
  const toggleAttack = async () => {
    setAttackLoading(true);
    try {
      const res = await fetch(ATTACK_URL, { method: 'POST' });
      const data = await res.json();
      setMetrics((prev) => ({ ...prev, attack_active: data.attack_active }));
    } catch (e) {
      console.error('[Q-Shield] Attack toggle failed:', e);
    } finally {
      setAttackLoading(false);
    }
  };

  const isAttack = metrics.attack_active;

  return (
    <div className={isAttack ? 'alert-active' : ''}>
      {/* Critical Alert Overlay */}
      {isAttack && (
        <>
          <div className="critical-overlay" />
          <div className="critical-banner">
            <AlertTriangle size={14} style={{ verticalAlign: 'middle', marginRight: 8 }} />
            ⚠ CRITICAL ALERT — Quantum Attack In Progress — Legacy Channel Compromised ⚠
          </div>
        </>
      )}

      <div className="app">
        {/* Header */}
        <header className="header">
          <div className="header-left">
            <div className="logo-icon">
              <Shield size={24} color="#0a0a0f" />
            </div>
            <div className="logo-text">
              <h1>Q-SHIELD</h1>
              <p>Post-Quantum Cryptography Orchestrator</p>
            </div>
          </div>
          <div className="header-right">
            <div className="ws-status">
              {connected ? <Wifi size={12} /> : <WifiOff size={12} />}
              <span className={`ws-dot ${connected ? 'connected' : ''}`} />
              {connected ? 'PROXY STREAM ACTIVE' : 'DISCONNECTED'}
            </div>
            <div className={`status-badge ${isAttack ? 'danger' : 'safe'}`}>
              <span className="status-dot" />
              {isAttack ? 'UNDER ATTACK' : 'SECURE'}
            </div>
          </div>
        </header>

        {/* Top Metrics Bar */}
        <div className="metrics-bar">
          <div className="metric-item">
            <div className="metric-label">PQC Latency</div>
            <div className="metric-value green">{metrics.pqc_latency}</div>
            <div className="metric-unit">ms (Kyber-768)</div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Legacy Latency</div>
            <div className="metric-value blue">{metrics.legacy_latency}</div>
            <div className="metric-unit">ms (ECDSA)</div>
          </div>
          <div className="metric-item">
            <div className="metric-label">PQC Bandwidth</div>
            <div className="metric-value green">{metrics.pqc_bandwidth}</div>
            <div className="metric-unit">bytes / packet</div>
          </div>
          <div className="metric-item">
            <div className="metric-label">Legacy Bandwidth</div>
            <div className="metric-value blue">{metrics.legacy_bandwidth}</div>
            <div className="metric-unit">bytes / packet</div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="dashboard-grid">
          {/* Latency Chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Activity size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Latency Comparison
              </span>
              <span className="card-badge">LIVE</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={latencyHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fill: '#4a5068', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#4a5068', fontSize: 10 }} unit="ms" />
                  <Tooltip
                    contentStyle={{
                      background: '#0f1118',
                      border: '1px solid rgba(0,212,255,0.3)',
                      borderRadius: 8,
                      fontFamily: 'JetBrains Mono',
                      fontSize: 12,
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="PQC"
                    stroke="#00ff88"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#00ff88' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="Legacy"
                    stroke="#00d4ff"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#00d4ff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bandwidth Chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Radio size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Bandwidth Overhead
              </span>
              <span className="card-badge">LIVE</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bandwidthHistory.slice(-8)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fill: '#4a5068', fontSize: 10 }} />
                  <YAxis tick={{ fill: '#4a5068', fontSize: 10 }} unit="B" />
                  <Tooltip
                    contentStyle={{
                      background: '#0f1118',
                      border: '1px solid rgba(0,212,255,0.3)',
                      borderRadius: 8,
                      fontFamily: 'JetBrains Mono',
                      fontSize: 12,
                    }}
                  />
                  <Legend />
                  <Bar dataKey="PQC" fill="#00ff88" radius={[4, 4, 0, 0]} opacity={0.85} />
                  <Bar dataKey="Legacy" fill="#00d4ff" radius={[4, 4, 0, 0]} opacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PQC Algorithms Comparison */}
          {metrics.algorithms && Object.keys(metrics.algorithms).length > 0 && (
            <div className="card" style={{ gridColumn: '1 / -1', minHeight: '260px' }}>
              <div className="card-header">
                <span className="card-title">
                  <Activity size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Real PQC Algorithm Performance (liboqs)
                </span>
                <span className="card-badge">LIVE MS</span>
              </div>
              <div className="chart-container" style={{ paddingBottom: '10px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.values(metrics.algorithms).sort((a, b) => a.total_ms - b.total_ms)}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" tick={{ fill: '#4a5068', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#4a5068', fontSize: 10 }} unit="ms" />
                    <Tooltip
                      contentStyle={{
                        background: '#0a0a0f',
                        border: '1px solid rgba(189,0,255,0.3)',
                        borderRadius: 8,
                        fontFamily: 'JetBrains Mono',
                        fontSize: 12,
                        boxShadow: '0 0 10px rgba(189,0,255,0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="total_ms" name="Total Processing Time" fill="#bd00ff" radius={[4, 4, 0, 0]} opacity={0.85} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Attack Control */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <ShieldAlert size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Attack Simulation
              </span>
              <span className="card-badge" style={isAttack ? { color: '#ff2d55', borderColor: 'rgba(255,45,85,0.3)', background: 'rgba(255,45,85,0.1)' } : {}}>
                {isAttack ? 'ACTIVE' : 'STANDBY'}
              </span>
            </div>
            <div className="attack-panel">
              <button
                className={`attack-btn ${isAttack ? 'active' : ''}`}
                onClick={toggleAttack}
                disabled={attackLoading}
              >
                <span>
                  <Zap size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
                  {isAttack ? 'Stop Quantum Attack' : 'Simulate Quantum Attack'}
                </span>
              </button>
              <div className={`attack-status ${isAttack ? 'active' : ''}`}>
                {isAttack
                  ? '⚠ Legacy channel corrupted — PQC channel secured'
                  : '● All channels operating normally'
                }
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', maxWidth: 320 }}>
                Simulates a "Harvest Now, Decrypt Later" quantum attack by corrupting
                legacy ECDSA traffic while PQC-protected traffic remains intact.
              </div>
            </div>
          </div>

          {/* Packet Inspector */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">
                <Shield size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Packet Inspector
              </span>
              <span className="card-badge">LIVE FLOW</span>
            </div>
            <div className="packet-inspector">
              <div className="packet-box-wrapper">
                <div
                  className={`packet-box legacy ${isAttack ? 'corrupted' : ''}`}
                  style={{
                    width: Math.max(60, Math.min(100, metrics.legacy_bandwidth * 1.2)),
                    height: Math.max(60, Math.min(100, metrics.legacy_bandwidth * 1.2)),
                  }}
                >
                  {isAttack ? '✕✕' : `${metrics.legacy_bandwidth} B`}
                </div>
                <div className="packet-label">Legacy</div>
                <div className="packet-algo">
                  {isAttack ? '⚠ CORRUPTED' : 'ECDSA-P256'}
                </div>
                <div className="packet-algo">
                  {metrics.legacy_packets || 0} packets
                </div>
              </div>
              <div style={{ color: 'var(--text-muted)', fontFamily: 'JetBrains Mono', fontSize: '0.7rem' }}>
                vs
              </div>
              <div className="packet-box-wrapper">
                <div
                  className="packet-box pqc"
                  style={{
                    width: Math.max(120, Math.min(180, metrics.pqc_bandwidth / 16)),
                    height: Math.max(120, Math.min(180, metrics.pqc_bandwidth / 16)),
                  }}
                >
                  {metrics.pqc_bandwidth.toLocaleString()} B
                </div>
                <div className="packet-label">PQC</div>
                <div className="packet-algo">Kyber-768 + Dilithium</div>
                <div className="packet-algo">
                  {metrics.pqc_packets || 0} packets
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 8 }}>
              PQC encapsulation: ~{Math.round(metrics.pqc_bandwidth / Math.max(1, metrics.legacy_bandwidth))}× more bytes per packet — the cost of quantum safety
            </div>
          </div>

          {/* Payload Viewer */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card-header">
              <span className="card-title">
                <Shield size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Live Telemetry Payload Stream
              </span>
              <span className="card-badge">RAW JSON</span>
            </div>
            <div className="payload-viewer">
              <div className="payload-block pqc">
                <div className="payload-title"><span>PQC-Encrypted Packet</span><span style={{ color: 'var(--neon-green)' }}>SECURE</span></div>
                {metrics.last_pqc_payload || 'Waiting for PQC telemetry...'}
              </div>
              <div className="payload-block legacy" style={isAttack ? { borderLeftColor: 'var(--neon-red)', color: 'var(--neon-red)' } : {}}>
                <div className="payload-title"><span>Legacy ECDSA Packet</span>{isAttack ? <span style={{ color: 'var(--neon-red)' }}>COMPROMISED</span> : <span style={{ color: 'var(--neon-blue)' }}>VULNERABLE</span>}</div>
                {isAttack ? '{"error": "DECRYPTION_FAILED", "data": "CORRUPTED"}' : (metrics.last_legacy_payload || 'Waiting for legacy telemetry...')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
