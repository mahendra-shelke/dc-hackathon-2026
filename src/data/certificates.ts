import type { CertificateComparison } from '../types';

export const certComparisons: CertificateComparison[] = [
  {
    algorithm: 'RSA-2048',
    certSize: 850,
    chainSize: 2550,
    handshakeSize: 3400,
    signOps: 1500,
    verifyOps: 40000,
  },
  {
    algorithm: 'ECDSA P-256',
    certSize: 500,
    chainSize: 1500,
    handshakeSize: 2000,
    signOps: 20000,
    verifyOps: 8000,
  },
  {
    algorithm: 'ML-DSA-44',
    certSize: 4000,
    chainSize: 12000,
    handshakeSize: 15000,
    signOps: 8000,
    verifyOps: 30000,
  },
  {
    algorithm: 'ML-DSA-65',
    certSize: 5700,
    chainSize: 17100,
    handshakeSize: 21000,
    signOps: 5000,
    verifyOps: 20000,
  },
  {
    algorithm: 'ML-DSA-87',
    certSize: 7800,
    chainSize: 23400,
    handshakeSize: 28000,
    signOps: 3000,
    verifyOps: 15000,
  },
  {
    algorithm: 'FN-DSA-512',
    certSize: 1700,
    chainSize: 5100,
    handshakeSize: 6800,
    signOps: 6000,
    verifyOps: 25000,
  },
];
