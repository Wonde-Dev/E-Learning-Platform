import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import {
  Clock, Users, Star, PlayCircle, CheckCircle2, Globe, BarChart3,
} from "lucide-react";
import { useCourse } from "@/hooks/useCourses";
import { useEnroll, useMyEnrollments } from "@/hooks/useEnrollments";
import { formatDuration, formatNumber, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Rating } from "@/components/ui/Rating";
import { Curriculum } from "@/components/course/Curriculum";
import { ReviewSection } from "@/components/course/ReviewSection";

export default function CourseDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { data: course, isLoading } = useCourse(slug);
  const { data: enrollments = [] } = useMyEnrollments();
  const enroll = useEnroll();

  const isEnrolled = enrollments.some(
    (e) => e.course?._id === course?._id || e.course?.slug === course?.slug
  );

  if (isLoading)
    return (
      <section className="container py-10 space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="aspect-video w-full" />
      </section>
    );

  if (!course) return null;

  const price = course.discountPrice > 0 ? course.discountPrice : course.price;
  const instructor = course.instructor
    ? `${course.instructor.firstName} ${course.instructor.lastName}`
    : "";

  const handleEnroll = async () => {
    if (!isSignedIn) return navigate("/");
    await enroll.mutateAsync(course._id);
    navigate(`/learn/${course.slug}`);
  };

  return (
    <article className="pb-16">
      <div className="bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container py-12 grid gap-10 lg:grid-cols-[1fr,380px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-2 mb-3">
              {course.category?.name && (
                <Link to={`/courses?category=${course.category._id}`}>
                  <Badge tone="brand">{course.category.name}</Badge>
                </Link>
              )}
              <Badge>{course.level}</Badge>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight">
              {course.title}
            </h1>
            {course.subtitle && (
              <p className="mt-4 text-lg text-slate-300">{course.subtitle}</p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-5 text-sm">
              {course.stats.averageRating > 0 && (
                <span className="inline-flex items-center gap-1.5">
                  <Rating value={course.stats.averageRating} showValue={false} />
                  <span className="font-semibold">
                    {course.stats.averageRating.toFixed(1)}
                  </span>
                  <span className="text-slate-400">
                    ({formatNumber(course.stats.totalReviews)} reviews)
                  </span>
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Users className="h-4 w-4" />
                {formatNumber(course.stats.totalStudents)} students
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Clock className="h-4 w-4" />
                {formatDuration(course.stats.totalDuration)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-slate-300">
                <Globe className="h-4 w-4" /> {course.language}
              </span>
            </div>

            <p className="mt-6 text-sm text-slate-300">
              Created by <span className="text-white font-semibold">{instructor}</span>
            </p>
          </motion.div>

          {/* Sticky buy-box */}
          <motion.aside
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:sticky lg:top-20 h-fit card overflow-hidden !bg-white !text-slate-900 dark:!bg-slate-900 dark:!text-slate-100"
          >
            <div className="aspect-video bg-slate-200 dark:bg-slate-800 relative">
              {course.thumbnail && (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 grid place-items-center bg-black/30">
                <PlayCircle className="h-14 w-14 text-white/90" />
              </div>
            </div>

            <div className="p-6">
              {price === 0 ? (
                <p className="text-3xl font-extrabold text-green-600">Free</p>
              ) : (
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-extrabold">
                    {formatPrice(price, course.currency)}
                  </p>
                  {course.discountPrice > 0 && (
                    <span className="text-slate-400 line-through text-lg">
                      {formatPrice(course.price, course.currency)}
                    </span>
                  )}
                </div>
              )}

              {isEnrolled ? (
                <Button
                  className="w-full mt-4"
                  onClick={() => navigate(`/learn/${course.slug}`)}
                >
                  Continue learning
                </Button>
              ) : (
                <Button
                  className="w-full mt-4"
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enroll.isPending}
                >
                  {enroll.isPending ? "Enrolling…" : price === 0 ? "Enroll for free" : "Enroll now"}
                </Button>
              )}

              <ul className="mt-5 space-y-2 text-sm">
                {[
                  `${course.stats.totalLessons} lessons`,
                  `${formatDuration(course.stats.totalDuration)} on-demand video`,
                  "Certificate of completion",
                  "Lifetime access",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.aside>
        </div>
      </div>

      <div className="container py-12 grid gap-10 lg:grid-cols-[1fr,380px]">
        <div className="space-y-12">
          {course.whatYouWillLearn?.length > 0 && (
            <section className="card p-6">
              <h2 className="text-xl font-bold mb-4">What you'll learn</h2>
              <ul className="grid sm:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {course.description && (
            <section>
              <h2 className="text-xl font-bold mb-3">Description</h2>
              <p className="text-slate-600 dark:text-slate-300 whitespace-pre-line">
                {course.description}
              </p>
            </section>
          )}

          <section>
            <h2 className="text-xl font-bold mb-5">Course content</h2>
            <Curriculum sections={course.sections} isEnrolled={isEnrolled} />
          </section>

          <ReviewSection courseId={course._id} isEnrolled={isEnrolled} />
        </div>

        <aside className="hidden lg:block space-y-6">
          {course.requirements?.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold mb-3">Requirements</h3>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                {course.requirements.map((r, i) => (
                  <li key={i}>• {r}</li>
                ))}
              </ul>
            </div>
          )}

          {course.instructor && (
            <div className="card p-5">
              <h3 className="font-semibold mb-3">Instructor</h3>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-500/10 grid place-items-center overflow-hidden">
                  {course.instructor.imageUrl ? (
                    <img src={course.instructor.imageUrl} className="h-full w-full object-cover" alt="" />
                  ) : (
                    <span className="font-semibold text-brand-700 dark:text-brand-300">
                      {course.instructor.firstName?.[0]}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-medium">{instructor}</p>
                  <p className="text-xs text-slate-500">
                    {course.instructor.headline}
                  </p>
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </article>
  );
}