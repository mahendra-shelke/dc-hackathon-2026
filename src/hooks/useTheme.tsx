import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type ThemeId = 'deep-navy' | 'charcoal-gradient' | 'digicert-blue' | 'light';

export interface ThemeOption {
  id: ThemeId;
  label: string;
  description: string;
  preview: string; // CSS color for the preview swatch
}

export const themes: ThemeOption[] = [
  { id: 'deep-navy', label: 'Deep Navy', description: 'Dark, high contrast', preview: '#020617' },
  { id: 'charcoal-gradient', label: 'Charcoal Gradient', description: 'Dark with indigo gradient', preview: '#1e1b4b' },
  { id: 'digicert-blue', label: 'DigiCert Blue', description: 'Brand-aligned dark blue', preview: '#0b1120' },
  { id: 'light', label: 'Light', description: 'Clean white/gray', preview: '#f8fafc' },
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('pqc-theme') as ThemeId) || 'deep-navy';
    }
    return 'deep-navy';
  });

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    localStorage.setItem('pqc-theme', id);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isLight: theme === 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
