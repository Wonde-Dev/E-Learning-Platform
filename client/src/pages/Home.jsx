import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight, Sparkles, GraduationCap, Globe, Award,
  BookOpen, Clock, CheckCircle, Play, Star, Users, Zap,
} from "lucide-react";
import { useAuth } from "@clerk/clerk-react";
import FloatingCampus from "@/components/animated/FloatingCampus";
import { FeaturedCourses } from "@/components/course/FeaturedCourses";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay },
});

export default function Home() {
  const { t } = useTranslation();
  const { isSignedIn } = useAuth();
  const steps = t("home.howItWorks.steps", { returnObjects: true }) || [];
  const stepIcons = [BookOpen, Clock, Award];

  const stats = [
    { icon: GraduationCap, value: "10K+", key: "students", color: "text-brand-600 dark:text-brand-400" },
    { icon: BookOpen,       value: "500+", key: "courses",  color: "text-green-600 dark:text-green-400" },
    { icon: Star,           value: "4.9",  key: "rating",   color: "text-amber-500 dark:text-amber-400" },
    { icon: Globe,          value: "30+",  label: "Countries", color: "text-purple-600 dark:text-purple-400" },
  ];

  const benefits = [
    "Expert-led video lessons",
    "Hands-on projects & quizzes",
    "Verified certificates",
    "Lifetime access",
    "Mobile & desktop",
    "English & Amharic support",
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] w-full overflow-hidden bg-gradient-to-br from-brand-50 via-white to-slate-50 dark:from-brand-950/30 dark:via-slate-950 dark:to-slate-950">
        <FloatingCampus />

        <div className="container relative z-10 flex min-h-[90vh] flex-col justify-center py-24">
          <motion.div {...fade(0)} className="max-w-3xl">
            <motion.span
              {...fade(0.1)}
              className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 mb-4 inline-flex"
            >
              <Sparkles className="h-3.5 w-3.5" /> {t("home.hero.badge")}
            </motion.span>

            <h1 className="text-5xl md:text-7xl font-extrabold font-display tracking-tight leading-[1.08]">
              {t("home.hero.title")}
            </h1>

            <p className="mt-6 text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              {t("home.hero.subtitle")}
            </p>

            <motion.div {...fade(0.25)} className="mt-8 flex flex-wrap gap-3">
              <Link to="/courses" className="btn-primary !px-6 !py-3 !text-base gap-2">
                {t("home.hero.ctaPrimary")} <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to={isSignedIn ? "/my-dashboard" : "/login"}
                className="btn-outline !px-6 !py-3 !text-base gap-2"
              >
                {isSignedIn ? t("home.hero.ctaSecondary") : t("common.signIn")}
              </Link>
            </motion.div>

            {/* Benefits inline */}
            <motion.div {...fade(0.35)} className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              {benefits.slice(0, 4).map((b) => (
                <span key={b} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0" /> {b}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl"
          >
            {stats.map((s, i) => (
              <motion.div
                key={s.key || s.label}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.45 + i * 0.08 }}
                className="card p-4"
              >
                <s.icon className={`h-5 w-5 mb-2 ${s.color}`} />
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {s.label || t(`home.stats.${s.key}`)}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────── */}
      <section className="container py-20 md:py-28">
        <motion.div {...fade(0)} className="text-center mb-14">
          <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 mb-3 inline-flex">
            <Zap className="h-3.5 w-3.5" /> {t("home.howItWorks.title")}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display">
            {t("home.howItWorks.subtitle")}
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {(Array.isArray(steps) ? steps : []).map((step, i) => {
            const Icon = stepIcons[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                className="card p-8 text-center relative overflow-hidden"
              >
                {/* Step number */}
                <span className="absolute top-4 right-5 text-6xl font-black text-slate-100 dark:text-slate-800 select-none leading-none">
                  {i + 1}
                </span>
                <motion.div
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  className="grid h-16 w-16 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300 mx-auto mb-5"
                >
                  <Icon className="h-7 w-7" />
                </motion.div>
                <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Featured courses ─────────────────────────────────────────── */}
      <div className="bg-slate-50/60 dark:bg-slate-900/40">
        <div className="container">
          <FeaturedCourses
            title={t("home.featured.title")}
            subtitle={t("home.featured.subtitle")}
            filters={{ sort: "-createdAt", limit: 12 }}
            limit={4}
          />
        </div>
      </div>

      {/* ── Why EduFlow ───────────────────────────────────────────────── */}
      <section className="container py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <motion.div {...fade(0)}>
            <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 mb-4 inline-flex">
              <CheckCircle className="h-3.5 w-3.5" /> Why EduFlow
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-display mb-5">
              Everything you need to level up your skills
            </h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-8">
              Whether you're a total beginner or looking to sharpen advanced skills, EduFlow
              gives you the tools, community, and structure to succeed — in English or Amharic.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {benefits.map((b) => (
                <div key={b} className="flex items-center gap-2.5 text-sm font-medium">
                  <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </div>
                  {b}
                </div>
              ))}
            </div>
            <Link to="/courses" className="btn-primary mt-8 inline-flex gap-2">
              Browse all courses <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Visual grid */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { icon: Play,          label: "Video Lessons",     value: "HD quality",       color: "bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300" },
              { icon: Award,         label: "Certificates",      value: "Globally recognized", color: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" },
              { icon: Users,         label: "Community",         value: "10K+ members",     color: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400" },
              { icon: GraduationCap, label: "Expert Instructors", value: "Industry pros",    color: "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="card p-5"
              >
                <div className={`grid h-12 w-12 place-items-center rounded-xl mb-3 ${item.color}`}>
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.value}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────────────── */}
      {!isSignedIn && (
        <section className="bg-gradient-to-r from-brand-600 to-brand-800 py-16">
          <motion.div {...fade(0)} className="container text-center text-white">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display mb-4">
              Ready to start learning?
            </h2>
            <p className="text-brand-100 text-lg mb-8 max-w-xl mx-auto">
              Join 10,000+ learners already growing their skills on EduFlow.
              It's free to get started.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/login" className="btn bg-white text-brand-700 hover:bg-brand-50 !px-6 !py-3 !text-base gap-2">
                Get started — free <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/courses" className="btn border border-white/30 text-white hover:bg-white/10 !px-6 !py-3 !text-base">
                Browse courses
              </Link>
            </div>
          </motion.div>
        </section>
      )}
    </>
  );
}
