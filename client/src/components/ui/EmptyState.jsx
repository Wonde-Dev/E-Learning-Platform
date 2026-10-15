import { motion } from "framer-motion";

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="grid place-items-center py-16 text-center"
  >
    {Icon && (
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
        <Icon className="h-7 w-7" />
      </div>
    )}
    <h3 className="mt-5 text-lg font-semibold">{title}</h3>
    {description && (
      <p className="mt-1.5 max-w-md text-sm text-slate-500 dark:text-slate-400">
        {description}
      </p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </motion.div>
);