import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  GraduationCap, Heart, Globe, Zap, Users, Award,
  BookOpen, ArrowRight, CheckCircle, Star, MapPin, Mail,
} from "lucide-react";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
});

export default function About() {
  const { t, i18n } = useTranslation();
  const am = i18n.language === "am";

  const stats = [
    { icon: Users,         value: "10,000+", label: am ? "ተማሪዎች" : "Students" },
    { icon: BookOpen,      value: "500+",    label: am ? "ትምህርቶች" : "Courses" },
    { icon: GraduationCap, value: "150+",    label: am ? "አስተማሪዎች" : "Instructors" },
    { icon: Globe,         value: "30+",     label: am ? "ሀገሮች" : "Countries" },
  ];

  const values = [
    {
      icon: Star,
      title: am ? "ጥራት በፊት" : "Quality First",
      desc: am
        ? "ሁሉም ትምህርቶች በኢንዱስትሪ ባለሙያዎች ይጸድቃሉ።"
        : "Every course is reviewed by industry experts before it goes live.",
      color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    },
    {
      icon: Heart,
      title: am ? "ተማሪ ማዕከል" : "Learner-Centric",
      desc: am
        ? "ሁሉንም ዘርፎቻቸውን በተማሪው ስኬት ላይ ያቀናጃሉ።"
        : "We design every feature around one goal — your success.",
      color: "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400",
    },
    {
      icon: Zap,
      title: am ? "ቀጣይ ማሻሻያ" : "Always Improving",
      desc: am
        ? "ፕላትፎርሙን ከቴክ ዓለም ጋር ሁሌ ያዘምናሉ።"
        : "We ship updates constantly, keeping the platform ahead of the curve.",
      color: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
    },
    {
      icon: Globe,
      title: am ? "ለሁሉም ተደራሽ" : "Accessible to All",
      desc: am
        ? "ትምህርቱ ወደ ዓለም ሁሉ ይደርስ — አማርኛ እና እንግሊዝኛ ይደግፋሉ።"
        : "We believe quality education should reach everyone, everywhere — including in Amharic.",
      color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    },
  ];

  const team = [
    { name: "Abebe Girma",   role: am ? "መስራች እና ዋና ሥራ አስኪያጅ" : "Co-founder & CEO",       initials: "AG" },
    { name: "Sara Mohammed", role: am ? "ዋና ቴክኒካ ኃላፊ"           : "Chief Technology Officer", initials: "SM" },
    { name: "Dawit Tesfaye", role: am ? "ዋና ትምህርት ኃላፊ"          : "Head of Learning",          initials: "DT" },
    { name: "Tigist Haile",  role: am ? "የምርት ዲዛይን ኃላፊ"         : "Head of Product Design",    initials: "TH" },
  ];

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-white to-slate-50 dark:from-brand-950/30 dark:via-slate-950 dark:to-slate-950 py-24 md:py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-brand-100/40 dark:bg-brand-500/5 blur-3xl" />
          <div className="absolute bottom-0 -left-20 w-72 h-72 rounded-full bg-purple-100/30 dark:bg-purple-500/5 blur-3xl" />
        </div>
        <div className="container relative z-10 max-w-4xl text-center">
          <motion.div {...fade(0)}>
            <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 mb-4 inline-flex">
              <GraduationCap className="h-3.5 w-3.5" />
              {am ? "ስለ EduFlow" : "About EduFlow"}
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold font-display tracking-tight">
              {am ? "ትምህርትን ለሁሉም ተደራሽ እናደርጋለን" : "Making quality education accessible to everyone"}
            </h1>
            <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
              {am
                ? "EduFlow የተፈጠረው ሁሉም ሰው ጥሩ ትምህርት ማግኘት ይችሉ ዘንድ ነው — ቋንቋ፣ አካባቢ ወይም ዳራ ሳይዛቸው።"
                : "EduFlow was founded with one belief: great education should be within reach for everyone — regardless of language, location, or background."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────── */}
      <section className="bg-brand-600 py-14">
        <div className="container grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              {...fade(i * 0.08)}
              className="text-center text-white"
            >
              <s.icon className="h-7 w-7 mx-auto mb-2 text-brand-200" />
              <p className="text-3xl font-extrabold">{s.value}</p>
              <p className="text-sm text-brand-200 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Mission & Vision ─────────────────────────────────────────── */}
      <section className="container py-20 md:py-28">
        <div className="grid gap-10 lg:grid-cols-2">
          <motion.div {...fade(0)} className="card p-8">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300 mb-5">
              <GraduationCap className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold mb-3">
              {am ? "ተልዕኳችን" : "Our Mission"}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {am
                ? "የተሳካ ትምህርትን ለሁሉም ተደራሽ ማድረግ — ትምህርት የሚያስደስት፣ ተግባራዊ እና ሕይወት የሚቀይር ነው ብለን እናምናለን።"
                : "To democratize quality education by making expert-led courses accessible to everyone, everywhere. We believe learning should be engaging, practical, and transformative."}
            </p>
          </motion.div>
          <motion.div {...fade(0.1)} className="card p-8">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-5">
              <Globe className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-bold mb-3">
              {am ? "ራዕያችን" : "Our Vision"}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {am
                ? "ማንኛውም ሰው ያለ ዳራ ወይም አካባቢ ገደብ ክህሎት ማዳበርና ሙያ ማሻሻል የሚችሉበት ዓለም።"
                : "A world where anyone can acquire in-demand skills and advance their career regardless of their background or location."}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-20">
        <div className="container">
          <motion.div {...fade(0)} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold font-display">
              {am ? "እሴቶቻችን" : "Our Values"}
            </h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400">
              {am ? "ሁሉም ወሳኝ ውሳኔ ከእነዚህ መሰረቶች ይነሳሉ" : "Every decision we make flows from these core principles"}
            </p>
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="card p-6"
              >
                <div className={`grid h-12 w-12 place-items-center rounded-xl mb-4 ${v.color}`}>
                  <v.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────────────────── */}
      <section className="container py-20 md:py-28">
        <motion.div {...fade(0)} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold font-display">
            {am ? "የቡድናችን አባላት" : "Meet the Team"}
          </h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            {am
              ? "ትምህርትን ለማሻሻል ቆርጠው የቆሙ ትምህርተኞች፣ ኢንጂነሮች እና ዲዛይነሮች።"
              : "A diverse crew of educators, engineers, and designers passionate about transforming online education."}
          </p>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {team.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.09 }}
              className="card p-6 text-center"
            >
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center mx-auto mb-4 text-white text-xl font-bold shadow-soft">
                {m.initials}
              </div>
              <p className="font-bold">{m.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{m.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Location ──────────────────────────────────────────────────── */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-14">
        <div className="container grid gap-6 sm:grid-cols-3 text-center">
          {[
            { icon: MapPin, label: am ? "አድራሻ" : "Location",      value: am ? "አዲስ አበባ፣ ኢትዮጵያ" : "Addis Ababa, Ethiopia" },
            { icon: Mail,   label: am ? "ኢሜይል" : "Email",          value: "support@eduflow.dev" },
            { icon: Globe,  label: am ? "ዓለም አቀፍ" : "Global reach", value: "30+ countries" },
          ].map((item, i) => (
            <motion.div key={i} {...fade(i * 0.1)} className="flex flex-col items-center gap-2">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-300">
                <item.icon className="h-5 w-5" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.label}</p>
              <p className="font-medium">{item.value}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className="container py-20 text-center">
        <motion.div {...fade(0)}>
          <h2 className="text-3xl md:text-4xl font-extrabold font-display mb-4">
            {am ? "አሁን ይቀላቀሉ" : "Ready to join us?"}
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
            {am ? "ከ10,000+ ተማሪዎች ጋር ይቀላቀሉ እና ሙያዎን ያሻሽሉ።" : "Join 10,000+ learners already building their future with EduFlow."}
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/login" className="btn-primary !px-6 !py-3 !text-base gap-2">
              {am ? "ጀምር — ነፃ ነው" : "Get started — free"} <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/courses" className="btn-outline !px-6 !py-3 !text-base">
              {am ? "ትምህርቶችን ፈልግ" : "Browse courses"}
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
