import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      aria-label="Toggle color theme"
      className="relative flex items-center justify-between w-14 h-8 px-1.5 rounded-full bg-slate-200 dark:bg-nebula-850 border border-slate-300 dark:border-white/10 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-aurora-cyan/50"
    >
      <Sun className={`w-4 h-4 text-amber-500 transition-opacity duration-200 ${isDark ? 'opacity-40' : 'opacity-100'}`} />
      <Moon className={`w-4 h-4 text-aurora-violet transition-opacity duration-200 ${isDark ? 'opacity-100' : 'opacity-40'}`} />
      
      {/* Sliding Knob */}
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white dark:bg-aurora-cyan shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
