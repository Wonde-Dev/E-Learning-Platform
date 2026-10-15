import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, PlayCircle, FileText, Lock } from "lucide-react";
import { formatDuration, cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

export const Curriculum = ({ sections = [], isEnrolled = false, onSelectLesson }) => {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {sections.map((section, si) => {
        const totalSec = section.lessons.reduce((a, l) => a + (l.duration || 0), 0);
        const isOpen = open === si;
        return (
          <div key={section._id || si} className="card overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? -1 : si)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition text-left"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">
                    {si + 1}. {section.title}
                  </h3>
                </div>
                <p className="mt-1 text-xs text-slate-500">
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
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-t border-slate-200/70 dark:border-slate-800"
                >
                  <ul>
                    {section.lessons.map((lesson, li) => {
                      const locked = !isEnrolled && !lesson.isPreview;
                      return (
                        <li
                          key={lesson._id || li}
                          className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                          onClick={() => !locked && onSelectLesson?.(lesson)}
                        >
                          {locked ? (
                            <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                          ) : (
                            <PlayCircle className="h-4 w-4 text-brand-600 shrink-0" />
                          )}
                          <span className="flex-1 truncate">{lesson.title}</span>
                          {lesson.isPreview && !isEnrolled && (
                            <Badge tone="brand">Preview</Badge>
                          )}
                          <span className="text-xs text-slate-500">
                            {formatDuration(lesson.duration || 0)}
                          </span>
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