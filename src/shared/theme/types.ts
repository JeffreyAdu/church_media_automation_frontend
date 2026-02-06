export type Theme = 'light' | 'dark';
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}
