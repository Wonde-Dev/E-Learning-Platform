import { createContext, useContext, useEffect, useState, useCallback } from "react";
import i18n from "../i18n";

const LanguageContext = createContext(null);

export const languages = {
  en: { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  am: { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹" },
};

const languageOrder = ["en", "am"];

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("i18nextLng") || "en";
    }
    return "en";
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("i18nextLng");
    if (saved && saved !== i18n.language) {
      i18n.changeLanguage(saved);
      setLanguageState(saved);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("i18nextLng", language);
    document.documentElement.lang = language;
    // Amharic is LTR like most Ethiopian scripts
    document.documentElement.dir = "ltr";
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language, mounted]);

  const toggleLanguage = useCallback(() => {
    const currentIndex = languageOrder.indexOf(language);
    const next = languageOrder[(currentIndex + 1) % languageOrder.length];
    setLanguageState(next);
  }, [language]);

  const setLanguage = useCallback((code) => {
    if (languages[code]) {
      setLanguageState(code);
    }
  }, []);

  if (!mounted) return null;

  return (
    <LanguageContext.Provider value={{ language, languages, toggleLanguage, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within a LanguageProvider");
  return context;
}
