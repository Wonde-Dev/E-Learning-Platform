import { useAuth } from "@clerk/clerk-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star, Loader2 } from "lucide-react";
import { useState } from "react";
import { Rating } from "@/components/ui/Rating";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import { useCourseReviews, useCreateReview } from "@/hooks/useReviews";
import { formatRelativeTime, initials } from "@/lib/format";
import { cn } from "@/lib/utils";

const schema = z.object({
  rating: z.number().min(1, "Pick a rating").max(5),
  comment: z.string().max(2000).optional(),
});

export const ReviewSection = ({ courseId, isEnrolled }) => {
  const { isSignedIn } = useAuth();
  const { data: reviews = [], isLoading } = useCourseReviews(courseId);
  const createReview = useCreateReview(courseId);
  const [hover, setHover] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { rating: 0, comment: "" },
  });

  const rating = watch("rating");

  const onSubmit = async (data) => {
    await createReview.mutateAsync(data);
    reset();
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">Reviews ({reviews.length})</h2>

      {isEnrolled && isSignedIn && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="card p-5 mb-6 space-y-3"
        >
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setValue("rating", i, { shouldValidate: true })}
              >
                <Star
                  className={cn(
                    "h-6 w-6 transition",
                    (hover || rating) >= i
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-300"
                  )}
                />
              </button>
            ))}
            {errors.rating && (
              <span className="text-xs text-red-500 ml-2">
                {errors.rating.message}
              </span>
            )}
          </div>
          <Textarea
            placeholder="Share your experience…"
            {...register("comment")}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={createReview.isPending}>
              {createReview.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Submit review
            </Button>
          </div>
        </form>
      )}

      {isLoading && <p className="text-sm text-slate-500">Loading reviews…</p>}

      <ul className="space-y-4">
        {reviews.map((r) => (
          <li key={r._id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-semibold text-sm shrink-0">
                {r.user?.imageUrl ? (
                  <img
                    src={r.user.imageUrl}
                    alt=""
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  initials(r.user?.firstName, r.user?.lastName)
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-sm">
                    {r.user?.firstName} {r.user?.lastName}
                  </p>
                  <span className="text-xs text-slate-500">
                    {formatRelativeTime(r.createdAt)}
                  </span>
                </div>
                <div className="mt-1">
                  <Rating value={r.rating} showValue={false} />
                </div>
                {r.comment && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {r.comment}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};