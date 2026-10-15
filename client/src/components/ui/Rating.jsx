import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export const Rating = ({ value = 0, size = "sm", showValue = true }) => {
  const sz = size === "lg" ? "h-5 w-5" : size === "md" ? "h-4 w-4" : "h-3.5 w-3.5";
  return (
    <div className="inline-flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              sz,
              i <= Math.round(value)
                ? "fill-amber-400 text-amber-400"
                : "text-slate-300 dark:text-slate-600"
            )}
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
          {value.toFixed(1)}
        </span>
      )}
    </div>
  );
};