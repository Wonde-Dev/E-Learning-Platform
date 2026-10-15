import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  outline: "btn-outline",
  ghost: "btn-ghost",
  danger:
    "btn bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/60",
};

const sizes = {
  sm: "!px-3 !py-1.5 !text-xs",
  md: "",
  lg: "!px-6 !py-3 !text-base",
  icon: "!p-2.5",
};

export const Button = forwardRef(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";