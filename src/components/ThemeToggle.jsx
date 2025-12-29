"use client";
import { useTheme } from './ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ThemeToggle = ({ padding }) => {
  const { isLightMode, toggleTheme } = useTheme();

  return (
    <motion.div
      onClick={toggleTheme}
      className="hoverLight !rounded-full transition-all duration-300 flex items-center justify-center cursor-pointer bg-[var(--accent-color)]"
      aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
      style={{ padding: padding }}
    >
      {isLightMode ? (
        <FaMoon className="text-[var(--text-color)] text-xl rounded-full" />
      ) : (
        <FaSun className="text-[var(--text-color)] text-xl rounded-full" />
      )}
    </motion.div>
  );
};

export default ThemeToggle; 