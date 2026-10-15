import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Users, PlayCircle } from "lucide-react";
import { formatDuration, formatNumber, formatPrice, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";

export const CourseCard = ({ course, index = 0 }) => {
  const price = course.discountPrice > 0 ? course.discountPrice : course.price;
  const instructor = course.instructor
    ? `${course.instructor.firstName} ${course.instructor.lastName}`
    : "Instructor";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/courses/${course.slug}`} className="block group">
        <div className="card overflow-hidden">
          <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
            {course.thumbnail ? (
              <img
                src={course.thumbnail}
                alt={course.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="grid place-items-center h-full text-slate-400">
                <PlayCircle className="h-12 w-12" />
              </div>
            )}
            {course.discountPrice > 0 && (
              <Badge tone="danger" className="absolute left-3 top-3">
                Sale
              </Badge>
            )}
          </div>

          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              {course.category?.name && (
                <Badge tone="brand">{course.category.name}</Badge>
              )}
              <Badge>{course.level}</Badge>
            </div>

            <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-brand-600 transition">
              {course.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              By {instructor}
            </p>

            {course.stats?.averageRating > 0 && (
              <div className="mt-3">
                <Rating value={course.stats.averageRating} />
                <span className="ml-2 text-xs text-slate-500">
                  ({formatNumber(course.stats.totalReviews)})
                </span>
              </div>
            )}

            <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {formatDuration(course.stats?.totalDuration || 0)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {formatNumber(course.stats?.totalStudents || 0)}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {price === 0 ? (
                <span className="text-lg font-bold text-green-600">Free</span>
              ) : (
                <>
                  <span className="text-lg font-bold">
                    {formatPrice(price, course.currency)}
                  </span>
                  {course.discountPrice > 0 && (
                    <span className="text-sm text-slate-400 line-through">
                      {formatPrice(course.price, course.currency)}
                    </span>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};