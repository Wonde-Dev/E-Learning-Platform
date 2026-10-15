import { SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap, BookOpen, Award, Users, ArrowLeft,
  CheckCircle, Star, Zap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

// ─── static data ─────────────────────────────────────────────────────────────
const features = {
  en: [
    { icon: BookOpen, title: "500+ Expert Courses",   desc: "From beginner to advanced across tech, design & business" },
    { icon: Award,    title: "Verified Certificates", desc: "Earn recognized credentials upon completion" },
    { icon: Users,    title: "10,000+ Learners",      desc: "Join a thriving global community" },
  ],
  am: [
    { icon: BookOpen, title: "500+ የላቁ ትምህርቶች",    desc: "ከጀማሪ እስከ ከፍተኛ ደረጃ በቴክ፣ ዲዛይን እና ቢዝነስ" },
    { icon: Award,    title: "የተረጋገጡ ሲርቲፊኬቶች", desc: "ትምህርቱን ሲጨርሱ የሚታወቅ ሲርቲፊኬት ያግኙ" },
    { icon: Users,    title: "10,000+ ተማሪዎች",      desc: "ሕያው ዓለም አቀፍ ማህበረሰብ ይቀላቀሉ" },
  ],
};

const testimonials = {
  en: [
    { text: "EduFlow completely transformed my career. The certificate helped me land my dream job.", name: "Samson Abebe", role: "Software Engineer", initials: "SA" },
    { text: "The Amharic support made learning so much more comfortable for me.", name: "Tigist Haile", role: "UI Designer", initials: "TH" },
  ],
  am: [
    { text: "\"EduFlow ሙያዬን ሙሉ ለሙሉ ቀይሮ ነው። ሲርቲፊኬቱ ሥራ ለማግኘት ረድቶኛል።\"", name: "ሳምሶን አበበ", role: "ሶፍትዌር ኢንጂነር", initials: "ሳ" },
    { text: "\"የአማርኛ ድጋፍ ትምህርቱን ምቹ አድርጎልኛል።\"", name: "ትጉስት ሃይሌ", role: "UI ዲዛይነር", initials: "ት" },
  ],
};

// ─── Clerk appearance ─────────────────────────────────────────────────────────
const clerkAppearance = {
  elements: {
    rootBox:              "w-full",
    card:                 "!shadow-none !border-0 !bg-transparent !p-0",
    headerTitle:          "hidden",
    headerSubtitle:       "hidden",
    socialButtonsBlockButton:
      "!border !border-slate-200 dark:!border-slate-700 !rounded-xl " +
      "hover:!bg-slate-50 dark:hover:!bg-slate-800 !transition !font-medium !text-sm",
    formFieldInput:
      "!rounded-xl !border-slate-200 dark:!border-slate-700 " +
      "dark:!bg-slate-800 dark:!text-white",
    formButtonPrimary:
      "!bg-brand-600 hover:!bg-brand-700 !rounded-xl !h-11 !text-sm !font-semibold !shadow-none",
    footerActionLink:     "!text-brand-600 hover:!text-brand-700 dark:!text-brand-400",
    formFieldLabel:       "!text-sm !font-medium !text-slate-700 dark:!text-slate-300",
    dividerLine:          "!bg-slate-200 dark:!bg-slate-700",
    dividerText:          "!text-slate-400 dark:!text-slate-500 !text-xs",
    footer:               "hidden",
    identityPreviewText:  "dark:!text-slate-200",
    identityPreviewEditButtonIcon: "!text-brand-600",
  },
};

export default function Login() {
  const { i18n } = useTranslation();
  const lang  = i18n.language === "am" ? "am" : "en";
  const feats = features[lang];
  const quotes = testimonials[lang];

  const { isSignedIn, isLoaded } = useAuth();
  const { data: user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [mode, setMode] = useState(
    searchParams.get("mode") === "signup" ? "sign-up" : "sign-in"
  );
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Cycle testimonials
  useEffect(() => {
    const id = setInterval(() => setQuoteIdx((i) => (i + 1) % quotes.length), 5000);
    return () => clearInterval(id);
  }, [quotes.length]);

  // Redirect once signed-in
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (!user) return; // wait for role to load
    if      (user.role === "admin")      navigate("/admin",      { replace: true });
    else if (user.role === "instructor") navigate("/instructor", { replace: true });
    else                                 navigate("/my-dashboard", { replace: true });
  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 overflow-hidden">

      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-[48%] xl:w-[52%] flex-col justify-between p-12 xl:p-16
                   bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900
                   text-white relative overflow-hidden"
      >
        {/* Decoration */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-white/[0.04]" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white/[0.04]" />
          <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full bg-brand-400/20" />
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur group-hover:bg-white/30 transition">
              <GraduationCap className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight font-display">EduFlow</span>
          </Link>
        </div>

        {/* Hero text */}
        <div className="relative z-10 space-y-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-xs font-semibold mb-4">
                <Zap className="h-3.5 w-3.5 text-amber-300" />
                {lang === "am" ? "አዲስ ትምህርቶች ወጥተዋል" : "New courses just dropped"}
              </span>
              <h2 className="text-4xl xl:text-5xl font-extrabold font-display leading-[1.1] whitespace-pre-line">
                {lang === "am" ? "ትምህርትን ጀምር\nያለ ገደብ" : "Start learning\nwithout limits"}
              </h2>
              <p className="mt-4 text-lg text-brand-100 leading-relaxed">
                {lang === "am"
                  ? "ከዓለም አቀፍ አስተማሪዎች ጋር ይማሩ፣ ሲርቲፊኬት ያግኙ እና ሙያዎን ያሻሽሉ።"
                  : "Learn from world-class instructors, earn certificates, and advance your career."}
              </p>
            </motion.div>
          </div>

          {/* Feature list */}
          <div className="space-y-3.5">
            {feats.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="flex items-start gap-3.5"
              >
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/15">
                  <f.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-xs text-brand-200 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
            className="flex gap-6"
          >
            {[
              { value: "10K+", label: lang === "am" ? "ተማሪዎች" : "Students" },
              { value: "500+", label: lang === "am" ? "ትምህርቶች" : "Courses" },
              { value: "4.9★", label: lang === "am" ? "ደረጃ" : "Rating" },
            ].map((s) => (
              <div key={s.label}>
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-brand-300">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Rotating testimonial */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="relative z-10 rounded-2xl bg-white/10 backdrop-blur p-5"
        >
          <div className="flex gap-0.5 mb-3">
            {Array(5).fill(0).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <p className="text-sm text-brand-100 italic leading-relaxed">
                "{quotes[quoteIdx].text}"
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-400 grid place-items-center font-bold text-sm shrink-0">
                  {quotes[quoteIdx].initials}
                </div>
                <div>
                  <p className="text-sm font-semibold">{quotes[quoteIdx].name}</p>
                  <p className="text-xs text-brand-300">{quotes[quoteIdx].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          {/* Dots */}
          <div className="flex gap-1.5 mt-4">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setQuoteIdx(i)}
                className={`h-1.5 rounded-full transition-all ${i === quoteIdx ? "w-5 bg-white" : "w-1.5 bg-white/30"}`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* ── Right panel ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex-1 flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 sm:px-10 py-5">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold font-display">EduFlow</span>
          </Link>
          <div className="hidden lg:block" />

          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            {lang === "am" ? "ወደ ቤት" : "Back to home"}
          </Link>
        </div>

        {/* Auth content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 pb-10">
          <div className="w-full max-w-[420px]">

            {/* Heading */}
            <div className="mb-7">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {mode === "sign-in"
                  ? (lang === "am" ? "እንኳን ደህና መጣህ" : "Welcome back")
                  : (lang === "am" ? "አዲስ መለያ ፍጠር" : "Create your account")}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                {mode === "sign-in"
                  ? (lang === "am" ? "EduFlow ለመቀጠል ፈረሙ" : "Sign in to continue to EduFlow")
                  : (lang === "am" ? "ነፃ ነው — አሁን ይጀምሩ!" : "It's free — get started today!")}
              </p>
            </div>

            {/* Role context cards */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[
                { icon: Users,         label: lang === "am" ? "ተማሪ" : "Learner",    color: "text-brand-600 dark:text-brand-400", bg: "bg-brand-50 dark:bg-brand-500/10" },
                { icon: BookOpen,      label: lang === "am" ? "አስተማሪ" : "Instructor", color: "text-green-600 dark:text-green-400",  bg: "bg-green-50 dark:bg-green-500/10" },
                { icon: GraduationCap, label: lang === "am" ? "አስተዳዳሪ" : "Admin",    color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-500/10" },
              ].map((r) => (
                <div
                  key={r.label}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 p-3 text-center ${r.bg}`}
                >
                  <r.icon className={`h-5 w-5 ${r.color}`} />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{r.label}</span>
                </div>
              ))}
            </div>

            {/* Clerk widget */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft p-6">
              <AnimatePresence mode="wait">
                {mode === "sign-in" ? (
                  <motion.div
                    key="sign-in"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SignIn
                      routing="virtual"
                      fallbackRedirectUrl="/my-dashboard"
                      appearance={clerkAppearance}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sign-up"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <SignUp
                      routing="virtual"
                      fallbackRedirectUrl="/my-dashboard"
                      appearance={clerkAppearance}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Toggle */}
            <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
              {mode === "sign-in"
                ? (lang === "am" ? "አካውንት የለህም? " : "No account yet? ")
                : (lang === "am" ? "አካውንት አለህ? " : "Already have an account? ")}
              <button
                onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
                className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                {mode === "sign-in"
                  ? (lang === "am" ? "ተመዝገብ" : "Sign up free")
                  : (lang === "am" ? "ግባ" : "Sign in")}
              </button>
            </p>

            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
              {[
                { icon: CheckCircle, label: lang === "am" ? "ደህንነቱ የተጠበቀ" : "Secure" },
                { icon: CheckCircle, label: lang === "am" ? "ነፃ ለጀማሪዎች" : "Free to start" },
                { icon: CheckCircle, label: lang === "am" ? "ሰርዝ ምንግዜም" : "Cancel anytime" },
              ].map((b) => (
                <span key={b.label} className="flex items-center gap-1">
                  <b.icon className="h-3.5 w-3.5 text-green-500" />
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
