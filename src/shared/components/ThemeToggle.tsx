import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

export function ThemeToggle() {
  const { mode, setMode } = useTheme();

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button
        onClick={() => setMode('light')}
        className={`p-2 rounded-md transition-colors ${
          mode === 'light'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title="Light mode"
      >
        <Sun className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      <button
        onClick={() => setMode('system')}
        className={`p-2 rounded-md transition-colors ${
          mode === 'system'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title="System preference"
      >
        <Monitor className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
      <button
        onClick={() => setMode('dark')}
        className={`p-2 rounded-md transition-colors ${
          mode === 'dark'
            ? 'bg-white dark:bg-gray-700 shadow-sm'
            : 'hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
        title="Dark mode"
      >
        <Moon className="h-4 w-4 text-gray-700 dark:text-gray-300" />
      </button>
    </div>
  );
}
