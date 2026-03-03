import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from 'react';
import type {
  DiscoveryLogEntry,
  DiscoveryState,
} from '../types';
import {
  defaultConnectors,
  simulatedDiscoveryDevices,
  generateAssessment,
  generateDeviceGroups,
  getDiscoverySubnets,
} from '../data/connectors';
import { useSimulation } from './useSimulation';

interface DiscoveryContextType {
  state: DiscoveryState;
  connectConnector: (id: string) => void;
  disconnectConnector: (id: string) => void;
  startDiscovery: () => void;
  startAssessment: () => void;
  startDeployment: () => void;
  resetDiscovery: () => void;
  connectedCount: number;
}

const DiscoveryContext = createContext<DiscoveryContextType | null>(null);

const initialState: DiscoveryState = {
  connectors: defaultConnectors.map((c) => ({ ...c })),
  discoveredDevices: [],
  pipelineStep: 'idle',
  discoveryProgress: 0,
  assessmentProgress: 0,
  deploymentProgress: 0,
  logEntries: [],
  isComplete: false,
};

function ts(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

function addLog(
  prev: DiscoveryLogEntry[],
  type: DiscoveryLogEntry['type'],
  message: string,
  deviceId?: string,
): DiscoveryLogEntry[] {
  return [...prev, { id: prev.length, timestamp: ts(), type, message, deviceId }];
}

export function DiscoveryProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DiscoveryState>({ ...initialState, connectors: defaultConnectors.map((c) => ({ ...c })) });
  const intervalRef = useRef<ReturnType<typeof setInterval>>(0 as unknown as ReturnType<typeof setInterval>);
  const { addDiscoveredDevices } = useSimulation();

  const connectedCount = state.connectors.filter((c) => c.status === 'connected').length;

  const connectConnector = useCallback((id: string) => {
    // Set to connecting
    setState((prev) => ({
      ...prev,
      connectors: prev.connectors.map((c) => c.id === id ? { ...c, status: 'connecting' as const } : c),
      logEntries: addLog(prev.logEntries, 'info', `[DTM] Connecting to ${prev.connectors.find((c) => c.id === id)?.name}...`),
    }));

    // Simulate connection delay
    setTimeout(() => {
      const deviceCount = simulatedDiscoveryDevices.filter((d) => d.connectorId === id).length;
      setState((prev) => ({
        ...prev,
        connectors: prev.connectors.map((c) =>
          c.id === id ? { ...c, status: 'connected' as const, devicesDiscovered: deviceCount } : c,
        ),
        logEntries: addLog(prev.logEntries, 'success', `[DTM] Connected! ${deviceCount} devices available on ${prev.connectors.find((c) => c.id === id)?.name}.`),
      }));
    }, 1500);
  }, []);

  const disconnectConnector = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      connectors: prev.connectors.map((c) =>
        c.id === id ? { ...c, status: 'disconnected' as const, devicesDiscovered: 0 } : c,
      ),
      logEntries: addLog(prev.logEntries, 'info', `[DTM] Disconnected from ${prev.connectors.find((c) => c.id === id)?.name}.`),
    }));
  }, []);

  const startDiscovery = useCallback(() => {
    const connectedIds = new Set(state.connectors.filter((c) => c.status === 'connected').map((c) => c.id));
    const devicesToDiscover = simulatedDiscoveryDevices.filter((d) => connectedIds.has(d.connectorId));
    const subnets = getDiscoverySubnets();

    setState((prev) => ({
      ...prev,
      pipelineStep: 'discovering',
      discoveryProgress: 0,
      discoveredDevices: [],
      logEntries: addLog(prev.logEntries, 'info', `[DTM] Initializing discovery scan across ${connectedIds.size} platform(s)...`),
    }));

    let index = 0;
    const total = devicesToDiscover.length;

    // Log subnet scanning first
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        logEntries: addLog(prev.logEntries, 'info', `[DTM] Scanning subnets: ${subnets.slice(0, 3).join(', ')}...`),
      }));
    }, 300);

    intervalRef.current = setInterval(() => {
      if (index >= total) {
        clearInterval(intervalRef.current);
        setState((prev) => ({
          ...prev,
          discoveryProgress: 100,
          logEntries: addLog(prev.logEntries, 'success', `[DTM] Discovery complete. ${total} devices found across ${connectedIds.size} platform(s).`),
        }));
        return;
      }

      const device = devicesToDiscover[index];
      index++;

      setState((prev) => ({
        ...prev,
        discoveredDevices: [...prev.discoveredDevices, device],
        discoveryProgress: Math.round((index / total) * 100),
        logEntries: addLog(
          prev.logEntries,
          'info',
          `[DTM] Found ${device.hostname} at ${device.ipAddress} — ${device.currentAlgorithm} (${device.keySize}-bit)`,
          device.id,
        ),
      }));
    }, 150);
  }, [state.connectors]);

  const startAssessment = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pipelineStep: 'assessing',
      assessmentProgress: 0,
      logEntries: addLog(prev.logEntries, 'info', '[TrustCore] Starting PQC readiness assessment...'),
    }));

    const devices = [...state.discoveredDevices];
    let index = 0;
    const total = devices.length;

    intervalRef.current = setInterval(() => {
      if (index >= total) {
        clearInterval(intervalRef.current);
        setState((prev) => {
          const criticalCount = prev.discoveredDevices.filter((d) => d.assessment?.riskLevel === 'critical').length;
          const highCount = prev.discoveredDevices.filter((d) => d.assessment?.riskLevel === 'high').length;
          return {
            ...prev,
            assessmentProgress: 100,
            logEntries: addLog(prev.logEntries, 'success', `[TrustCore] Assessment complete. ${criticalCount} critical, ${highCount} high risk devices identified.`),
          };
        });
        return;
      }

      const device = devices[index];
      const assessment = generateAssessment(device);
      index++;

      setState((prev) => ({
        ...prev,
        discoveredDevices: prev.discoveredDevices.map((d) =>
          d.id === device.id ? { ...d, assessment } : d,
        ),
        assessmentProgress: Math.round((index / total) * 100),
        logEntries: addLog(
          prev.logEntries,
          assessment.riskLevel === 'critical' ? 'warning' : 'info',
          `[TrustCore] ${device.hostname}: Risk ${assessment.riskScore}/100, recommend ${assessment.recommendedPqc}${!assessment.firmwareUpdateCapable ? ' [FIRMWARE NOT UPDATABLE]' : ''}`,
          device.id,
        ),
      }));
    }, 100);
  }, [state.discoveredDevices]);

  const startDeployment = useCallback(() => {
    setState((prev) => ({
      ...prev,
      pipelineStep: 'deploying',
      deploymentProgress: 0,
      logEntries: addLog(prev.logEntries, 'info', '[TrustEdge] Initiating hybrid certificate deployment via OTA...'),
    }));

    // Set all to pending first
    setState((prev) => ({
      ...prev,
      discoveredDevices: prev.discoveredDevices.map((d) => ({
        ...d,
        deployment: {
          status: 'pending' as const,
          certType: 'hybrid' as const,
          algorithm: d.assessment?.recommendedPqc ?? 'ML-DSA-65',
          progress: 0,
          rollbackAvailable: false,
        },
      })),
    }));

    const devices = [...state.discoveredDevices];
    let index = 0;
    const total = devices.length;

    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (index >= total) {
          clearInterval(intervalRef.current);

          // Set final status
          setState((prev) => {
            const verified = prev.discoveredDevices.filter((d) => d.deployment?.status === 'verified').length;
            const failed = prev.discoveredDevices.filter((d) => d.deployment?.status === 'failed').length;

            // Push to simulation context
            const groups = generateDeviceGroups(prev.discoveredDevices);
            addDiscoveredDevices(groups);

            return {
              ...prev,
              pipelineStep: 'complete',
              deploymentProgress: 100,
              isComplete: true,
              logEntries: addLog(prev.logEntries, 'success', `[TrustEdge] Deployment complete. ${verified} verified, ${failed} failed.`),
            };
          });
          return;
        }

        const device = devices[index];
        // 90% chance of success
        const willFail = !device.assessment?.firmwareUpdateCapable;
        index++;

        // Set to updating
        setState((prev) => ({
          ...prev,
          discoveredDevices: prev.discoveredDevices.map((d) =>
            d.id === device.id
              ? { ...d, deployment: { ...d.deployment!, status: 'updating' as const, progress: 50 } }
              : d,
          ),
          deploymentProgress: Math.round(((index - 0.5) / total) * 100),
          logEntries: addLog(prev.logEntries, 'info', `[TrustEdge] Deploying hybrid cert to ${device.hostname}...`, device.id),
        }));

        // Complete after short delay
        setTimeout(() => {
          setState((prev) => ({
            ...prev,
            discoveredDevices: prev.discoveredDevices.map((d) =>
              d.id === device.id
                ? {
                    ...d,
                    deployment: {
                      ...d.deployment!,
                      status: willFail ? 'failed' as const : 'verified' as const,
                      progress: 100,
                      rollbackAvailable: true,
                    },
                  }
                : d,
            ),
            deploymentProgress: Math.round((index / total) * 100),
            logEntries: addLog(
              prev.logEntries,
              willFail ? 'error' : 'success',
              willFail
                ? `[TrustEdge] FAILED: ${device.hostname} — firmware not updatable`
                : `[TrustEdge] Verified: ${device.hostname} — hybrid cert active (${device.assessment?.recommendedPqc})`,
              device.id,
            ),
          }));
        }, 80);
      }, 150);
    }, 500);
  }, [state.discoveredDevices, addDiscoveredDevices]);

  const resetDiscovery = useCallback(() => {
    clearInterval(intervalRef.current);
    setState({ ...initialState, connectors: defaultConnectors.map((c) => ({ ...c })) });
  }, []);

  return (
    <DiscoveryContext.Provider
      value={{
        state,
        connectConnector,
        disconnectConnector,
        startDiscovery,
        startAssessment,
        startDeployment,
        resetDiscovery,
        connectedCount,
      }}
    >
      {children}
    </DiscoveryContext.Provider>
  );
}

export function useDiscovery(): DiscoveryContextType {
  const ctx = useContext(DiscoveryContext);
  if (!ctx) throw new Error('useDiscovery must be used within DiscoveryProvider');
  return ctx;
}
