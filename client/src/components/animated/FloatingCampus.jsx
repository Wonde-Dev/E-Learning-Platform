import { motion } from "framer-motion";
import { BookOpen, GraduationCap, Laptop, Code, Users } from "lucide-react";

/**
 * Decorative floating elements that animate like a campus scene.
 * Purely visual — no user interaction.
 */
const FloatingElements = () => (
  <>
    {/* Background campus silhouette */}
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Animated buildings (school silhouette) */}
      <div className="absolute bottom-0 left-0 right-0 h-24">
        <div className="absolute bottom-0 left-4 h-14 w-8 bg-slate-200 dark:bg-slate-800 rounded-t-sm" />
        <div className="absolute bottom-0 left-14 h-18 w-10 bg-slate-200 dark:bg-slate-800 rounded-t-sm" />
        <div className="absolute bottom-0 left-28 h-10 w-8 bg-slate-200 dark:bg-slate-800 rounded-t-sm" />
        <div className="absolute bottom-0 left-40 h-16 w-10 bg-slate-200 dark:bg-slate-800 rounded-t-sm" />
        <div className="absolute bottom-0 left-54 h-12 w-8 bg-slate-200 dark:bg-slate-800 rounded-t-sm" />
        <div className="absolute bottom-0 left-66 h-20 w-12 bg-slate-200 dark:bg-slate-800 rounded-t-sm" />
        <div className="absolute bottom-0 left-80 h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-t-sm" />
        <div className="absolute bottom-0 left-92 h-16 w-10 bg-slate-200 dark:bg-slate-800 rounded-t-sm" />
      </div>

      {/* Floating icons (books, caps, etc.) */}
      {[
        { Icon: BookOpen, x: "left-1/4", y: "top-1/3", delay: 0 },
        { Icon: GraduationCap, x: "right-1/4", y: "top-1/4", delay: 0.5 },
        { Icon: Laptop, x: "left-1/3", y: "top-1/2", delay: 1 },
        { Icon: Code, x: "right-1/3", y: "top-1/3", delay: 0.3 },
        { Icon: Users, x: "right-1/2", y: "top-1/2", delay: 0.8 },
      ].map(({ Icon, x, y, delay }) => (
        <motion.div
          key={Icon.name}
          className={`absolute ${x} ${y} text-brand-300 dark:text-brand-600/30`}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: [-10, 10, -10], opacity: [0, 0.3, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay, ease: "easeInOut" }}
        >
          <Icon className="h-6 w-6" />
        </motion.div>
      ))}

      {/* Dotted ground line */}
      <div className="absolute bottom-24 left-0 right-0 h-px">
        <div className="flex h-full w-full justify-between">
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 rounded-full bg-brand-400/20 dark:bg-brand-600/20"
              initial={{ opacity: 0.2 }}
              animate={{ opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
        </div>
      </div>
    </div>
  </>
);

export default FloatingElements;
