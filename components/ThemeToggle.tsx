"use client";

import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full cursor-pointer transition-all duration-300"
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(120,180,255,0.2), rgba(168,85,247,0.15))"
          : "linear-gradient(135deg, rgba(130,90,220,0.15), rgba(200,120,255,0.1))",
        border: `1px solid ${isDark ? "rgba(120,180,255,0.3)" : "rgba(130,90,220,0.25)"}`,
        boxShadow: isDark
          ? "0 0 20px rgba(120,180,255,0.1)"
          : "0 0 15px rgba(130,90,220,0.08)",
      }}
      aria-label="Toggle theme"
    >
      <motion.div
        className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full flex items-center justify-center"
        style={{
          background: isDark
            ? "linear-gradient(135deg, rgba(120,180,255,0.9), rgba(168,85,247,0.8))"
            : "linear-gradient(135deg, rgba(255,220,100,0.9), rgba(255,180,80,0.8))",
          boxShadow: isDark
            ? "0 0 15px rgba(120,180,255,0.4)"
            : "0 0 12px rgba(255,200,100,0.3)",
        }}
        animate={{
          x: isDark ? 28 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(120,180,255,0.9)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        ) : (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(255,200,100,0.9)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        )}
      </motion.div>
    </button>
  );
}
