import { AnimatePresence, motion } from 'framer-motion';
import ConnectorGrid from '../components/discovery/ConnectorGrid';
import PipelineControls from '../components/discovery/PipelineControls';
import DiscoveryPanel from '../components/discovery/DiscoveryPanel';
import AssessmentPanel from '../components/discovery/AssessmentPanel';
import DeploymentPanel from '../components/discovery/DeploymentPanel';
import DiscoverySummary from '../components/discovery/DiscoverySummary';
import { useDiscovery } from '../hooks/useDiscovery';

export default function DiscoveryPage() {
  const { state } = useDiscovery();
  const step = state.pipelineStep;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Device Discovery</h1>
        <p className="text-sm text-slate-400 mt-1">
          Connect to IoT platforms and run the DTM → TrustCore → TrustEdge pipeline
        </p>
      </div>

      {/* Connectors always visible */}
      <ConnectorGrid />

      {/* Pipeline controls */}
      <PipelineControls />

      {/* Conditional panels based on pipeline step */}
      <AnimatePresence mode="wait">
        {step === 'discovering' && (
          <motion.div
            key="discovering"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DiscoveryPanel />
          </motion.div>
        )}

        {step === 'assessing' && (
          <motion.div
            key="assessing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AssessmentPanel />
          </motion.div>
        )}

        {step === 'deploying' && (
          <motion.div
            key="deploying"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DeploymentPanel />
          </motion.div>
        )}

        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DiscoverySummary />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
