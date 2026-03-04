import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

export type ThemeId = 'deep-navy' | 'light';

export interface ThemeOption {
  id: ThemeId;
  label: string;
  description: string;
  preview: string;
}

export const themes: ThemeOption[] = [
  { id: 'deep-navy', label: 'Dark', description: 'Clean flat dark', preview: '#09090B' },
  { id: 'light', label: 'Light', description: 'Clean white', preview: '#FAFAFA' },
];

interface ThemeContextType {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const VALID_THEMES: ThemeId[] = ['deep-navy', 'light'];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('pqc-theme') as ThemeId;
      return VALID_THEMES.includes(stored) ? stored : 'deep-navy';
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
