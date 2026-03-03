import GlassCard from '../components/common/GlassCard';
import AlgorithmMatrix from '../components/charts/AlgorithmMatrix';

export default function AlgorithmPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Algorithm Suitability Matrix</h1>
        <p className="text-sm text-slate-400 mt-1">
          NIST-standardized PQC algorithms mapped to device capabilities — not every algorithm fits every device
        </p>
      </div>

      <GlassCard className="p-6" delay={0.1}>
        <AlgorithmMatrix />
      </GlassCard>

      {/* Quick reference cards */}
      <div className="grid grid-cols-3 gap-4">
        <GlassCard className="p-5" delay={0.2}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#0C6DFD]" />
            <h4 className="text-sm font-semibold text-white">ML-DSA (Dilithium)</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            FIPS 204 — Primary NIST signature standard. Lattice-based. Best general-purpose
            choice for IoT device authentication and code signing.
          </p>
        </GlassCard>
        <GlassCard className="p-5" delay={0.3}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#10B981]" />
            <h4 className="text-sm font-semibold text-white">ML-KEM (Kyber)</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            FIPS 203 — Key encapsulation mechanism for TLS key exchange. Compact sizes
            make it suitable for even constrained devices.
          </p>
        </GlassCard>
        <GlassCard className="p-5" delay={0.4}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
            <h4 className="text-sm font-semibold text-white">SLH-DSA & FN-DSA</h4>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            FIPS 205 (SPHINCS+) — Hash-based, conservative choice. FN-DSA (Falcon) —
            Smallest signatures but complex implementation.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
