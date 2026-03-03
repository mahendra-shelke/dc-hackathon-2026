import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type { SimulationState } from '../types';

const initialState: SimulationState = {
  isRunning: false,
  progress: 0,
  readinessScore: 15,
  devicesReady: 2940,
  certsUpdated: 0,
  riskReduction: 0,
};

const finalState: SimulationState = {
  isRunning: false,
  progress: 1,
  readinessScore: 87,
  devicesReady: 21315,
  certsUpdated: 18200,
  riskReduction: 72,
};

interface SimulationContextType {
  state: SimulationState;
  isSimulated: boolean;
  startSimulation: () => void;
  resetSimulation: () => void;
}

const SimulationContext = createContext<SimulationContextType | null>(null);

function lerpState(t: number): SimulationState {
  const lerp = (a: number, b: number) => Math.round(a + (b - a) * t);
  return {
    isRunning: t < 1,
    progress: t,
    readinessScore: lerp(initialState.readinessScore, finalState.readinessScore),
    devicesReady: lerp(initialState.devicesReady, finalState.devicesReady),
    certsUpdated: lerp(initialState.certsUpdated, finalState.certsUpdated),
    riskReduction: lerp(initialState.riskReduction, finalState.riskReduction),
  };
}

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SimulationState>(initialState);
  const [isSimulated, setIsSimulated] = useState(false);
  const rafId = useRef(0);

  const startSimulation = useCallback(() => {
    if (state.isRunning) return;
    setIsSimulated(false);
    setState({ ...initialState, isRunning: true });

    const duration = 5000;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setState(lerpState(eased));

      if (t < 1) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        setIsSimulated(true);
      }
    };
    rafId.current = requestAnimationFrame(animate);
  }, [state.isRunning]);

  const resetSimulation = useCallback(() => {
    cancelAnimationFrame(rafId.current);
    setState(initialState);
    setIsSimulated(false);
  }, []);

  return (
    <SimulationContext.Provider value={{ state, isSimulated, startSimulation, resetSimulation }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation(): SimulationContextType {
  const ctx = useContext(SimulationContext);
  if (!ctx) throw new Error('useSimulation must be used within SimulationProvider');
  return ctx;
}
