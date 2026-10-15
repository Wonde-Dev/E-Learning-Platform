import { cn } from "@/lib/utils";

export const Spinner = ({ className }) => (
  <div
    className={cn(
      "h-6 w-6 rounded-full border-2 border-brand-500 border-t-transparent animate-spin",
      className
    )}
  />
);