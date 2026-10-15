import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  ChevronDown,
  Clock,
  FileText,
} from "lucide-react";
import { useCourse } from "@/hooks/useCourses";
import { useEnroll, useUpdateProgress, useMyEnrollments } from "@/hooks/useEnrollments";
import { useAuth } from "@clerk/clerk-react";
import { formatDuration, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { Spinner } from "@/components/ui/Spinner";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { LessonList } from "@/components/player/LessonList";
import { ProgressBar } from "@/components/player/ProgressBar";

export default function Learn() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const { data: course, isLoading } = useCourse(slug);
  const { data: enrollments = [] } = useMyEnrollments();
  const updateProgress = useUpdateProgress(slug);

  const enrollment = enrollments.find(
    (e) => e.course?.slug === slug || e.course?._id === course?._id
  );

  const [activeLesson, setActiveLesson] = useState(null);
  const [completed, setCompleted] = useState(new Set());

  useEffect(() => {
    if (!course) return;
    const first = course.sections?.[0]?.lessons?.[0];
    if (first) setActiveLesson(first);
  }, [course]);

  useEffect(() => {
    if (enrollment?.completedLessons) {
      setCompleted(new Set(enrollment.completedLessons.map(String)));
    }
  }, [enrollment]);

  if (isLoading)
    return (
      <section className="container py-10 space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="aspect-video w-full" />
      </section>
    );

  if (!course) return null;

  if (!enrollment) {
    return (
      <section className="container py-16 text-center">
        <p className="text-slate-500 mb-4">You are not enrolled in this course.</p>
        <Button as={Link} to={`/courses/${course.slug}`}>
          Enroll to continue
        </Button>
      </section>
    );
  }

  const allLessons = course.sections?.flatMap((s) => s.lessons || []) || [];
  const total = allLessons.length;
  const doneCount = completed.size;
  const progressPercent = total ? Math.round((doneCount / total) * 100) : 0;

  const toggleComplete = async (lesson) => {
    const next = !completed.has(String(lesson._id));
    const newSet = new Set(completed);
    if (next) newSet.add(String(lesson._id));
    else newSet.delete(String(lesson._id));
    setCompleted(newSet);
    try {
      await updateProgress.mutateAsync({
        lessonId: lesson._id,
        completed: next,
      });
    } catch {
      // revert on failure
      setCompleted(completed);
    }
  };

  return (
    <section className="container py-6">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <Link to="/dashboard" className="text-sm text-brand-600 hover:underline">
            ← Back to dashboard
          </Link>
          <h1 className="mt-1 text-xl font-bold">{course.title}</h1>
        </div>
        <div className="text-sm text-slate-500">
          Progress {progressPercent}%
        </div>
      </div>

      <ProgressBar value={progressPercent} className="mb-6" />

      <div className="grid gap-6 lg:grid-cols-[1.6fr,1fr]">
        <div className="space-y-4">
          <VideoPlayer
            url={activeLesson?.videoUrl}
            title={activeLesson?.title}
          />
          <div>
            <h2 className="text-lg font-semibold">
              {activeLesson?.title || "Select a lesson"}
            </h2>
            {activeLesson && (
              <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {formatDuration(activeLesson.duration || 0)}
                </span>
                <Button
                  size="sm"
                  variant={completed.has(String(activeLesson._id)) ? "outline" : "primary"}
                  onClick={() => toggleComplete(activeLesson)}
                  disabled={updateProgress.isPending}
                >
                  {updateProgress.isPending ? (
                    <Spinner className="h-4 w-4" />
                  ) : completed.has(String(activeLesson._id)) ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <PlayCircle className="h-4 w-4" />
                  )}
                  {completed.has(String(activeLesson._id)) ? "Done" : "Mark complete"}
                </Button>
              </div>
            )}
          </div>
        </div>

        <aside className="card overflow-hidden">
          <div className="p-4 border-b border-slate-200/70 dark:border-slate-800">
            <h3 className="font-semibold">Course content</h3>
            <p className="text-xs text-slate-500">
              {doneCount} of {total} lessons completed
            </p>
          </div>
          <LessonList
            sections={course.sections}
            activeId={activeLesson?._id}
            completed={completed}
            onSelect={setActiveLesson}
            isEnrolled
          />
        </aside>
      </div>
    </section>
  );
}