import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";

const LEVELS = ["", "beginner", "intermediate", "advanced", "all-levels"];
const PRICES = [
  { value: "", label: "All" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];

export const CourseFilters = ({ filters, onChange }) => {
  const set = (patch) => onChange({ ...filters, ...patch, page: 1 });

  return (
    <div className="space-y-4 mb-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          className="!pl-10"
          placeholder="Search courses…"
          value={filters.q || ""}
          onChange={(e) => set({ q: e.target.value })}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {LEVELS.map((l) => (
          <button
            key={l || "all"}
            onClick={() => set({ level: l })}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium border transition",
              (filters.level || "") === l
                ? "bg-brand-600 text-white border-brand-600"
                : "border-slate-200 dark:border-slate-700 hover:border-brand-500"
            )}
          >
            {l || "All levels"}
          </button>
        ))}

        <div className="ml-auto flex gap-2">
          {PRICES.map((p) => (
            <button
              key={p.value || "all"}
              onClick={() => set({ price: p.value })}
              className={cn(
                "rounded-full px-3.5 py-1.5 text-xs font-medium border transition",
                (filters.price || "") === p.value
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-900"
                  : "border-slate-200 dark:border-slate-700"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};