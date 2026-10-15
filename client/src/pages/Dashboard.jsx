import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, TrendingUp, Award, Clock,
  ArrowRight, Compass, Home, GraduationCap, CheckCircle2,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";
import { useMyEnrollments } from "@/hooks/useEnrollments";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import CertificateModal from "@/components/common/CertificateModal";

// Stat card
const StatCard = ({ icon: Icon, label, value, color = "brand", delay = 0, onClick }) => {
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
      onClick={onClick}
      className={`card p-5 ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""}`}
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

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const am = i18n.language === "am";
  const { data: user } = useUser();
  const { data: enrollments, isLoading } = useMyEnrollments();
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [filterMode, setFilterMode] = useState("all"); // "all" | "completed"

  const totalCourses = enrollments?.length || 0;
  const certifiedEnrollments = enrollments?.filter((e) => e.certificateIssued || e.progressPercent >= 100) || [];
  const completed = certifiedEnrollments.length;
  const inProgress = totalCourses - completed;
  const avgProgress = totalCourses
    ? Math.round(enrollments.reduce((a, e) => a + (e.progressPercent || 0), 0) / totalCourses)
    : 0;

  const displayedEnrollments = filterMode === "completed"
    ? certifiedEnrollments
    : (enrollments || []);

  const openCert = (e) => {
    const studentName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Student";
    setSelectedCertificate({
      studentName,
      courseTitle: e.course?.title || "Course",
      certificateId: e.certificateId || "EDU-CERT-VERIFIED",
      issuedAt: e.certificateIssuedAt || e.completedAt || new Date(),
      instructorName: e.course?.instructor
        ? [e.course.instructor.firstName, e.course.instructor.lastName].filter(Boolean).join(" ")
        : "EduFlow Academy",
      note: e.certificateNote || "",
    });
  };

  return (
    <>
      <AnimatePresence>
        {selectedCertificate && (
          <CertificateModal
            certificate={selectedCertificate}
            onClose={() => setSelectedCertificate(null)}
          />
        )}
      </AnimatePresence>

      <section className="container py-8 max-w-6xl">
        {/* Welcome banner */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 px-3 py-1 text-xs font-semibold mb-3">
              <GraduationCap className="h-3.5 w-3.5" />
              {am ? "የተማሪ ዳሽቦርድ" : "Learner Dashboard"}
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-display">
              {t("dashboard.welcome")}{user?.firstName ? `, ${user.firstName}` : ""} 👋
            </h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              {am
                ? "ዛሬ ምን ትማራለህ? ቀጥል የሚኖርህን ትምህርት ከዚህ ተከተል ወይም የተሰጡህን ሲርቲፊኬቶች እይ።"
                : "Track your learning progress, continue active lessons, and view your verified certificates."}
            </p>
          </div>
          <Link to="/courses" className="btn-primary shrink-0 gap-1.5 shadow-soft">
            <Compass className="h-4 w-4" />
            {am ? "ትምህርቶችን ፈልግ" : "Explore Courses"}
          </Link>
        </motion.div>

        {/* Quick nav */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          <Link
            to="/"
            className="flex items-center gap-3 rounded-xl border border-brand-100 dark:border-brand-500/20 bg-brand-50/70 dark:bg-brand-500/10 p-4 font-semibold text-sm text-brand-700 dark:text-brand-300 hover:shadow-soft transition"
          >
            <Home className="h-5 w-5 shrink-0" />
            {am ? "መነሻ" : "Home"}
            <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-3 rounded-xl border border-green-100 dark:border-green-500/20 bg-green-50/70 dark:bg-green-500/10 p-4 font-semibold text-sm text-green-700 dark:text-green-300 hover:shadow-soft transition"
          >
            <BookOpen className="h-5 w-5 shrink-0" />
            {am ? "ትምህርቶች" : "Courses"}
            <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
          </Link>
          <button
            type="button"
            onClick={() => setFilterMode(filterMode === "completed" ? "all" : "completed")}
            className={`flex items-center gap-3 rounded-xl border p-4 font-semibold text-sm transition text-left ${
              filterMode === "completed"
                ? "border-amber-500 bg-amber-50 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200 shadow-sm"
                : "border-amber-100 dark:border-amber-500/20 bg-amber-50/70 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:shadow-soft"
            }`}
          >
            <Award className="h-5 w-5 shrink-0 text-amber-600" />
            <span>{am ? "ሲርቲፊኬቶቼ" : "My Certificates"} ({completed})</span>
            <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
          </button>
          <Link
            to="/profile"
            className="flex items-center gap-3 rounded-xl border border-purple-100 dark:border-purple-500/20 bg-purple-50/70 dark:bg-purple-500/10 p-4 font-semibold text-sm text-purple-700 dark:text-purple-300 hover:shadow-soft transition"
          >
            <GraduationCap className="h-5 w-5 shrink-0" />
            {am ? "መገለጫ" : "Profile"}
            <ArrowRight className="h-4 w-4 ml-auto opacity-50" />
          </Link>
        </motion.div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
          <StatCard icon={BookOpen}   label={t("dashboard.stats.enrolled")}   value={totalCourses}     color="brand"  delay={0.08} onClick={() => setFilterMode("all")} />
          <StatCard icon={TrendingUp} label={t("dashboard.stats.inProgress")} value={inProgress}       color="green"  delay={0.12} />
          <StatCard icon={Award}      label={am ? "የተሰጡ ሲርቲፊኬቶች" : "Earned Certificates"} value={completed} color="amber"  delay={0.16} onClick={() => setFilterMode("completed")} />
          <StatCard icon={Clock}      label={t("dashboard.stats.avgProgress")}value={`${avgProgress}%`}color="purple" delay={0.2}  />
        </div>

        {/* Course list header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold">
              {filterMode === "completed"
                ? (am ? "ያጠናቀቋቸውና የተረጋገጡ ሲርቲፊኬቶች" : "Certified & Completed Courses")
                : t("dashboard.myCourses")}
            </h2>
            {filterMode === "completed" && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
                {am ? "ሲርቲፊኬት የተሰጣቸው ትምህርቶች ብቻ ይታያሉ።" : "Showing courses with verified completion certificates."}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {filterMode === "completed" && (
              <Button size="sm" variant="outline" onClick={() => setFilterMode("all")}>
                {am ? "ሁሉንም አሳይ" : "Show All"}
              </Button>
            )}
            <Button as={Link} to="/courses" variant="outline" size="sm">
              {t("dashboard.browseMore")}
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-52" />)}
          </div>
        ) : !displayedEnrollments.length ? (
          <EmptyState
            icon={filterMode === "completed" ? Award : BookOpen}
            title={filterMode === "completed"
              ? (am ? "እስካሁን ያጠናቀቁት ኮርስ የለም" : "No completed courses yet")
              : t("dashboard.empty.title")}
            description={filterMode === "completed"
              ? (am ? "ትምህርቶችን ሲያጠናቅቁ ወይም አስተዳዳሪው ሲርቲፊኬት ሲሰጥዎት እዚህ ያገኟቸዋል።" : "Complete your lessons or receive an award from the admin to see certificates here.")
              : t("dashboard.empty.description")}
            action={
              <Button as={Link} to="/courses">
                {filterMode === "completed" ? (am ? "ትምህርቶችን ቀጥል" : "Browse Courses") : t("dashboard.empty.action")}
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedEnrollments.map((e, i) => {
              const c = e.course;
              if (!c) return null;
              const hasCert = e.certificateIssued || e.progressPercent >= 100;

              return (
                <motion.div
                  key={e._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="card overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
                      {c.thumbnail ? (
                        <img src={c.thumbnail} alt={c.title} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full grid place-items-center bg-slate-100 dark:bg-slate-800 text-slate-400">
                          <BookOpen className="h-8 w-8" />
                        </div>
                      )}

                      {/* Progress/Cert overlay badge */}
                      <span className={`absolute top-2.5 right-2.5 badge text-xs font-bold ${
                        hasCert
                          ? "bg-amber-500 text-white shadow-sm"
                          : "bg-white/90 text-slate-700 dark:bg-slate-900/90 dark:text-slate-200"
                      }`}>
                        {hasCert ? (
                          <span className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {am ? "ሲርቲፊኬት ተሰጥቷል" : "Certified ✓"}
                          </span>
                        ) : (
                          `${e.progressPercent || 0}%`
                        )}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="font-semibold line-clamp-2 text-sm">{c.title}</h3>
                      <div className="mt-3">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                          <span>{t("dashboard.progress")}</span>
                          <span className="font-semibold">{e.progressPercent || 0}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${e.progressPercent || 0}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className={`h-full rounded-full ${
                              hasCert
                                ? "bg-gradient-to-r from-amber-400 to-amber-600"
                                : "bg-gradient-to-r from-brand-500 to-brand-700"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 space-y-2">
                    {hasCert && (
                      <Button
                        type="button"
                        onClick={() => openCert(e)}
                        className="w-full gap-1.5 bg-amber-600 hover:bg-amber-700 text-white !text-xs !py-2"
                        size="sm"
                      >
                        <Award className="h-3.5 w-3.5" />
                        {am ? "ሲርቲፊኬት ይመልከቱ / አትሙ" : "View / Print Certificate"}
                      </Button>
                    )}
                    <Button
                      as={Link}
                      to={`/learn/${c.slug}`}
                      className="w-full !text-xs !py-2"
                      size="sm"
                      variant={hasCert ? "outline" : "primary"}
                    >
                      {hasCert ? (am ? "ትምህርቱን ከልስ" : "Review Course") : t("dashboard.continue")}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
