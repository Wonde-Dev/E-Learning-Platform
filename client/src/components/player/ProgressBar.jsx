import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Props: value (0-100), label?, className?, showLabel?
 */
export const ProgressBar = ({ value = 0, label, className, showLabel = true }) => {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between mb-1.5">
        {label && <span className="text-xs text-slate-500">{label}</span>}
        {showLabel && (
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            {Math.round(v)}%
          </span>
        )}
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${v}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-brand-500 to-brand-700"
        />
      </div>
    </div>
  );
};