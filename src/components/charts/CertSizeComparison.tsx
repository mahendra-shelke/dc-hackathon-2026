import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { certComparisons } from '../../data/certificates';
import { formatBytes } from '../../utils';

const colors = ['#64748b', '#64748b', '#0C6DFD', '#3B82F6', '#6366F1', '#8B5CF6'];

export function CertSizeBars() {
  const data = certComparisons.map((c) => ({
    name: c.algorithm,
    certSize: c.certSize,
    chainSize: c.chainSize,
  }));

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: 80, right: 20, top: 10, bottom: 10 }}>
          <XAxis
            type="number"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            tickFormatter={(v) => formatBytes(v)}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#e2e8f0', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              borderRadius: '8px',
              color: 'white',
              fontSize: '12px',
            }}
            formatter={(value, name) => [formatBytes(Number(value)), name === 'certSize' ? 'Single Cert' : '3-Cert Chain']}
          />
          <Bar dataKey="certSize" radius={[0, 4, 4, 0]} barSize={14}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} opacity={0.7} />
            ))}
          </Bar>
          <Bar dataKey="chainSize" radius={[0, 4, 4, 0]} barSize={14}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ChainStackSVG() {
  const ecdsa = certComparisons[1]; // ECDSA
  const mlDsa65 = certComparisons[3]; // ML-DSA-65
  const maxChain = mlDsa65.chainSize;
  const scale = 180 / maxChain;

  const renderStack = (comp: typeof ecdsa, x: number, label: string, color: string) => {
    const certH = comp.certSize * scale;
    const totalH = certH * 3 + 8; // 3 certs + gaps
    const startY = 200 - totalH;

    return (
      <g>
        <text x={x + 30} y={220} textAnchor="middle" fill="#94a3b8" fontSize="11">{label}</text>
        <text x={x + 30} y={238} textAnchor="middle" fill="#64748b" fontSize="10">{formatBytes(comp.chainSize)}</text>
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={x}
            y={startY + i * (certH + 4)}
            width={60}
            height={certH}
            rx={3}
            fill={color}
            opacity={0.8 - i * 0.15}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <text
            key={`t${i}`}
            x={x + 30}
            y={startY + i * (certH + 4) + certH / 2 + 4}
            textAnchor="middle"
            fill="white"
            fontSize="9"
          >
            {i === 0 ? 'Root' : i === 1 ? 'ICA' : 'EE'}
          </text>
        ))}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 300 250" className="w-full max-w-sm mx-auto">
      <text x="150" y="16" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">3-Certificate Chain Comparison</text>
      {renderStack(ecdsa, 50, 'ECDSA P-256', '#64748b')}
      {renderStack(mlDsa65, 190, 'ML-DSA-65', '#0C6DFD')}
      {/* Size multiplier */}
      <text x="150" y="160" textAnchor="middle" fill="#EAB308" fontSize="16" fontWeight="bold">
        {(mlDsa65.chainSize / ecdsa.chainSize).toFixed(0)}x larger
      </text>
    </svg>
  );
}

export function HandshakeComparison() {
  const steps = [
    { label: 'ClientHello', classical: 100, pqc: 100 },
    { label: 'ServerHello + Cert', classical: 2000, pqc: 21000 },
    { label: 'Key Exchange', classical: 200, pqc: 1800 },
    { label: 'Finished', classical: 100, pqc: 100 },
  ];

  const maxSize = 21000;
  const barWidth = 500;

  return (
    <svg viewBox="0 0 600 220" className="w-full">
      <text x="300" y="18" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">TLS Handshake Size Comparison</text>

      {steps.map((step, i) => {
        const y = 40 + i * 44;
        const classW = (step.classical / maxSize) * barWidth;
        const pqcW = (step.pqc / maxSize) * barWidth;

        return (
          <g key={step.label}>
            <text x="88" y={y + 10} textAnchor="end" fill="#94a3b8" fontSize="10">{step.label}</text>
            {/* Classical bar */}
            <rect x="95" y={y} width={classW} height={14} rx={2} fill="#64748b" opacity={0.7} />
            {/* PQC bar */}
            <rect x="95" y={y + 18} width={pqcW} height={14} rx={2} fill="#0C6DFD" opacity={0.8} />
          </g>
        );
      })}

      <g transform="translate(95, 215)">
        <rect width={10} height={10} rx={2} fill="#64748b" opacity={0.7} />
        <text x={16} y={9} fill="#94a3b8" fontSize="10">Classical (ECDSA)</text>
        <rect x={140} width={10} height={10} rx={2} fill="#0C6DFD" opacity={0.8} />
        <text x={156} y={9} fill="#94a3b8" fontSize="10">PQC (ML-DSA-65)</text>
      </g>
    </svg>
  );
}

export function BandwidthCalculator() {
  return null; // Implemented in the page component
}
