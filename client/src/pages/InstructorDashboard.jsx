import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Plus,
  BookOpen,
  Users,
  TrendingUp,
  Settings,
  Eye,
  Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";
import { useMyCourses } from "@/hooks/useCourses";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/dashboard/StatCard";
import { formatDuration, formatNumber, formatPrice } from "@/lib/utils";

export default function InstructorDashboard() {
  const { t } = useTranslation();
  const { data: user, isLoading: userLoading } = useUser();
  const { data, isLoading: coursesLoading } = useMyCourses();
  const courses = data?.items || [];

  const totalStudents = courses.reduce(
    (a, c) => a + (c.stats?.totalStudents || 0),
    0
  );
  const totalLessons = courses.reduce(
    (a, c) => a + (c.stats?.totalLessons || 0),
    0
  );
  const totalRevenue = courses.reduce(
    (a, c) => a + (c.stats?.totalStudents || 0) * (c.effectivePrice || 0),
    0
  );

  return (
    <section className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display">
            {t("instructor.title")}
          </h1>
          <p className="mt-2 text-slate-500">
            {t("instructor.subtitle")}
          </p>
        </div>
        <Button as={Link} to="/courses/create">
          <Plus className="h-4 w-4" /> {t("instructor.newCourse")}
        </Button>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        <StatCard icon={BookOpen} label={t("instructor.stats.courses")} value={courses.length} />
        <StatCard icon={Users} label={t("instructor.stats.students")} value={formatNumber(totalStudents)} />
        <StatCard icon={TrendingUp} label={t("instructor.stats.lessons")} value={totalLessons} />
        <StatCard
          icon={GraduationCap}
          label={t("instructor.stats.revenue")}
          value={formatPrice(totalRevenue)}
        />
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold">{t("instructor.yourCourses")}</h2>
        <Link to="/courses" className="text-sm text-brand-600 hover:underline">
          Browse public catalog
        </Link>
      </div>

      {coursesLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      ) : !courses.length ? (
        <EmptyState
          icon={BookOpen}
          title={t("instructor.empty.title")}
          description={t("instructor.empty.description")}
          action={
            <Button as={Link} to="/courses/create">
              <Plus className="h-4 w-4" /> {t("instructor.empty.action")}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <motion.div
              key={c._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="card overflow-hidden"
            >
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
                {c.thumbnail ? (
                  <img
                    src={c.thumbnail}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid place-items-center h-full text-slate-400">
                    <BookOpen className="h-10 w-10" />
                  </div>
                )}
                <span
                  className={`absolute top-3 left-3 badge ${
                    c.status === "published"
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {c.status}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-semibold line-clamp-2">{c.title}</h3>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {formatNumber(c.stats?.totalStudents || 0)}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatDuration(c.stats?.totalDuration || 0)}
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {formatPrice(c.effectivePrice || 0, c.currency)}
                  </span>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button as={Link} to={`/courses/${c.slug}`} variant="outline" size="sm" className="flex-1">
                    <Eye className="h-3.5 w-3.5" /> {t("instructor.view")}
                  </Button>
                  <Button as={Link} to={`/instructor/courses/${c._id}/edit`} size="sm" className="flex-1">
                    <Settings className="h-3.5 w-3.5" /> {t("instructor.edit")}
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}