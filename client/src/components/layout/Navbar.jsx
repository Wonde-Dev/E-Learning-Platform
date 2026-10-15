import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  SignedIn, SignedOut, UserButton,
} from "@clerk/clerk-react";
import {
  GraduationCap, Menu, Sun, Moon, Monitor, Globe, ChevronDown,
  Shield, BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/hooks/useUser";

const baseLinks = [
  { to: "/", labelKey: "nav.home", exact: true },
  { to: "/courses", labelKey: "nav.courses" },
  { to: "/about", labelKey: "nav.about" },
];

const themeIcons = {
  light: { Icon: Sun, label: "Light", className: "text-amber-500" },
  dark: { Icon: Moon, label: "Dark", className: "text-slate-400" },
  tech: { Icon: Monitor, label: "Tech", className: "text-emerald-500" },
};

function ThemeDropdown() {
  const { theme, themes, setTheme } = useTheme();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = themeIcons[theme];

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost hidden sm:inline-flex items-center gap-1 !px-2.5 !py-2"
        aria-label={t("common.theme")}
      >
        <current.Icon className={`h-4 w-4 ${current.className}`} />
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1.5 w-36 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-soft py-1.5 z-50"
          >
            {Object.entries(themeIcons).map(([key, { Icon, label, className }]) => (
              <button
                key={key}
                onClick={() => { setTheme(key); setOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800",
                  theme === key && "font-semibold text-brand-600 dark:text-brand-400"
                )}
              >
                <Icon className={`h-3.5 w-3.5 ${className}`} />
                {label}
                {theme === key && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LangDropdown() {
  const { language, languages, setLanguage } = useLanguage();
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleChange = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn-ghost hidden sm:inline-flex items-center gap-1.5 !px-2.5 !py-2"
        aria-label={t("common.language")}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">{languages[language]?.flag || "🌐"}</span>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1.5 w-44 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-soft py-1.5 z-50"
          >
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => handleChange(code)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800",
                  language === code && "font-semibold text-brand-600 dark:text-brand-400"
                )}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.nativeName}</span>
                {language === code && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useTranslation();
  const { data: user } = useUser();
  const role = user?.role;

  // Build nav links based on role
  const navLinks = [
    ...baseLinks,
    ...(role === "admin"
      ? [{ to: "/admin", labelKey: "nav.admin", icon: Shield }]
      : []),
    ...(role === "instructor" || role === "admin"
      ? [{ to: "/instructor", labelKey: "nav.instructor", icon: BookOpen }]
      : []),
    { to: "/dashboard", labelKey: "nav.dashboard" },
  ];

  return (
    <>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80"
      >
        <nav className="container flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-soft group-hover:scale-105 transition">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold tracking-tight font-display">EduFlow</span>
          </Link>

          {/* Desktop nav links */}
          <ul className="hidden md:flex items-center gap-0.5">
            {navLinks.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.exact}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition",
                      isActive
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    )
                  }
                >
                  {l.icon && <l.icon className="h-3.5 w-3.5" />}
                  {t(l.labelKey)}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right side controls */}
          <div className="flex items-center gap-1">
            {/* Mobile menu button */}
            <button
              className="btn-ghost sm:hidden inline-flex !p-2.5"
              aria-label="Menu"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>

            <ThemeDropdown />
            <LangDropdown />

            <SignedOut>
              <Link to="/login" className="btn-ghost !px-3 !py-2 !text-sm hidden sm:inline-flex">
                {t("common.signIn")}
              </Link>
              <Link to="/login" className="btn-primary !px-3.5 !py-2 !text-sm">
                {t("common.getStarted")}
              </Link>
            </SignedOut>

            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{ elements: { avatarBox: "h-9 w-9" } }}
              />
            </SignedIn>
          </div>
        </nav>
      </motion.header>
    </>
  );
}
