import { createContext, useContext, useEffect, useState, useCallback } from "react";

const ThemeContext = createContext(null);

export const themes = {
  light: {
    name: "light",
    label: "Light",
    colors: {
      bg: "bg-white",
      bgSecondary: "bg-slate-50",
      text: "text-slate-900",
      textSecondary: "text-slate-600",
      border: "border-slate-200",
      card: "bg-white",
      cardHover: "hover:bg-slate-50",
      primary: "bg-brand-600",
      primaryHover: "hover:bg-brand-700",
      secondary: "bg-slate-100",
      secondaryHover: "hover:bg-slate-200",
    }
  },
  dark: {
    name: "dark",
    label: "Dark",
    colors: {
      bg: "bg-slate-950",
      bgSecondary: "bg-slate-900",
      text: "text-slate-100",
      textSecondary: "text-slate-400",
      border: "border-slate-800",
      card: "bg-slate-900",
      cardHover: "hover:bg-slate-800",
      primary: "bg-brand-500",
      primaryHover: "hover:bg-brand-600",
      secondary: "bg-slate-800",
      secondaryHover: "hover:bg-slate-700",
    }
  },
  tech: {
    name: "tech",
    label: "Tech",
    colors: {
      bg: "bg-zinc-950",
      bgSecondary: "bg-zinc-900",
      text: "text-zinc-100",
      textSecondary: "text-zinc-400",
      border: "border-zinc-800",
      card: "bg-zinc-900/80",
      cardHover: "hover:bg-zinc-800/80",
      primary: "bg-emerald-500",
      primaryHover: "hover:bg-emerald-600",
      secondary: "bg-zinc-800/80",
      secondaryHover: "hover:bg-zinc-700/80",
    }
  }
};

const themeOrder = ["light", "dark", "tech"];

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme, mounted]);

  const toggleTheme = useCallback(() => {
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  }, [theme]);

  const setThemeByName = useCallback((name) => {
    if (themes[name]) {
      setTheme(name);
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, themes, toggleTheme, setTheme: setThemeByName }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}