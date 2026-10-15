import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen, TrendingUp, Award, Clock,
  ArrowRight, Compass, Home, GraduationCap,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";
import { useMyEnrollments } from "@/hooks/useEnrollments";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

// Stat card
const StatCard = ({ icon: Icon, label, value, color = "brand", delay = 0 }) => {
  const colors = {
    brand:  "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",
    green:  "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
    amber:  "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="card p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide font-medium">{label}</p>
          <p className="mt-1.5 text-2xl font-bold">{value}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${colors[color]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
};

// Quick nav card
const NavCard = ({ icon: Icon, label, to, color = "brand" }) => {
  const colors = {
    brand:  "bg-brand-50 text-brand-700 border-brand-100 dark:bg-brand-500/10 dark:text-brand-300 dark:border-brand-500/20",
    green:  "bg-green-50 text-green-700 border-green-100 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/20",
    amber:  "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    purple: "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/20",
  };
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl border p-4 font-medium text-sm hover:shadow-soft transition ${colors[color]}`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {label}
      <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
    </Link>
  );
};

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const am = i18n.language === "am";
  const { data: user } = useUser();
  const { data: enrollments, isLoading } = useMyEnrollments();

  const totalCourses = enrollments?.length || 0;
  const completed    = enrollments?.filter((e) => e.progressPercent >= 100).length || 0;
  const inProgress   = totalCourses - completed;
  const avgProgress  = totalCourses
    ? Math.round(enrollments.reduce((a, e) => a + e.progressPercent, 0) / totalCourses)
    : 0;

  return (
    <section className="container py-10 max-w-6xl">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          {/* Learner role pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 px-3 py-1 text-xs font-semibold mb-3">
            <GraduationCap className="h-3.5 w-3.5" />
            {am ? "ተማሪ" : "Learner"}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display">
            {t("dashboard.welcome")}{user?.firstName ? `, ${user.firstName}` : ""} 👋
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {am
              ? "ዛሬ ምን ትማራለህ? ቀጥል የሚኖርህን ትምህርት ከዚህ ተከተል።"
              : "What are you learning today? Pick up where you left off."}
          </p>
        </div>
        <Link to="/courses" className="btn-primary shrink-0 gap-1.5">
          <Compass className="h-4 w-4" />
          {am ? "ትምህርቶችን ፈልግ" : "Explore Courses"}
        </Link>
      </motion.div>

      {/* Quick nav — Home, Courses, About */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
      >
        <NavCard icon={Home}      label={am ? "መነሻ"     : "Home"}         to="/"         color="brand"  />
        <NavCard icon={BookOpen}  label={am ? "ትምህርቶች" : "Courses"}      to="/courses"  color="green"  />
        <NavCard icon={Award}     label={am ? "ሲርቲፊኬቶቼ" : "Certificates"} to="/courses"  color="amber"  />
        <NavCard icon={GraduationCap} label={am ? "መገለጫ" : "Profile"}     to="/profile"  color="purple" />
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard icon={BookOpen}   label={t("dashboard.stats.enrolled")}   value={totalCourses}     color="brand"  delay={0.08} />
        <StatCard icon={TrendingUp} label={t("dashboard.stats.inProgress")} value={inProgress}       color="green"  delay={0.12} />
        <StatCard icon={Award}      label={t("dashboard.stats.completed")}  value={completed}        color="amber"  delay={0.16} />
        <StatCard icon={Clock}      label={t("dashboard.stats.avgProgress")}value={`${avgProgress}%`}color="purple" delay={0.2}  />
      </div>

      {/* My Courses */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold">{t("dashboard.myCourses")}</h2>
        <Button as={Link} to="/courses" variant="outline" size="sm">
          {t("dashboard.browseMore")}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-52" />)}
        </div>
      ) : !enrollments?.length ? (
        <EmptyState
          icon={BookOpen}
          title={t("dashboard.empty.title")}
          description={t("dashboard.empty.description")}
          action={<Button as={Link} to="/courses">{t("dashboard.empty.action")}</Button>}
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((e, i) => {
            const c = e.course;
            if (!c) return null;
            return (
              <motion.div
                key={e._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="card overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
                  {c.thumbnail && (
                    <img src={c.thumbnail} alt={c.title} className="h-full w-full object-cover" />
                  )}
                  {/* Progress overlay badge */}
                  <span className={`absolute top-2.5 right-2.5 badge text-xs font-semibold ${
                    e.progressPercent >= 100
                      ? "bg-green-500 text-white"
                      : "bg-white/90 text-slate-700 dark:bg-slate-900/90 dark:text-slate-200"
                  }`}>
                    {e.progressPercent >= 100 ? (am ? "ተጠናቋ" : "Done ✓") : `${e.progressPercent}%`}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold line-clamp-2 text-sm">{c.title}</h3>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                      <span>{t("dashboard.progress")}</span>
                      <span className="font-medium">{e.progressPercent}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${e.progressPercent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className={`h-full rounded-full ${
                          e.progressPercent >= 100
                            ? "bg-gradient-to-r from-green-400 to-green-600"
                            : "bg-gradient-to-r from-brand-500 to-brand-700"
                        }`}
                      />
                    </div>
                  </div>
                  <Button as={Link} to={`/learn/${c.slug}`} className="w-full mt-4" size="sm"
                    variant={e.progressPercent >= 100 ? "outline" : "primary"}>
                    {e.progressPercent >= 100 ? t("dashboard.review") : t("dashboard.continue")}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
