import { motion } from 'framer-motion';
import AnimatedNumber from '../common/AnimatedNumber';
import { useDiscovery } from '../../hooks/useDiscovery';

export default function ScanVisualization() {
  const { state } = useDiscovery();
  const deviceCount = state.discoveredDevices.length;
  const isScanning = state.pipelineStep === 'discovering' && state.discoveryProgress < 100;

  return (
    <div className="relative flex items-center justify-center" style={{ minHeight: 280 }}>
      <svg viewBox="0 0 300 300" className="w-full max-w-[280px]">
        {/* Concentric circles */}
        {[120, 90, 60, 30].map((r) => (
          <circle
            key={r}
            cx={150} cy={150} r={r}
            fill="none"
            stroke="rgba(100,116,139,0.15)"
            strokeWidth={1}
          />
        ))}

        {/* Sweep line (rotating) */}
        {isScanning && (
          <motion.line
            x1={150} y1={150} x2={150} y2={30}
            stroke="rgba(12,109,253,0.5)"
            strokeWidth={2}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '150px 150px' }}
          />
        )}

        {/* Sweep gradient cone */}
        {isScanning && (
          <>
            <defs>
              <linearGradient id="sweep-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(12,109,253,0)" />
                <stop offset="100%" stopColor="rgba(12,109,253,0.15)" />
              </linearGradient>
            </defs>
            <motion.path
              d={`M 150 150 L 150 30 A 120 120 0 0 1 ${150 + 120 * Math.sin(Math.PI / 6)} ${150 - 120 * Math.cos(Math.PI / 6)} Z`}
              fill="url(#sweep-grad)"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '150px 150px' }}
            />
          </>
        )}

        {/* Device dots */}
        {state.discoveredDevices.map((device, i) => {
          // Distribute dots in concentric rings based on index
          const angle = (i * 137.5) * (Math.PI / 180); // golden angle
          const ring = (i % 4);
          const radius = 30 + ring * 28 + (i % 7) * 3;
          const cx = 150 + Math.cos(angle) * radius;
          const cy = 150 + Math.sin(angle) * radius;

          return (
            <motion.circle
              key={device.id}
              cx={cx}
              cy={cy}
              r={3}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="fill-[#0C6DFD]"
            />
          );
        })}

        {/* Center circle with count */}
        <circle cx={150} cy={150} r={24} fill="rgba(15,23,42,0.8)" stroke="rgba(12,109,253,0.3)" strokeWidth={1.5} />
      </svg>

      {/* Center count overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <AnimatedNumber value={deviceCount} className="text-2xl font-bold text-[#0C6DFD]" />
          <p className="text-[10px] text-slate-400 mt-0.5">devices</p>
        </div>
      </div>
    </div>
  );
}
