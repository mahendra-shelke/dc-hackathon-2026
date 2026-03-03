export const colors = {
  digicert: '#0C6DFD',
  digicertDark: '#0955CC',
  digicertLight: '#3D8DFD',

  risk: {
    critical: '#EF4444',
    high: '#F97316',
    medium: '#EAB308',
    low: '#22C55E',
  },

  pqc: {
    ready: '#10B981',
    hybrid: '#3B82F6',
    notReady: '#EF4444',
  },

  industry: {
    medical: '#EC4899',
    automotive: '#F97316',
    'smart-home': '#8B5CF6',
    industrial: '#EAB308',
    enterprise: '#06B6D4',
  },

  chart: [
    '#0C6DFD', '#10B981', '#F97316', '#EC4899', '#8B5CF6',
    '#06B6D4', '#EAB308', '#EF4444', '#14B8A6', '#F43F5E',
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
