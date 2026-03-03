import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { DeviceGroup } from '../../types';
import { deviceGroups } from '../../data/devices';
import { riskColor } from '../../theme/colors';
import { PqcBadge, RiskBadge } from '../common/StatusBadge';
import FilterBar from '../common/FilterBar';

export default function FleetHeatmapGrid() {
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selected, setSelected] = useState<DeviceGroup | null>(null);

  const filtered = deviceGroups.filter((d) => {
    if (industryFilter !== 'all' && d.industry !== industryFilter) return false;
    if (statusFilter !== 'all' && d.pqcStatus !== statusFilter) return false;
    return true;
  });

  const cellColor = (d: DeviceGroup) => {
    if (d.riskScore >= 75) return '#EF4444';
    if (d.riskScore >= 50) return '#F97316';
    if (d.riskScore >= 25) return '#EAB308';
    return '#22C55E';
  };

  return (
    <div>
      <FilterBar
        filters={[
          {
            label: 'Industry',
            value: industryFilter,
            options: [
              { value: 'all', label: 'All Industries' },
              { value: 'medical', label: 'Medical' },
              { value: 'automotive', label: 'Automotive' },
              { value: 'smart-home', label: 'Smart Home' },
              { value: 'industrial', label: 'Industrial' },
              { value: 'enterprise', label: 'Enterprise' },
            ],
            onChange: setIndustryFilter,
          },
          {
            label: 'Status',
            value: statusFilter,
            options: [
              { value: 'all', label: 'All Status' },
              { value: 'not-ready', label: 'Not Ready' },
              { value: 'hybrid', label: 'Hybrid' },
              { value: 'ready', label: 'PQC Ready' },
            ],
            onChange: setStatusFilter,
          },
        ]}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((device, index) => (
          <motion.div
            key={device.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
            onClick={() => setSelected(device)}
            className="relative bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 cursor-pointer hover:bg-slate-800/60 transition-all group"
            style={{ borderColor: `${cellColor(device)}40` }}
          >
            {/* Risk indicator dot */}
            <div
              className="absolute top-3 right-3 w-3 h-3 rounded-full"
              style={{ backgroundColor: cellColor(device), boxShadow: `0 0 8px ${cellColor(device)}60` }}
            />

            <h4 className="text-sm font-semibold text-white mb-1 pr-4">{device.name}</h4>
            <p className="text-xs text-slate-400 capitalize mb-3">{device.industry.replace('-', ' ')}</p>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Devices</span>
                <span className="text-white font-medium">{device.count.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-500">Risk</span>
                <span className="font-bold" style={{ color: cellColor(device) }}>{device.riskScore}</span>
              </div>
              {/* Risk bar */}
              <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${device.riskScore}%`, backgroundColor: cellColor(device) }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Drill-down panel */}
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
              className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 max-w-lg w-full mx-4 shadow-2xl"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{selected.name}</h3>
                  <p className="text-sm text-slate-400 capitalize">{selected.industry.replace('-', ' ')} — {selected.deviceClass}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-1 hover:bg-slate-800 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Device Count</p>
                  <p className="text-lg font-bold text-white">{selected.count.toLocaleString()}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Risk Score</p>
                  <p className="text-lg font-bold" style={{ color: riskColor(selected.riskLevel) }}>{selected.riskScore}/100</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Current Algorithm</p>
                  <p className="text-sm font-semibold text-white">{selected.currentAlgorithm}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Recommended PQC</p>
                  <p className="text-sm font-semibold text-emerald-400">{selected.recommendedPqc}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">PQC Status</span>
                  <PqcBadge status={selected.pqcStatus} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Risk Level</span>
                  <RiskBadge level={selected.riskLevel} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Firmware Updatable</span>
                  <span className={`text-sm font-medium ${selected.firmwareUpdatable ? 'text-emerald-400' : 'text-red-400'}`}>
                    {selected.firmwareUpdatable ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Cert Expiry</span>
                  <span className={`text-sm font-medium ${selected.certExpiryMonths <= 6 ? 'text-red-400' : 'text-white'}`}>
                    {selected.certExpiryMonths} months
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Data at Risk</span>
                  <span className="text-sm font-medium text-white">{selected.dataAtRiskTB} TB</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
