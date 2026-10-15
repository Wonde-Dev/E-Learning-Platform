import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Props: icon (Lucide icon), label, value, tone?
 */
export const StatCard = ({ icon: Icon, label, value, tone = "brand" }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="card p-5"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="mt-1.5 text-2xl font-bold">{value}</p>
      </div>
      <div
        className={cn(
          "grid h-11 w-11 place-items-center rounded-xl",
          tone === "brand"
            ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300"
            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </motion.div>
);