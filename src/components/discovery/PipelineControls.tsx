import { motion } from 'framer-motion';
import { Search, ShieldCheck, Rocket, CheckCircle2, Play } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { useDiscovery } from '../../hooks/useDiscovery';
import type { DiscoveryPipelineStep } from '../../types';

const steps = [
  { key: 'discovering' as const, label: 'DTM Discovery', icon: Search, product: 'Device Trust Manager' },
  { key: 'assessing' as const, label: 'TrustCore Assessment', icon: ShieldCheck, product: 'TrustCore SDK' },
  { key: 'deploying' as const, label: 'TrustEdge Deployment', icon: Rocket, product: 'TrustEdge' },
];

function stepIndex(step: DiscoveryPipelineStep): number {
  if (step === 'idle') return -1;
  if (step === 'discovering') return 0;
  if (step === 'assessing') return 1;
  if (step === 'deploying') return 2;
  return 3; // complete
}

export default function PipelineControls() {
  const {
    state,
    startDiscovery,
    startAssessment,
    startDeployment,
    resetDiscovery,
    connectedCount,
  } = useDiscovery();

  const currentIdx = stepIndex(state.pipelineStep);
  const isRunning = state.pipelineStep === 'discovering' || state.pipelineStep === 'assessing' || state.pipelineStep === 'deploying';
  const progressForStep = state.pipelineStep === 'discovering'
    ? state.discoveryProgress
    : state.pipelineStep === 'assessing'
      ? state.assessmentProgress
      : state.deploymentProgress;
  const isStepDone = progressForStep >= 100;

  function getButtonConfig() {
    if (state.pipelineStep === 'complete') {
      return { label: 'Run New Discovery', onClick: resetDiscovery, disabled: false };
    }
    if (state.pipelineStep === 'idle') {
      return { label: 'Start Discovery Scan', onClick: startDiscovery, disabled: connectedCount === 0 };
    }
    if (state.pipelineStep === 'discovering' && isStepDone) {
      return { label: 'Run TrustCore Assessment', onClick: startAssessment, disabled: false };
    }
    if (state.pipelineStep === 'assessing' && isStepDone) {
      return { label: 'Deploy Hybrid Certificates', onClick: startDeployment, disabled: false };
    }
    // Step in progress
    return { label: 'Processing...', onClick: () => {}, disabled: true };
  }

  const btn = getButtonConfig();

  return (
    <GlassCard className="p-5" delay={0.15}>
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-5">
        {steps.map((step, i) => {
          const isActive = currentIdx === i;
          const isDone = currentIdx > i || (currentIdx === i && isStepDone);
          const isFuture = currentIdx < i;
          const StepIcon = isDone ? CheckCircle2 : step.icon;

          return (
            <div key={step.key} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <motion.div
                  animate={{
                    scale: isActive && !isDone ? [1, 1.08, 1] : 1,
                    boxShadow: isActive && !isDone ? '0 0 16px rgba(12, 109, 253, 0.4)' : '0 0 0px transparent',
                  }}
                  transition={{ duration: 1.5, repeat: isActive && !isDone ? Infinity : 0 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    isDone
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                      : isActive
                        ? 'bg-[#0C6DFD]/20 border-[#0C6DFD] text-[#0C6DFD]'
                        : 'bg-slate-800/60 border-slate-600 text-slate-500'
                  }`}
                >
                  <StepIcon className="w-4.5 h-4.5" />
                </motion.div>
                <p className={`text-[11px] mt-1.5 font-medium ${isDone ? 'text-emerald-400' : isActive ? 'text-white' : 'text-slate-500'}`}>
                  {step.label}
                </p>
                <p className={`text-[10px] ${isFuture ? 'text-slate-600' : 'text-slate-400'}`}>
                  {step.product}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-16 h-0.5 mb-8 rounded-full transition-colors ${currentIdx > i ? 'bg-emerald-500' : currentIdx === i ? 'bg-[#0C6DFD]/50' : 'bg-slate-700'}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar (when step is running) */}
      {isRunning && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>{steps[currentIdx]?.label}</span>
            <span>{progressForStep}%</span>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#0C6DFD] rounded-full"
              animate={{ width: `${progressForStep}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Action button */}
      <button
        onClick={btn.onClick}
        disabled={btn.disabled}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0C6DFD] hover:bg-[#0955CC] disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
      >
        <Play className="w-4 h-4" />
        {btn.label}
      </button>
      {state.pipelineStep === 'idle' && connectedCount === 0 && (
        <p className="text-[11px] text-slate-500 text-center mt-2">Connect at least one platform to begin</p>
      )}
    </GlassCard>
  );
}
