import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import { Search, ArrowRight, RotateCcw } from 'lucide-react';
import ConnectorGrid from '../components/discovery/ConnectorGrid';
import { useDiscovery } from '../hooks/useDiscovery';
import { riskColor } from '../theme/colors';

export default function DiscoveryPage() {
  const { state, startDiscovery, resetDiscovery, connectedCount } = useDiscovery();
  const navigate = useNavigate();
  const isScanning = state.pipelineStep === 'discovering' && state.discoveryProgress < 100;
  const isDone = state.pipelineStep === 'complete';
  const devices = state.discoveredDevices;
  const criticalCount = devices.filter((d) => d.assessment?.riskLevel === 'critical').length;
  const highCount = devices.filter((d) => d.assessment?.riskLevel === 'high').length;

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>
            Device Discovery
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--theme-text-muted)' }}>
            Connect platforms and scan your fleet
          </p>
        </div>
        <div data-tour="discovery-scan" className="flex gap-2">
          {connectedCount > 0 && state.pipelineStep === 'idle' && (
            <button
              type="button"
              onClick={startDiscovery}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg"
              style={{ backgroundColor: 'var(--theme-text)', color: 'var(--theme-bg)' }}
            >
              <Search className="w-4 h-4" />
              Scan Fleet
            </button>
          )}
          {isDone && (
            <>
              <button
                type="button"
                onClick={() => navigate('/blueprint')}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg"
                style={{ backgroundColor: 'var(--theme-text)', color: 'var(--theme-bg)' }}
              >
                View Blueprint
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={resetDiscovery}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg"
                style={{ backgroundColor: 'var(--theme-card)', color: 'var(--theme-text)', border: '1px solid var(--theme-card-border)' }}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Connectors */}
      <div data-tour="discovery-connectors">
        <ConnectorGrid />
      </div>

      {/* Progress bar */}
      {isScanning && (
        <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}>
          <div className="flex items-center justify-between text-xs mb-2">
            <span style={{ color: 'var(--theme-text-secondary)' }}>
              Scanning... {devices.length} devices found
            </span>
            <span style={{ color: 'var(--theme-text-muted)' }}>{state.discoveryProgress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--theme-text-secondary)' }}
              animate={{ width: `${state.discoveryProgress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Summary when complete */}
      {isDone && (
        <div
          className="rounded-xl px-5 py-3 flex items-center gap-6 text-sm"
          style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
        >
          <span style={{ color: 'var(--theme-text)' }}>
            <strong>{devices.length}</strong> devices discovered
          </span>
          {criticalCount > 0 && (
            <span style={{ color: riskColor('critical') }}>
              {criticalCount} critical
            </span>
          )}
          {highCount > 0 && (
            <span style={{ color: riskColor('high') }}>
              {highCount} high risk
            </span>
          )}
          <span style={{ color: 'var(--theme-text-muted)' }}>
            {devices.filter((d) => d.assessment?.firmwareUpdateCapable).length} firmware-updatable
          </span>
        </div>
      )}

      {/* Device table */}
      {devices.length > 0 && (
        <div
          data-tour="discovery-devices"
          className="rounded-xl overflow-hidden"
          style={{ backgroundColor: 'var(--theme-card)', border: '1px solid var(--theme-card-border)' }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--theme-card-border)' }}>
                  {['Device', 'IP', 'Type', 'Algorithm', 'Industry', 'Risk', 'Recommended'].map((h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-4 font-medium"
                      style={{ color: 'var(--theme-text-muted)' }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {devices.map((d, i) => (
                  <motion.tr
                    key={d.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.15, delay: i * 0.02 }}
                    style={{ borderBottom: '1px solid var(--theme-card-border)' }}
                  >
                    <td className="py-2.5 px-4">
                      <div className="font-medium" style={{ color: 'var(--theme-text)' }}>{d.hostname}</div>
                      <div className="text-[10px]" style={{ color: 'var(--theme-text-dim)' }}>{d.manufacturer}</div>
                    </td>
                    <td className="py-2.5 px-4 font-mono" style={{ color: 'var(--theme-text-secondary)' }}>{d.ipAddress}</td>
                    <td className="py-2.5 px-4" style={{ color: 'var(--theme-text-secondary)' }}>{d.deviceType}</td>
                    <td className="py-2.5 px-4" style={{ color: 'var(--theme-text-secondary)' }}>{d.currentAlgorithm}</td>
                    <td className="py-2.5 px-4 capitalize" style={{ color: 'var(--theme-text-secondary)' }}>{d.industry}</td>
                    <td className="py-2.5 px-4">
                      {d.assessment ? (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-semibold capitalize"
                          style={{
                            color: riskColor(d.assessment.riskLevel),
                            backgroundColor: `${riskColor(d.assessment.riskLevel)}18`,
                          }}
                        >
                          {d.assessment.riskLevel} ({d.assessment.riskScore})
                        </span>
                      ) : (
                        <span style={{ color: 'var(--theme-text-dim)' }}>—</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      {d.assessment ? (
                        <span
                          className="text-[10px] font-medium px-2 py-0.5 rounded"
                          style={{ backgroundColor: 'var(--theme-card-inner)', color: 'var(--theme-text-secondary)' }}
                        >
                          {d.assessment.recommendedPqc}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--theme-text-dim)' }}>—</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
