export type Industry = 'medical' | 'automotive' | 'smart-home' | 'industrial' | 'enterprise';

export type DeviceClass = 'constrained' | 'mid-range' | 'powerful' | 'server-class';

export type PqcStatus = 'not-ready' | 'hybrid' | 'ready';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

export type MigrationPhase = 'discover' | 'test' | 'deploy-hybrid' | 'full-pqc';

export interface DeviceGroup {
  id: string;
  name: string;
  industry: Industry;
  deviceClass: DeviceClass;
  count: number;
  currentAlgorithm: string;
  keySize: number;
  pqcStatus: PqcStatus;
  riskLevel: RiskLevel;
  riskScore: number; // 0-100
  firmwareUpdatable: boolean;
  recommendedPqc: string;
  migrationPhase: MigrationPhase;
  certExpiryMonths: number;
  dataAtRiskTB: number;
}

export interface PqcAlgorithm {
  id: string;
  name: string;
  type: 'signature' | 'kem';
  family: string;
  nistLevel: number;
  publicKeySize: number;  // bytes
  signatureSize?: number; // bytes (for signatures)
  ciphertextSize?: number; // bytes (for KEMs)
  suitability: Record<DeviceClass, 'good' | 'moderate' | 'poor'>;
  notes: string;
}

export interface IndustryData {
  id: Industry;
  label: string;
  icon: string;
  color: string;
  totalDevices: number;
  pqcReadyPercent: number;
  dataAtRiskTB: number;
  regulatoryDeadline: string;
  hndlWindowYears: number;
}

export interface CertificateComparison {
  algorithm: string;
  certSize: number;     // bytes
  chainSize: number;    // bytes (3-cert chain)
  handshakeSize: number; // bytes
  signOps: number;      // ops/sec
  verifyOps: number;    // ops/sec
}

export interface MigrationTimeline {
  industry: Industry;
  phases: {
    phase: MigrationPhase;
    label: string;
    startMonth: number;
    durationMonths: number;
    product: string;
    productDescription: string;
  }[];
}

export interface SimulationState {
  isRunning: boolean;
  progress: number;        // 0-1
  readinessScore: number;  // 0-100
  devicesReady: number;
  certsUpdated: number;
  riskReduction: number;
}
