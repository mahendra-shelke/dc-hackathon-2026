import { motion } from 'framer-motion';
import { Search, ShieldCheck, Rocket, CheckCircle2, Play } from 'lucide-react';
import GlassCard from '../common/GlassCard';
import { useDiscovery } from '../../hooks/useDiscovery';
import type { DiscoveryPipelineStep } from '../../types';

const steps = [
  { key: 'discovering' as const, label: 'DTM Discovery', icon: Search, product: 'Device Trust Manager' },
  { key: 'assessing' as const, label: 'TrustEdge Light Assessment', icon: ShieldCheck, product: 'TrustEdge Light' },
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
                  }}
                  transition={{ duration: 1.5, repeat: isActive && !isDone ? Infinity : 0 }}
                  className="w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors"
                  style={{
                    backgroundColor: isDone ? 'rgba(16,185,129,0.15)' : isActive ? 'var(--theme-card)' : 'var(--theme-card-inner)',
                    borderColor: isDone ? 'rgba(16,185,129,0.5)' : isActive ? 'var(--theme-text-secondary)' : 'var(--theme-card-border)',
                    color: isDone ? '#6EE7B7' : isActive ? 'var(--theme-text)' : 'var(--theme-text-dim)',
                  }}
                >
                  <StepIcon className="w-4.5 h-4.5" />
                </motion.div>
                <p className="text-[11px] mt-1.5 font-medium" style={{ color: isDone ? '#6EE7B7' : isActive ? 'var(--theme-text)' : 'var(--theme-text-dim)' }}>
                  {step.label}
                </p>
                <p className="text-[10px]" style={{ color: isFuture ? 'var(--theme-text-dim)' : 'var(--theme-text-muted)' }}>
                  {step.product}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div className="w-16 h-0.5 mb-8 rounded-full transition-colors" style={{ backgroundColor: currentIdx > i ? 'rgba(16,185,129,0.5)' : currentIdx === i ? 'var(--theme-text-secondary)' : 'var(--theme-card-border)' }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Progress bar (when step is running) */}
      {isRunning && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1" style={{ color: 'var(--theme-text-muted)' }}>
            <span>{steps[currentIdx]?.label}</span>
            <span>{progressForStep}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--theme-bar-bg)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: 'var(--theme-text-secondary)' }}
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
        className="w-full flex items-center justify-center gap-2 px-4 py-3 disabled:cursor-not-allowed text-sm font-semibold rounded-lg transition-colors"
        style={{
          backgroundColor: btn.disabled ? 'var(--theme-card-inner)' : 'var(--theme-text)',
          color: btn.disabled ? 'var(--theme-text-dim)' : 'var(--theme-bg)',
        }}
      >
        <Play className="w-4 h-4" />
        {btn.label}
      </button>
      {state.pipelineStep === 'idle' && connectedCount === 0 && (
        <p className="text-[11px] text-center mt-2" style={{ color: 'var(--theme-text-dim)' }}>Connect at least one platform to begin</p>
      )}
    </GlassCard>
  );
}
