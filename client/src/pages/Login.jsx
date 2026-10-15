import { SignIn, SignUp, useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  BookOpen,
  Award,
  Users,
  ArrowLeft,
  CheckCircle,
  Star,
  Zap,
  Shield,
  Layers,
  Sparkles,
  Compass,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

// ─── Role Showcases on the Left Panel ─────────────────────────────────────────
const roleShowcases = {
  en: {
    student: {
      badge: "Learner Portal",
      title: "Interactive Learning\nWithout Limits",
      desc: "Enroll in 500+ expert-led courses across technology, design, and business. Watch HD video lessons, track your progress, and earn recognized credentials.",
      features: [
        { icon: BookOpen, title: "500+ Video Courses", desc: "Beginner to advanced hands-on curriculum" },
        { icon: Award,    title: "Verified Certificates", desc: "Shareable credentials upon course completion" },
        { icon: Users,    title: "10,000+ Active Students", desc: "Thriving bilingual learning community" },
      ],
    },
    instructor: {
      badge: "Instructor Studio",
      title: "Teach, Inspire\n& Build Curriculum",
      desc: "Empower learners worldwide with your expertise. Build custom course sections, upload video lessons, monitor enrollments, and track student completion.",
      features: [
        { icon: Layers,   title: "Curriculum Builder", desc: "Organize sections & upload multi-part video lessons" },
        { icon: Users,    title: "Student Analytics", desc: "Monitor student progress and course engagement" },
        { icon: Award,    title: "Automated Credentialing", desc: "Students earn official certificates as they complete your material" },
      ],
    },
    admin: {
      badge: "Admin Command Center",
      title: "Complete Platform\nGovernance & Control",
      desc: "Full administrative suite to manage users, publish and edit courses, monitor system health, and directly issue or verify student completion certificates.",
      features: [
        { icon: Shield,   title: "Platform Administration", desc: "Assign roles, manage permissions, and govern platform users" },
        { icon: BookOpen, title: "Post & Manage Courses", desc: "Create, edit, publish, or archive courses across all departments" },
        { icon: Award,    title: "Issue & Verify Certificates", desc: "Award verified graduation credentials to students in one click" },
      ],
    },
  },
  am: {
    student: {
      badge: "የተማሪ ፖርታል",
      title: "ያለ ገደብ የሚማሩበት\nሕያው የትምህርት ማዕከል",
      desc: "ከጀማሪ እስከ ከፍተኛ ደረጃ በቴክ፣ ዲዛይን እና ቢዝነስ ከዓለም አቀፍ ባለሙያዎች ጋር ይማሩ፣ ሲርቲፊኬት ያግኙ እና ሙያዎን ያሻሽሉ።",
      features: [
        { icon: BookOpen, title: "500+ የቪዲዮ ትምህርቶች", desc: "በአማርኛ እና በእንግሊዝኛ የተዘጋጁ" },
        { icon: Award,    title: "የተረጋገጡ ሲርቲፊኬቶች", desc: "ትምህርቱን ሲጨርሱ የሚታወቅ ማስረጃ ያግኙ" },
        { icon: Users,    title: "10,000+ ተማሪዎች", desc: "ሕያው ዓለም አቀፍ ማህበረሰብ ይቀላቀሉ" },
      ],
    },
    instructor: {
      badge: "የአስተማሪ ስቱዲዮ",
      title: "ያስተምሩ፣ ያነሳሱ\nእና እውቀትዎን ያካፍሉ",
      desc: "የእራስዎን ትምህርቶች ይገንቡ፣ የቪዲዮ ትምህርቶችን ይጫኑ እና የተማሪዎችዎን ሂደት በቀላሉ ይከታተሉ።",
      features: [
        { icon: Layers,   title: "የሥርዓተ ትምህርት አዘጋጅ", desc: "ክፍሎችንና ትምህርቶችን በቀላሉ ይጫኑ" },
        { icon: Users,    title: "የተማሪዎች ክትትል", desc: "የምዝገባና የትምህርት እድገት መረጃዎች" },
        { icon: Award,    title: "የሙያ ሲርቲፊኬት", desc: "ተማሪዎች ትምህርቱን ሲያጠናቅቁ የሚሰጥ" },
      ],
    },
    admin: {
      badge: "የአስተዳዳሪ ማዕከል",
      title: "ሙሉ የፕላትፎርም\nቁጥጥርና አስተዳደር",
      desc: "ተጠቃሚዎችን ያስተዳድሩ፣ ትምህርቶችን ይለጥፉና ያትሙ፣ እና ለተማሪዎች ኦፊሴላዊ የሙያ ሲርቲፊኬቶችን ይስጡ።",
      features: [
        { icon: Shield,   title: "የተጠቃሚ አስተዳደር", desc: "ሚናዎችን ይቀይሩ እና ደህንነትን ይቆጣጠሩ" },
        { icon: BookOpen, title: "ትምህርቶችን ይለጥፉ", desc: "አዳዲስ ትምህርቶችን ይፍጠሩ እና ያትሙ" },
        { icon: Award,    title: "ሲርቲፊኬት ይስጡ", desc: "ለተማሪዎች የተረጋገጠ ሲርቲፊኬት በአንድ ጠቅታ ይስጡ" },
      ],
    },
  },
};

const testimonials = {
  en: [
    { text: "EduFlow completely transformed my career. The certificate helped me land my dream job.", name: "Samson Abebe", role: "Software Engineer", initials: "SA" },
    { text: "The Admin tools and course creation workflows make running our academy seamless.", name: "Dawit Tesfaye", role: "Academy Admin", initials: "DT" },
    { text: "Teaching on EduFlow allowed me to reach thousands of motivated students worldwide.", name: "Jane Doe", role: "Senior Instructor", initials: "JD" },
  ],
  am: [
    { text: "\"EduFlow ሙያዬን ሙሉ ለሙሉ ቀይሮታል። ሲርቲፊኬቱ ሥራ ለማግኘት ረድቶኛል።\"", name: "ሳምሶን አበበ", role: "ሶፍትዌር ኢንጂነር", initials: "ሳ" },
    { text: "\"የአስተዳዳሪ ዳሽቦርዱ ትምህርቶችን ለመለጠፍ እና ሲርቲፊኬት ለመስጠት በጣም ምቹ ነው።\"", name: "ዳዊት ተስፋዬ", role: "አስተዳዳሪ", initials: "ዳ" },
    { text: "\"በEduFlow ላይ ማስተማር በሺዎች የሚቆጠሩ ተማሪዎችን ለመድረስ አስችሎኛል።\"", name: "ጄን ዶ", role: "ዋና አስተማሪ", initials: "ጄ" },
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
  const lang = i18n.language === "am" ? "am" : "en";
  const quotes = testimonials[lang];

  const { isSignedIn, isLoaded } = useAuth();
  const { data: user, isLoading: userLoading } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeRole, setActiveRole] = useState("student");
  const [mode, setMode] = useState(
    searchParams.get("mode") === "signup" ? "sign-up" : "sign-in"
  );
  const [quoteIdx, setQuoteIdx] = useState(0);

  // Cycle testimonials
  useEffect(() => {
    const id = setInterval(() => setQuoteIdx((i) => (i + 1) % quotes.length), 5500);
    return () => clearInterval(id);
  }, [quotes.length]);

  // Redirect once signed-in and role is resolved
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (!user) return; // wait for role to load from backend

    if (user.role === "admin") {
      navigate("/admin", { replace: true });
    } else if (user.role === "instructor") {
      navigate("/instructor", { replace: true });
    } else {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, user, navigate]);

  const currentShowcase = roleShowcases[lang][activeRole];

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 overflow-hidden">

      {/* ── Left panel ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-[50%] xl:w-[52%] flex-col justify-between p-10 xl:p-14
                   bg-gradient-to-br from-brand-600 via-brand-700 to-slate-900
                   text-white relative overflow-hidden"
      >
        {/* Background ambient lighting */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-white/[0.05]" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white/[0.04]" />
          <div className="absolute top-1/3 -right-20 w-64 h-64 rounded-full bg-brand-400/20 blur-2xl" />
        </div>

        {/* Top brand header */}
        <div className="relative z-10 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/20 backdrop-blur group-hover:bg-white/30 transition shadow-soft">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight font-display">EduFlow</span>
              <span className="block text-[11px] font-medium text-brand-200 tracking-wider uppercase">
                {lang === "am" ? "የአካዳሚክ ፖርታል" : "Unified Learning Academy"}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Interactive Role Switcher & Features */}
        <div className="relative z-10 space-y-6 my-auto py-4">
          {/* Role selector tabs */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-200 mb-2.5">
              {lang === "am" ? "የፖርታል ሚናዎች" : "Explore Unified Portals:"}
            </p>
            <div className="inline-flex p-1 rounded-xl bg-white/10 backdrop-blur border border-white/15 gap-1">
              {[
                { key: "student",    icon: Users,         label: lang === "am" ? "ተማሪ" : "Student" },
                { key: "instructor", icon: BookOpen,      label: lang === "am" ? "አስተማሪ" : "Instructor" },
                { key: "admin",      icon: Shield,        label: lang === "am" ? "አስተዳዳሪ" : "Admin" },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeRole === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveRole(tab.key)}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? "bg-white text-slate-900 shadow-md"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dynamic Content per Role */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeRole}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div>
                <span className="inline-flex items-center gap-1.5 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full px-3 py-1 text-xs font-bold mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  {currentShowcase.badge}
                </span>
                <h2 className="text-3xl xl:text-4xl font-extrabold font-display leading-[1.15] whitespace-pre-line">
                  {currentShowcase.title}
                </h2>
                <p className="mt-3 text-sm xl:text-base text-brand-100 leading-relaxed max-w-lg">
                  {currentShowcase.desc}
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3">
                {currentShowcase.features.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-start gap-3 rounded-xl bg-white/[0.08] backdrop-blur p-3 border border-white/10"
                    >
                      <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/20 text-white">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm">{f.title}</p>
                        <p className="text-xs text-brand-200 mt-0.5">{f.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Smart routing explanation banner */}
          <div className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-3.5 text-xs text-brand-100 flex items-start gap-2.5">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>{lang === "am" ? "አንድ የተዋሃደ መግቢያ: " : "One Unified Login: "}</strong>
              {lang === "am"
                ? "በመለያዎ ይግቡ። ስርዓቱ የእርስዎን ፈቃድ (አስተዳዳሪ፣ አስተማሪ ወይም ተማሪ) ለይቶ በቀጥታ ወደ ትክክለኛው ዳሽቦርድ ይመራዎታል።"
                : "Sign in with your account. EduFlow automatically detects your permissions (Admin, Instructor, or Learner) and routes you to your dedicated dashboard."}
            </p>
          </div>
        </div>

        {/* Footer: Rotating testimonial & stats */}
        <div className="relative z-10 pt-4 border-t border-white/15 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-6">
              {[
                { value: "10K+", label: lang === "am" ? "ተማሪዎች" : "Learners" },
                { value: "500+", label: lang === "am" ? "ትምህርቶች" : "Courses" },
                { value: "100%", label: lang === "am" ? "ሲርቲፊኬት" : "Verified Certs" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-[11px] text-brand-200">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="hidden xl:flex items-center gap-1">
              {quotes.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setQuoteIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === quoteIdx ? "w-5 bg-white" : "w-1.5 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="text-xs text-brand-200 italic line-clamp-1">
            "{quotes[quoteIdx].text}" — <span className="font-semibold text-white">{quotes[quoteIdx].name}</span> ({quotes[quoteIdx].role})
          </div>
        </div>
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
            {lang === "am" ? "ወደ መነሻ" : "Back to home"}
          </Link>
        </div>

        {/* Auth content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 sm:px-10 pb-10">
          <div className="w-full max-w-[440px]">

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                {mode === "sign-in"
                  ? (lang === "am" ? "እንኳን ደህና መጡ" : "Welcome to EduFlow")
                  : (lang === "am" ? "አዲስ መለያ ይፍጠሩ" : "Create your account")}
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                {mode === "sign-in"
                  ? (lang === "am"
                      ? "የተማሪ፣ አስተማሪ ወይም አስተዳዳሪ ዳሽቦርድ ለመድረስ ይግቡ"
                      : "Sign in to access your Student, Instructor, or Admin Dashboard")
                  : (lang === "am"
                      ? "አሁኑኑ በነፃ ይመዝገቡና መማር ይጀምሩ"
                      : "Free to join — start learning or teaching today!")}
              </p>
            </div>

            {/* Role context selector pills */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {lang === "am" ? "የመግቢያ ፖርታል ይምረጡ:" : "Select your target portal:"}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  {
                    key: "student",
                    icon: Users,
                    label: lang === "am" ? "ተማሪ" : "Learner",
                    color: "text-brand-600 dark:text-brand-400",
                    activeBg: "border-brand-500 bg-brand-50/70 dark:bg-brand-500/15 dark:border-brand-500",
                    badge: lang === "am" ? "ትምህርት" : "Learn",
                  },
                  {
                    key: "instructor",
                    icon: BookOpen,
                    label: lang === "am" ? "አስተማሪ" : "Instructor",
                    color: "text-emerald-600 dark:text-emerald-400",
                    activeBg: "border-emerald-500 bg-emerald-50/70 dark:bg-emerald-500/15 dark:border-emerald-500",
                    badge: lang === "am" ? "አስተምር" : "Teach",
                  },
                  {
                    key: "admin",
                    icon: Shield,
                    label: lang === "am" ? "አስተዳዳሪ" : "Admin",
                    color: "text-purple-600 dark:text-purple-400",
                    activeBg: "border-purple-500 bg-purple-50/70 dark:bg-purple-500/15 dark:border-purple-500",
                    badge: lang === "am" ? "አስተዳድር" : "Manage",
                  },
                ].map((r) => {
                  const Icon = r.icon;
                  const isSelected = activeRole === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setActiveRole(r.key)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-2.5 text-center transition-all ${
                        isSelected
                          ? r.activeBg + " shadow-sm scale-[1.02]"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${r.color}`} />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        {r.label}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {r.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
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

            {/* Toggle Sign-in / Sign-up */}
            <p className="mt-5 text-center text-sm text-slate-500 dark:text-slate-400">
              {mode === "sign-in"
                ? (lang === "am" ? "አካውንት የለዎትም? " : "Don't have an account yet? ")
                : (lang === "am" ? "አካውንት አለዎት? " : "Already have an account? ")}
              <button
                type="button"
                onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
                className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                {mode === "sign-in"
                  ? (lang === "am" ? "በነፃ ይመዝገቡ" : "Sign up free")
                  : (lang === "am" ? "ይግቡ" : "Sign in")}
              </button>
            </p>

            {/* Trust badges */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
              {[
                { label: lang === "am" ? "ደህንነቱ የተጠበቀ" : "Secure Auth" },
                { label: lang === "am" ? "ፈጣን መግቢያ" : "Instant Routing" },
                { label: lang === "am" ? "የተረጋገጡ ሲርቲፊኬቶች" : "Verified Certs" },
              ].map((b) => (
                <span key={b.label} className="flex items-center gap-1">
                  <CheckCircle className="h-3.5 w-3.5 text-green-500" />
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
