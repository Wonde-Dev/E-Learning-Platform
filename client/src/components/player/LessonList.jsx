import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlayCircle, Lock, CheckCircle2 } from "lucide-react";
import { formatDuration, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

/**
 * Props:
 *  sections: [{ _id, title, lessons: [{ _id, title, duration, videoUrl, isPreview }] }]
 *  activeId, completed (Set), onSelect(lesson), isEnrolled
 */
export const LessonList = ({ sections = [], activeId, completed = new Set(), onSelect, isEnrolled }) => {
  const [open, setOpen] = useState(0);

  if (!sections.length) {
    return (
      <div className="p-6 text-center text-sm text-slate-500">
        No lessons available yet.
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200/70 dark:divide-slate-800">
      {sections.map((section, si) => {
        const isOpen = open === si;
        const totalSec = section.lessons.reduce((a, l) => a + (l.duration || 0), 0);
        const doneInSec = section.lessons.filter((l) => completed.has(String(l._id))).length;
        const allDone = section.lessons.length > 0 && doneInSec === section.lessons.length;

        return (
          <div key={section._id || si}>
            <button
              onClick={() => setOpen(isOpen ? -1 : si)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition text-left"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-sm">
                    {si + 1}. {section.title}
                  </h3>
                  {allDone && (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  {section.lessons.length} lessons · {formatDuration(totalSec)}
                </p>
              </div>
              <ChevronDown
                className={cn(
                  "h-4 w-4 text-slate-500 transition-transform",
                  isOpen && "rotate-180"
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <ul>
                    {section.lessons.map((lesson, li) => {
                      const locked = !isEnrolled && !lesson.isPreview;
                      const isActive = activeId === lesson._id;
                      const isDone = completed.has(String(lesson._id));
                      return (
                        <li key={lesson._id || li}>
                          <button
                            disabled={locked}
                            onClick={() => !locked && onSelect?.(lesson)}
                            className={cn(
                              "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition text-left",
                              locked
                                ? "opacity-60 cursor-not-allowed"
                                : "hover:bg-slate-50 dark:hover:bg-slate-800/40",
                              isActive && "bg-brand-50 dark:bg-brand-500/10"
                            )}
                          >
                            {locked ? (
                              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                            ) : isDone ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                            ) : (
                              <PlayCircle className="h-4 w-4 text-brand-600 shrink-0" />
                            )}
                            <span className="flex-1 truncate">{lesson.title}</span>
                            {lesson.isPreview && !isEnrolled && (
                              <Badge tone="brand" className="text-[10px]">
                                Preview
                              </Badge>
                            )}
                            <span className="text-xs text-slate-500">
                              {formatDuration(lesson.duration || 0)}
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};