import { motion, AnimatePresence } from "framer-motion";
import { X, Sun, Moon, Monitor, Globe, Shield, BookOpen, GraduationCap, Home, LayoutDashboard, Info } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/clerk-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useUser } from "@/hooks/useUser";
import { Button } from "@/components/ui/Button";

const themeOptions = [
  { key: "light", Icon: Sun, className: "text-amber-500" },
  { key: "dark", Icon: Moon, className: "text-slate-400" },
  { key: "tech", Icon: Monitor, className: "text-emerald-500" },
];

export const Sidebar = ({ open, onClose }) => {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { language, languages, setLanguage } = useLanguage();
  const { data: user } = useUser();
  const role = user?.role;

  const baseLinks = [
    { to: "/", icon: Home, labelKey: "nav.home", exact: true },
    { to: "/courses", icon: BookOpen, labelKey: "nav.courses" },
    { to: "/about", icon: Info, labelKey: "nav.about" },
    { to: "/my-dashboard", icon: LayoutDashboard, labelKey: "nav.dashboard" },
  ];

  const roleLinks = [
    ...(role === "admin" ? [{ to: "/admin", icon: Shield, labelKey: "nav.admin" }] : []),
    ...(role === "instructor" || role === "admin" ? [{ to: "/instructor", icon: GraduationCap, labelKey: "nav.instructor" }] : []),
  ];

  const allLinks = [...baseLinks, ...roleLinks];

  const handleLangChange = (code) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          initial={{ x: -320, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -320, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-0 z-50 lg:hidden"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <div className="relative h-full w-72 max-w-[85vw] bg-white dark:bg-slate-950 shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <Link to="/" className="flex items-center gap-2" onClick={onClose}>
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-600 text-white">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="font-extrabold font-display">EduFlow</span>
              </Link>
              <button className="btn-ghost !p-2" onClick={onClose}>
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
              {allLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.exact}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                        : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    )
                  }
                >
                  <l.icon className="h-4 w-4 shrink-0" />
                  {t(l.labelKey)}
                </NavLink>
              ))}

              {/* Divider */}
              <div className="pt-3 pb-1">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
                  {t("common.theme")}
                </p>
              </div>
              <div className="flex gap-1 px-1 pb-2">
                {themeOptions.map(({ key, Icon, className }) => (
                  <button
                    key={key}
                    onClick={() => setTheme(key)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-medium transition border",
                      theme === key
                        ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/50"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"
                    )}
                  >
                    <Icon className={`h-4 w-4 ${theme === key ? "" : className}`} />
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </button>
                ))}
              </div>

              {/* Language */}
              <div className="pt-1 pb-1">
                <p className="px-3 text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-600">
                  {t("common.language")}
                </p>
              </div>
              <div className="flex gap-1 px-1">
                {Object.entries(languages).map(([code, lang]) => (
                  <button
                    key={code}
                    onClick={() => handleLangChange(code)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 rounded-xl py-2 text-sm font-medium transition border",
                      language === code
                        ? "border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/50"
                        : "border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500"
                    )}
                  >
                    <span>{lang.flag}</span>
                    <span className="text-xs">{lang.nativeName}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* Footer auth */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <SignedOut>
                <div className="space-y-2">
                  <Link to="/login" className="btn-outline w-full justify-center" onClick={onClose}>
                    {t("common.signIn")}
                  </Link>
                  <Link to="/login" className="btn-primary w-full justify-center" onClick={onClose}>
                    {t("common.getStarted")}
                  </Link>
                </div>
              </SignedOut>
              <SignedIn>
                <div className="flex items-center gap-3">
                  <UserButton afterSignOutUrl="/" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    {role && (
                      <p className="text-xs text-slate-500 capitalize">{role}</p>
                    )}
                  </div>
                </div>
              </SignedIn>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};
