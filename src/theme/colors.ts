export const colors = {
  digicert: '#A1A1AA',
  digicertDark: '#71717A',
  digicertLight: '#D4D4D8',

  risk: {
    critical: '#EF4444',
    high: '#F97316',
    medium: '#EAB308',
    low: '#22C55E',
  },

  pqc: {
    ready: '#A1A1AA',
    hybrid: '#71717A',
    notReady: '#E5753C',
  },

  industry: {
    medical: '#EC4899',
    automotive: '#F97316',
    'smart-home': '#8B5CF6',
    industrial: '#EAB308',
    enterprise: '#06B6D4',
  },

  chart: [
    '#A1A1AA', '#71717A', '#E5753C', '#D4D4D8', '#52525B',
    '#A3A3A3', '#78716C', '#9CA3AF', '#6B7280', '#57534E',
  ],

  glass: {
    bg: 'rgba(30, 41, 59, 0.4)',
    border: 'rgba(71, 85, 105, 0.5)',
    bgHover: 'rgba(30, 41, 59, 0.6)',
  },
} as const;

export function riskColor(level: string): string {
  return colors.risk[level as keyof typeof colors.risk] ?? colors.risk.medium;
}

export function pqcColor(status: string): string {
  const map: Record<string, string> = {
    'ready': colors.pqc.ready,
    'hybrid': colors.pqc.hybrid,
    'not-ready': colors.pqc.notReady,
  };
  return map[status] ?? colors.pqc.notReady;
}

export function industryColor(industry: string): string {
  return colors.industry[industry as keyof typeof colors.industry] ?? colors.digicert;
}
