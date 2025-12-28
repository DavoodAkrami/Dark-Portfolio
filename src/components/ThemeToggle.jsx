"use client";
import { useTheme } from './ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { isLightMode, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className="hoverLight p-4 !rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer bg-[var(--accent-color)]"
      aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLightMode ? (
        <FaMoon className="text-[var(--text-color)] text-xl rounded-full" />
      ) : (
        <FaSun className="text-[var(--text-color)] text-xl rounded-full" />
      )}
    </div>
  );
};

export default ThemeToggle; 