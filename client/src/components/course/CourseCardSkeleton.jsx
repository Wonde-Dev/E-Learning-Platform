import { Skeleton } from "@/components/ui/Skeleton";

export const CourseCardSkeleton = () => (
  <div className="card overflow-hidden">
    <Skeleton className="aspect-video w-full !rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-20" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-6 w-24" />
    </div>
  </div>
);