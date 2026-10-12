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
      className="relative flex items-center justify-between w-14 h-7 px-1.5 rounded-full bg-[#e8f3fa] dark:bg-[#0c1d2b] border border-[#0284c7]/20 dark:border-[#38bdf8]/20 transition-all duration-300"
    >
      <Sun className={`w-3.5 h-3.5 z-10 transition-colors ${!isDark ? 'text-[#0284c7]' : 'text-[#62839b]'}`} />
      <Moon className={`w-3.5 h-3.5 z-10 transition-colors ${isDark ? 'text-[#38bdf8]' : 'text-[#7895a7]'}`} />
      <span
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white dark:bg-[#102638] shadow-sm transition-transform duration-300 ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );
};
