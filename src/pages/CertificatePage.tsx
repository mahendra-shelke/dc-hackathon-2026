import { useState } from 'react';
import GlassCard from '../components/common/GlassCard';
import { CertSizeBars, ChainStackSVG, HandshakeComparison } from '../components/charts/CertSizeComparison';
import { certComparisons } from '../data/certificates';
import { formatBytes } from '../utils';

export default function CertificatePage() {
  const [deviceCount, setDeviceCount] = useState(10000);
  const [handshakesPerDay, setHandshakesPerDay] = useState(24);

  const ecdsa = certComparisons[1];
  const mlDsa = certComparisons[3];
  const classicalDaily = deviceCount * handshakesPerDay * ecdsa.handshakeSize;
  const pqcDaily = deviceCount * handshakesPerDay * mlDsa.handshakeSize;
  const deltaMB = (pqcDaily - classicalDaily) / 1_048_576;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Certificate Size Impact</h1>
        <p className="text-sm text-slate-400 mt-1">
          PQC certificates are significantly larger — understand the bandwidth and storage implications
        </p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Size comparison bars */}
        <GlassCard className="p-6" delay={0.1}>
          <h3 className="text-sm font-semibold text-white mb-4">Certificate & Chain Sizes</h3>
          <CertSizeBars />
          <div className="flex gap-4 mt-2 justify-center">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-3 h-2 rounded-sm bg-slate-500 opacity-70" /> Single Cert
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="w-3 h-2 rounded-sm bg-slate-500" /> 3-Cert Chain
            </div>
          </div>
        </GlassCard>

        {/* Chain stack */}
        <GlassCard className="p-6" delay={0.15}>
          <h3 className="text-sm font-semibold text-white mb-4">Chain Size Visualization</h3>
          <ChainStackSVG />
        </GlassCard>

        {/* Handshake comparison */}
        <GlassCard className="p-6" delay={0.2}>
          <h3 className="text-sm font-semibold text-white mb-4">TLS Handshake Breakdown</h3>
          <HandshakeComparison />
        </GlassCard>

        {/* Bandwidth calculator */}
        <GlassCard className="p-6" delay={0.25}>
          <h3 className="text-sm font-semibold text-white mb-4">Bandwidth Impact Calculator</h3>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 block mb-1">Device Count</label>
              <input
                type="range"
                min={1000}
                max={50000}
                step={1000}
                value={deviceCount}
                onChange={(e) => setDeviceCount(Number(e.target.value))}
                className="w-full accent-[#0C6DFD]"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1K</span>
                <span className="text-white font-medium">{deviceCount.toLocaleString()}</span>
                <span>50K</span>
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">Handshakes / Device / Day</label>
              <input
                type="range"
                min={1}
                max={100}
                value={handshakesPerDay}
                onChange={(e) => setHandshakesPerDay(Number(e.target.value))}
                className="w-full accent-[#0C6DFD]"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>1</span>
                <span className="text-white font-medium">{handshakesPerDay}</span>
                <span>100</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-700/30 space-y-3">
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Classical Daily</span>
                <span className="text-sm text-white font-medium">{formatBytes(classicalDaily)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">PQC Daily</span>
                <span className="text-sm text-[#0C6DFD] font-medium">{formatBytes(pqcDaily)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-slate-700/30">
                <span className="text-xs text-slate-400">Additional Bandwidth</span>
                <span className="text-lg font-bold text-yellow-400">+{deltaMB.toFixed(1)} MB/day</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
