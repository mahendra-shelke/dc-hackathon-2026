import { motion } from 'framer-motion';
import { RiskBadge } from '../common/StatusBadge';
import { useDiscovery } from '../../hooks/useDiscovery';
import { riskColor } from '../../theme/colors';

const algoLabels = ['ML-DSA-44', 'ML-DSA-65', 'ML-DSA-87'];
const compatDot: Record<string, string> = {
  compatible: 'bg-emerald-400',
  partial: 'bg-yellow-400',
  incompatible: 'bg-red-400',
};

export default function AssessmentTable() {
  const { state } = useDiscovery();
  const assessed = state.discoveredDevices.filter((d) => d.assessment);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-700/50">
            <th className="text-left py-2 px-3 text-slate-400 font-medium">Device</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">IP</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">Current Algo</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">Class</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">Risk</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">FW Update</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">Recommended</th>
            <th className="text-left py-2 px-3 text-slate-400 font-medium">Compatibility</th>
          </tr>
        </thead>
        <tbody>
          {assessed.map((device, i) => (
            <motion.tr
              key={device.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: i * 0.03 }}
              className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
            >
              <td className="py-2 px-3">
                <div>
                  <p className="text-white font-medium">{device.hostname}</p>
                  <p className="text-slate-500 text-[10px]">{device.manufacturer}</p>
                </div>
              </td>
              <td className="py-2 px-3 text-slate-300 font-mono">{device.ipAddress}</td>
              <td className="py-2 px-3 text-slate-300">{device.currentAlgorithm}</td>
              <td className="py-2 px-3 text-slate-300 capitalize">{device.deviceClass}</td>
              <td className="py-2 px-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-medium" style={{ color: riskColor(device.assessment!.riskLevel) }}>
                    {device.assessment!.riskScore}
                  </span>
                  <RiskBadge level={device.assessment!.riskLevel} />
                </div>
              </td>
              <td className="py-2 px-3">
                {device.assessment!.firmwareUpdateCapable ? (
                  <span className="text-emerald-400">Yes</span>
                ) : (
                  <span className="text-red-400">No</span>
                )}
              </td>
              <td className="py-2 px-3">
                <span className="px-2 py-0.5 text-[11px] font-medium rounded-full bg-[#0C6DFD]/20 text-[#0C6DFD] border border-[#0C6DFD]/30">
                  {device.assessment!.recommendedPqc}
                </span>
              </td>
              <td className="py-2 px-3">
                <div className="flex items-center gap-1.5">
                  {algoLabels.map((algo) => (
                    <div key={algo} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${compatDot[device.assessment!.algorithmCompatibility[algo]] ?? 'bg-slate-600'}`} />
                      <span className="text-[10px] text-slate-500">{algo.split('-').pop()}</span>
                    </div>
                  ))}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      {assessed.length === 0 && (
        <div className="py-8 text-center text-slate-500 text-sm">Assessment in progress...</div>
      )}
    </div>
  );
}
