import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/player/ProgressBar";

/**
 * Props: enrollment (with .course and .progressPercent)
 */
export const EnrolledCourseCard = ({ enrollment, index = 0 }) => {
  const c = enrollment?.course;
  if (!c) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="card overflow-hidden"
    >
      <div className="aspect-video bg-slate-100 dark:bg-slate-800 relative">
        {c.thumbnail ? (
          <img src={c.thumbnail} alt="" className="h-full w-full object-cover" />
        ) : null}
      </div>
      <div className="p-4">
        <h3 className="font-semibold line-clamp-2">{c.title}</h3>
        <div className="mt-3">
          <ProgressBar
            value={enrollment.progressPercent}
            showLabel
            label="Progress"
          />
        </div>
        <Button
          as={Link}
          to={`/learn/${c.slug}`}
          className="w-full mt-4"
          size="sm"
        >
          {enrollment.progressPercent >= 100 ? "Review" : "Continue"}
        </Button>
      </div>
    </motion.div>
  );
};