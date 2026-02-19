import { useEffect, useState } from "react";

const THEME_KEY = "irb-theme";

export const useTheme = () => {
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(THEME_KEY);
      return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch (_error) {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", isDark);
    try {
      localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch (_error) {
      // Ignore storage failures.
    }
  }, [isDark]);

  return { isDark, toggle: () => setIsDark((value) => !value) };
};
