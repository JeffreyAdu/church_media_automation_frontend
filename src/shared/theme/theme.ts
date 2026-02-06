import type { ThemeMode, Theme } from './types';

const STORAGE_KEY = 'theme-mode';

/**
 * Get the effective theme based on mode and system preference
 */
export function getEffectiveTheme(mode: ThemeMode): Theme {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return mode;
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  
  // Optional: also set class for compatibility
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

/**
 * Get saved theme mode from localStorage
 */
export function getSavedMode(): ThemeMode {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved;
  }
  return 'system'; // default
}

/**
 * Save theme mode to localStorage
 */
export function saveMode(mode: ThemeMode): void {
  localStorage.setItem(STORAGE_KEY, mode);
}

/**
 * Listen to system theme changes
 */
export function watchSystemTheme(callback: (theme: Theme) => void): () => void {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  const handler = (e: MediaQueryListEvent | MediaQueryList) => {
    callback(e.matches ? 'dark' : 'light');
  };
  
  // Modern browsers
  if (mediaQuery.addEventListener) {
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }
  
  // Fallback for older browsers
  mediaQuery.addListener(handler);
  return () => mediaQuery.removeListener(handler);
}
