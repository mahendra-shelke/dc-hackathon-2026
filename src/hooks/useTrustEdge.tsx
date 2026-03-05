import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface TrustEdgeFeature {
  id: number;
  title: string;
  tagline: string;
  detail: string;
  icon: 'shield' | 'lock' | 'cpu' | 'cloud' | 'key' | 'refresh';
}

export const trustEdgeFeatures: TrustEdgeFeature[] = [
  {
    id: 1,
    title: 'Edge Device Identity',
    tagline: 'Unique cryptographic identity for every device at the edge.',
    detail:
      'TrustEdge provisions each IoT and edge device with a hardware-bound certificate identity. Even constrained devices (Cortex-M0+, 16KB RAM) get a lightweight X.509 identity via EST enrollment, enabling zero-trust authentication from day one.',
    icon: 'shield',
  },
  {
    id: 2,
    title: 'Automated Certificate Lifecycle',
    tagline: 'Issue, renew, and revoke — without human intervention.',
    detail:
      'Certificates expire. Devices go offline. TrustEdge automates the full lifecycle: initial enrollment via EST/SCEP, scheduled renewal before expiry, and instant revocation when a device is decommissioned or compromised. No more expired certs causing outages.',
    icon: 'refresh',
  },
  {
    id: 3,
    title: 'PQC-Ready Crypto Agility',
    tagline: 'Swap algorithms without reflashing firmware.',
    detail:
      'TrustEdge supports crypto agility — the ability to rotate from RSA/ECDSA to ML-DSA or ML-KEM without a full firmware update. Hybrid certificates bridge classical and post-quantum worlds, keeping your fleet interoperable while future-proofing against quantum threats.',
    icon: 'key',
  },
  {
    id: 4,
    title: 'Secure Boot & Firmware Signing',
    tagline: 'Only verified code runs on your devices.',
    detail:
      'TrustEdge integrates with secure boot chains to validate firmware integrity at every startup. Code-signing certificates ensure that only authorized, cryptographically verified firmware is deployed. Tampered or unsigned images are rejected at the hardware level.',
    icon: 'lock',
  },
  {
    id: 5,
    title: 'Fleet-Wide Visibility',
    tagline: 'Real-time cryptographic posture across your entire fleet.',
    detail:
      'A single dashboard shows certificate status, algorithm usage, expiry timelines, and compliance gaps for every device in your fleet. Filter by device class, industry vertical, or risk level. Detect anomalies (e.g., a device running SHA-1) before they become vulnerabilities.',
    icon: 'cloud',
  },
  {
    id: 6,
    title: 'Hardware Security Integration',
    tagline: 'TPM, secure enclaves, and HSM-backed key storage.',
    detail:
      'Private keys never leave the hardware. TrustEdge leverages TPM 2.0, ARM TrustZone, and HSM modules to generate and store keys in tamper-resistant storage. Even if a device is physically compromised, the keys cannot be extracted.',
    icon: 'cpu',
  },
];

interface TrustEdgeContextType {
  isOpen: boolean;
  activeFeature: number;
  features: TrustEdgeFeature[];
  togglePanel: () => void;
  openPanel: () => void;
  closePanel: () => void;
  goToFeature: (id: number) => void;
  nextFeature: () => void;
  prevFeature: () => void;
}

const TrustEdgeContext = createContext<TrustEdgeContextType | null>(null);

export function TrustEdgeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(1);

  const goToFeature = useCallback((id: number) => {
    setActiveFeature(id);
  }, []);

  const nextFeature = useCallback(() => {
    setActiveFeature((prev) =>
      prev < trustEdgeFeatures.length ? prev + 1 : 1
    );
  }, []);

  const prevFeature = useCallback(() => {
    setActiveFeature((prev) =>
      prev > 1 ? prev - 1 : trustEdgeFeatures.length
    );
  }, []);

  const togglePanel = useCallback(() => setIsOpen((v) => !v), []);
  const openPanel = useCallback(() => setIsOpen(true), []);
  const closePanel = useCallback(() => setIsOpen(false), []);

  return (
    <TrustEdgeContext.Provider
      value={{
        isOpen,
        activeFeature,
        features: trustEdgeFeatures,
        togglePanel,
        openPanel,
        closePanel,
        goToFeature,
        nextFeature,
        prevFeature,
      }}
    >
      {children}
    </TrustEdgeContext.Provider>
  );
}

export function useTrustEdge() {
  const ctx = useContext(TrustEdgeContext);
  if (!ctx) throw new Error('useTrustEdge must be inside TrustEdgeProvider');
  return ctx;
}
