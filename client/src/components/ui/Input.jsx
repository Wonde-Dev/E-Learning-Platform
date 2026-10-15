import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(({ className, error, ...props }, ref) => (
  <div className="w-full">
    <input
      ref={ref}
      className={cn(
        "input",
        error && "!border-red-500 focus:!ring-red-500/25",
        className
      )}
      {...props}
    />
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
));
Input.displayName = "Input";

export const Textarea = forwardRef(({ className, error, ...props }, ref) => (
  <div className="w-full">
    <textarea
      ref={ref}
      rows={4}
      className={cn(
        "input resize-y",
        error && "!border-red-500 focus:!ring-red-500/25",
        className
      )}
      {...props}
    />
    {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
  </div>
));
Textarea.displayName = "Textarea";