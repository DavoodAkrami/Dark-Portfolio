"use client";
import { useTheme } from './ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { isLightMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="hoverLight p-2 rounded-lg transition-all duration-300 flex items-center justify-center cursor-pointer bg-[var(--accent-color)]"
      aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLightMode ? (
        <FaMoon className="text-[var(--text-color)] text-xl " />
      ) : (
        <FaSun className="text-[var(--text-color)] text-xl" />
      )}
    </button>
  );
};

export default ThemeToggle; 