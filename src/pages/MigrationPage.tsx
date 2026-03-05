import { Search, Code, Rocket, ShieldCheck } from 'lucide-react';
import GlassCard from '../components/common/GlassCard';
import MigrationGantt from '../components/charts/MigrationGantt';

const productCards = [
  {
    phase: 'Discovery & Audit',
    product: 'Device Trust Manager',
    icon: Search,
    color: '#A1A1AA',
    description: 'Automated discovery and inventory of all device certificates, keys, and cryptographic algorithms across the entire fleet.',
    features: ['Certificate inventory', 'Algorithm detection', 'Risk scoring', 'Compliance gaps'],
  },
  {
    phase: 'Testing & Validation',
    product: 'TrustEdge Light',
    icon: Code,
    color: '#8B5CF6',
    description: 'Embeddable PQC cryptographic library for device firmware. Supports ML-DSA, ML-KEM, and hybrid modes.',
    features: ['PQC library integration', 'Hardware validation', 'Performance benchmarks', 'FIPS compliance'],
  },
  {
    phase: 'Hybrid Deployment',
    product: 'TrustEdge',
    icon: Rocket,
    color: '#F97316',
    description: 'Secure OTA update platform for deploying hybrid certificates that maintain backward compatibility.',
    features: ['OTA certificate updates', 'Hybrid cert support', 'Rollback capability', 'Fleet staging'],
  },
  {
    phase: 'Full PQC',
    product: 'Software Trust Manager',
    icon: ShieldCheck,
    color: '#10B981',
    description: 'Centralized lifecycle management for pure PQC certificates with automated rotation and compliance reporting.',
    features: ['PQC cert lifecycle', 'Auto-rotation', 'Compliance dashboards', 'Crypto-agility'],
  },
];

export default function MigrationPage() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Migration Sequencer</h1>
        <p className="text-sm text-slate-400 mt-1">
          Phased migration timeline across industries — DigiCert has a product for every phase
        </p>
      </div>

      {/* Gantt chart */}
      <GlassCard className="p-6" delay={0.1}>
        <h3 className="text-sm font-semibold text-white mb-4">Industry Migration Timeline (2026-2031)</h3>
        <MigrationGantt />
      </GlassCard>

      {/* DigiCert product cards */}
      <div>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">DigiCert Solutions by Phase</h3>
        <div className="grid grid-cols-4 gap-4">
          {productCards.map((card, i) => (
            <GlassCard key={card.product} className="p-5" delay={0.2 + i * 0.1}>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg" style={{ backgroundColor: `${card.color}20` }}>
                  <card.icon className="w-5 h-5" style={{ color: card.color }} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-wider">{card.phase}</div>
                  <div className="text-sm font-semibold text-white">{card.product}</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">{card.description}</p>
              <div className="space-y-1.5">
                {card.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: card.color }} />
                    <span className="text-[11px] text-slate-400">{f}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  );
}
