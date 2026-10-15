import { cn } from "@/lib/utils";

const tones = {
  brand: "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300",
  slate:
    "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  success: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-300",
  warning:
    "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  danger: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

export const Badge = ({ tone = "brand", className, ...props }) => (
  <span
    className={cn(
      "badge",
      tones[tone] || tones.brand,
      className
    )}
    {...props}
  />
);