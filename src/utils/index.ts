import type { DeviceGroup, RiskLevel, PqcStatus } from '../types';

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(n >= 10_000 ? 0 : 1)}K`;
  return n.toLocaleString();
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1_048_576) return `${(bytes / 1_048_576).toFixed(1)} MB`;
  if (bytes >= 1_024) return `${(bytes / 1_024).toFixed(1)} KB`;
  return `${bytes} B`;
}

export function formatTB(tb: number): string {
  if (tb >= 1000) return `${(tb / 1000).toFixed(1)} PB`;
  return `${tb.toFixed(0)} TB`;
}

export function riskLevelFromScore(score: number): RiskLevel {
  if (score >= 75) return 'critical';
  if (score >= 50) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

export function readinessPercent(devices: DeviceGroup[]): number {
  const total = devices.reduce((sum, d) => sum + d.count, 0);
  const ready = devices
    .filter((d) => d.pqcStatus === 'ready')
    .reduce((sum, d) => sum + d.count, 0);
  return total > 0 ? Math.round((ready / total) * 100) : 0;
}

export function countByStatus(devices: DeviceGroup[], status: PqcStatus): number {
  return devices.filter((d) => d.pqcStatus === status).reduce((sum, d) => sum + d.count, 0);
}

export function countByRisk(devices: DeviceGroup[], level: RiskLevel): number {
  return devices.filter((d) => d.riskLevel === level).reduce((sum, d) => sum + d.count, 0);
}

export function totalDevices(devices: DeviceGroup[]): number {
  return devices.reduce((sum, d) => sum + d.count, 0);
}

export function expiringCerts(devices: DeviceGroup[], withinMonths = 12): number {
  return devices
    .filter((d) => d.certExpiryMonths <= withinMonths)
    .reduce((sum, d) => sum + d.count, 0);
}

export function totalDataAtRisk(devices: DeviceGroup[]): number {
  return devices.reduce((sum, d) => sum + d.dataAtRiskTB, 0);
}

export function daysUntil(dateStr: string): number {
  const target = new Date(dateStr);
  const now = new Date();
  return Math.max(0, Math.ceil((target.getTime() - now.getTime()) / 86_400_000));
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * clamp(t, 0, 1);
}
