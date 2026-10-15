import { CourseCard } from "./CourseCard";
import { CourseCardSkeleton } from "./CourseCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { BookOpen } from "lucide-react";

export const CourseGrid = ({ courses, isLoading, skeletonCount = 6 }) => {
  if (isLoading)
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <CourseCardSkeleton key={i} />
        ))}
      </div>
    );

  if (!courses?.length)
    return (
      <EmptyState
        icon={BookOpen}
        title="No courses found"
        description="Try a different filter or search term."
      />
    );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((c, i) => (
        <CourseCard key={c._id} course={c} index={i} />
      ))}
    </div>
  );
};