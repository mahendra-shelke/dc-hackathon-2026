import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, X as XIcon, X } from 'lucide-react';
import type { PqcAlgorithm, DeviceClass } from '../../types';
import { pqcAlgorithms } from '../../data/algorithms';
import { formatBytes } from '../../utils';

const deviceClasses: { id: DeviceClass; label: string; description: string }[] = [
  { id: 'constrained', label: 'Constrained', description: 'ARM Cortex-M, <256KB RAM' },
  { id: 'mid-range', label: 'Mid-Range', description: 'ARM Cortex-A, 1-4MB RAM' },
  { id: 'powerful', label: 'Powerful', description: 'Multi-core, 512MB+ RAM' },
  { id: 'server-class', label: 'Server-Class', description: 'x86/ARM server, 4GB+ RAM' },
];

const suitConfig = {
  good:     { color: 'var(--theme-text)',      bg: 'rgba(241,241,243,0.08)', tip: 'Good fit — runs efficiently on this device class' },
  moderate: { color: '#E5753C',                bg: 'rgba(229,117,60,0.08)',  tip: 'Moderate — works but may strain resources' },
  poor:     { color: 'var(--theme-text-dim)',   bg: 'rgba(196,196,204,0.05)', tip: 'Poor fit — exceeds device capabilities' },
} as const;

const SuitabilityIcon = ({ level }: { level: 'good' | 'moderate' | 'poor' }) => {
  const cfg = suitConfig[level];
  if (level === 'good') return <Check className="w-4 h-4" style={{ color: cfg.color }} />;
  if (level === 'moderate') return <AlertTriangle className="w-4 h-4" style={{ color: cfg.color }} />;
  return <XIcon className="w-4 h-4" style={{ color: cfg.color }} />;
};

export default function AlgorithmMatrix() {
  const [selected, setSelected] = useState<PqcAlgorithm | null>(null);

  return (
    <div>
      {/* Matrix grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left text-xs text-slate-400 uppercase tracking-wider p-3 w-36">Device Class</th>
              {pqcAlgorithms.map((alg) => (
                <th
                  key={alg.id}
                  className="text-center text-xs text-slate-400 p-2 cursor-pointer hover:text-white transition-colors"
                  onClick={() => setSelected(alg)}
                >
                  <div className="font-semibold">{alg.name}</div>
                  <div className="text-[10px] text-slate-500 font-normal mt-0.5">
                    {alg.type === 'kem' ? 'KEM' : 'SIG'} · L{alg.nistLevel}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deviceClasses.map((dc, rowIdx) => (
              <motion.tr
                key={dc.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIdx * 0.1 }}
                className="border-t border-slate-700/30"
              >
                <td className="p-3">
                  <div className="text-sm font-medium text-white">{dc.label}</div>
                  <div className="text-[10px] text-slate-500">{dc.description}</div>
                </td>
                {pqcAlgorithms.map((alg) => {
                  const suit = alg.suitability[dc.id];
                  return (
                    <td key={alg.id} className="p-2 text-center">
                      <button
                        onClick={() => setSelected(alg)}
                        title={`${alg.name} on ${dc.label}: ${suitConfig[suit].tip}`}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-lg transition-colors"
                        style={{ backgroundColor: suitConfig[suit].bg }}
                      >
                        <SuitabilityIcon level={suit} />
                      </button>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-700/30">
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--theme-text-muted)' }} title={suitConfig.good.tip}>
          <Check className="w-3.5 h-3.5" style={{ color: 'var(--theme-text)' }} /> Good fit
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--theme-text-muted)' }} title={suitConfig.moderate.tip}>
          <AlertTriangle className="w-3.5 h-3.5" style={{ color: '#E5753C' }} /> Moderate
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--theme-text-muted)' }} title={suitConfig.poor.tip}>
          <XIcon className="w-3.5 h-3.5" style={{ color: 'var(--theme-text-dim)' }} /> Poor fit
        </div>
      </div>

      {/* Detail panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
              style={{ backgroundColor: 'var(--theme-modal-bg)', border: '1px solid var(--theme-card-border)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                  <p className="text-sm text-slate-400">{selected.family}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-slate-800 rounded-lg">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Type</p>
                  <p className="text-sm font-semibold text-white uppercase">{selected.type === 'kem' ? 'Key Encapsulation' : 'Digital Signature'}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">NIST Level</p>
                  <p className="text-sm font-semibold text-white">{selected.nistLevel}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Public Key</p>
                  <p className="text-sm font-semibold text-white">{formatBytes(selected.publicKeySize)}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">{selected.type === 'kem' ? 'Ciphertext' : 'Signature'}</p>
                  <p className="text-sm font-semibold text-white">
                    {formatBytes(selected.type === 'kem' ? selected.ciphertextSize! : selected.signatureSize!)}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/30 rounded-lg p-3">
                <p className="text-xs text-slate-400 mb-1">Notes</p>
                <p className="text-sm text-slate-200">{selected.notes}</p>
              </div>

              <div className="mt-4 space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider">Suitability by Device Class</p>
                {deviceClasses.map((dc) => (
                  <div key={dc.id} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">{dc.label}</span>
                    <div className="flex items-center gap-2">
                      <SuitabilityIcon level={selected.suitability[dc.id]} />
                      <span className="text-xs text-slate-400 capitalize w-16">{selected.suitability[dc.id]}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
