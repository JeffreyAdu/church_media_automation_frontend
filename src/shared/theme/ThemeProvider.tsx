import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { Theme, ThemeMode, ThemeContextValue } from './types';
import { getEffectiveTheme, applyTheme, getSavedMode, saveMode, watchSystemTheme } from './theme';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeProvider({ children, defaultMode = 'system' }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => getSavedMode() || defaultMode);
  const [theme, setTheme] = useState<Theme>(() => getEffectiveTheme(mode));

  // Update theme when mode changes
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(mode);
    setTheme(effectiveTheme);
    applyTheme(effectiveTheme);
    saveMode(mode);
  }, [mode]);

  // Watch system preference changes when mode is 'system'
  useEffect(() => {
    if (mode !== 'system') return;

    const unsubscribe = watchSystemTheme((systemTheme) => {
      setTheme(systemTheme);
      applyTheme(systemTheme);
    });

    return unsubscribe;
  }, [mode]);

  // Apply initial theme on mount (before React hydration)
  useEffect(() => {
    const effectiveTheme = getEffectiveTheme(mode);
    applyTheme(effectiveTheme);
  }, []);

  const value: ThemeContextValue = {
    theme,
    mode,
    setMode: setModeState,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
