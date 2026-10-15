import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { coursesApi } from "@/services/courses.service";
import { qk } from "@/lib/queryKeys";
import { CourseCard } from "@/components/course/CourseCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookOpen } from "lucide-react";

/**
 * FeaturedCourses — fetches tech-related courses and displays them with a header.
 * Props:
 *  title        — section heading
 *  subtitle     — section subheading
 *  filters      — query params (e.g. { q: "react", category: "..." })
 *  limit        — number of courses to show (default 4)
 */
export const FeaturedCourses = ({
  title = "Featured courses",
  subtitle = "Popular tech courses handpicked for you",
  filters = { q: "react", sort: "-createdAt", limit: 8 },
  limit = 4,
}) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: qk.courses({ ...filters, limit: limit + 4 }),
    queryFn: () =>
      coursesApi.list({ ...filters, limit: limit + 4 }),
    staleTime: 1000 * 60 * 2,
  });

  const courses = data?.items?.slice(0, limit) || [];

  return (
    <section className="py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex items-end justify-between"
      >
        <div>
          <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">
            <Sparkles className="h-3.5 w-3.5" /> Trending
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold font-display">
            {title}
          </h2>
          <p className="mt-2 text-slate-500 dark:text-slate-400">{subtitle}</p>
        </div>
        <Link to="/courses" className="btn-ghost">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: limit }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={BookOpen}
          title="Unable to load courses"
          description="Something went wrong. Try again later."
        />
      ) : !courses.length ? (
        <EmptyState
          icon={BookOpen}
          title="No featured courses yet"
          description="We're working on adding more courses. Check back soon!"
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.08, delayChildren: 0.1 },
            },
          }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {courses.map((c, i) => (
            <motion.div
              key={c._id}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
            >
              <CourseCard course={c} index={i} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
};
