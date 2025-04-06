"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="font-mono text-green-500 dark:text-green-400 hover:bg-green-900/20 px-2 py-1 transition-colors"
      aria-label="Toggle theme"
    >
      [{theme === "dark" ? "LIGHT MODE" : "DARK MODE"}]
    </button>
  );
} 