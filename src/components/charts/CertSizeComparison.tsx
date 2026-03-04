import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { certComparisons } from '../../data/certificates';
import { formatBytes } from '../../utils';

// Classical → muted cool, PQC → warm gradient anchored on orange accent
const colors = [
  '#6B7280', // RSA-2048     — cool gray (classical)
  '#9CA3AF', // ECDSA P-256  — lighter gray (classical)
  '#C4856A', // ML-DSA-44    — soft terra cotta (PQC)
  '#E5753C', // ML-DSA-65    — orange accent (PQC hero, CNSA 2.0 default)
  '#BF5A30', // ML-DSA-87    — deep burnt orange (PQC max)
  '#A38B70', // FN-DSA-512   — warm bronze (PQC alt)
];

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
              <Cell key={i} fill={colors[i]} opacity={0.5} />
            ))}
          </Bar>
          <Bar dataKey="chainSize" radius={[0, 4, 4, 0]} barSize={14}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i]} opacity={0.9} />
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

  const barW = 70;

  const renderStack = (comp: typeof ecdsa, x: number, label: string, color: string) => {
    const certH = comp.certSize * scale;
    const totalH = certH * 3 + 8; // 3 certs + gaps
    const startY = 210 - totalH;
    const cx = x + barW / 2;

    return (
      <g>
        <text x={cx} y={232} textAnchor="middle" fill="#94a3b8" fontSize="11">{label}</text>
        <text x={cx} y={248} textAnchor="middle" fill="#64748b" fontSize="10">{formatBytes(comp.chainSize)}</text>
        {[0, 1, 2].map((i) => (
          <rect
            key={i}
            x={x}
            y={startY + i * (certH + 4)}
            width={barW}
            height={certH}
            rx={4}
            fill={color}
            opacity={0.85 - i * 0.12}
          />
        ))}
        {[0, 1, 2].map((i) => (
          <text
            key={`t${i}`}
            x={cx}
            y={startY + i * (certH + 4) + certH / 2 + 4}
            textAnchor="middle"
            fill="white"
            fontSize="9"
            fontWeight="500"
          >
            {i === 0 ? 'Root' : i === 1 ? 'ICA' : 'EE'}
          </text>
        ))}
      </g>
    );
  };

  return (
    <svg viewBox="0 0 400 260" className="w-full max-w-md mx-auto">
      <text x="200" y="18" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600">3-Certificate Chain Comparison</text>
      {renderStack(ecdsa, 60, 'ECDSA P-256', '#9CA3AF')}
      {renderStack(mlDsa65, 260, 'ML-DSA-65', '#E5753C')}
      {/* Size multiplier */}
      <text x="200" y="165" textAnchor="middle" fill="#E5753C" fontSize="15" fontWeight="bold">
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
            <rect x="95" y={y} width={classW} height={14} rx={2} fill="#9CA3AF" opacity={0.6} />
            {/* PQC bar */}
            <rect x="95" y={y + 18} width={pqcW} height={14} rx={2} fill="#E5753C" opacity={0.85} />
          </g>
        );
      })}

      <g transform="translate(95, 215)">
        <rect width={10} height={10} rx={2} fill="#9CA3AF" opacity={0.6} />
        <text x={16} y={9} fill="#94a3b8" fontSize="10">Classical (ECDSA)</text>
        <rect x={140} width={10} height={10} rx={2} fill="#E5753C" opacity={0.85} />
        <text x={156} y={9} fill="#94a3b8" fontSize="10">PQC (ML-DSA-65)</text>
      </g>
    </svg>
  );
}

export function BandwidthCalculator() {
  return null; // Implemented in the page component
}
