import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X, BookOpen, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CourseGrid } from "@/components/course/CourseGrid";
import { useCourses } from "@/hooks/useCourses";
import { useDebounce } from "@/hooks/useDebounce";

const LEVELS   = ["beginner", "intermediate", "advanced"];
const PRICES   = ["free", "paid"];
const SORTS    = ["newest", "popular", "priceLowHigh", "priceHighLow"];
const SORT_MAP = { newest: "-createdAt", popular: "-stats.totalStudents", priceLowHigh: "price", priceHighLow: "-price" };

export default function Courses() {
  const { t, i18n } = useTranslation();
  const am = i18n.language === "am";

  const [filters, setFilters] = useState({ q: "", level: "", price: "", sort: "newest", page: 1 });
  const [showFilters, setShowFilters] = useState(false);
  const dq = useDebounce(filters.q, 380);

  const query = { q: dq, level: filters.level, price: filters.price, sort: SORT_MAP[filters.sort] || "-createdAt", page: filters.page, limit: 12 };
  const { data, isLoading, isFetching } = useCourses(query);
  const courses    = data?.items || [];
  const pagination = data?.pagination;
  const total      = pagination?.total ?? 0;

  const set = (key, val) => setFilters((f) => ({ ...f, [key]: val, page: 1 }));
  const clearAll = () => setFilters({ q: "", level: "", price: "", sort: "newest", page: 1 });
  const hasFilters = filters.q || filters.level || filters.price || filters.sort !== "newest";

  const levelLabel  = { beginner: am ? "ጀማሪ" : "Beginner", intermediate: am ? "መካከለኛ" : "Intermediate", advanced: am ? "ከፍተኛ" : "Advanced" };
  const priceLabel  = { free: am ? "ነፃ" : "Free", paid: am ? "የሚከፈልበት" : "Paid" };
  const sortLabel   = { newest: am ? "አዲሱ" : "Newest", popular: am ? "ታዋቂ" : "Most popular", priceLowHigh: am ? "ዋጋ ↑" : "Price ↑", priceHighLow: am ? "ዋጋ ↓" : "Price ↓" };

  return (
    <div className="min-h-screen">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-b from-brand-50 to-white dark:from-brand-950/20 dark:to-slate-950 py-14">
        <div className="container max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 mb-3 inline-flex">
              <Sparkles className="h-3.5 w-3.5" />
              {am ? "ሁሉም ትምህርቶች" : "All Courses"}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold font-display tracking-tight">
              {t("courses.title")}
            </h1>
            <p className="mt-3 text-slate-500 dark:text-slate-400 text-lg">
              {t("courses.subtitle")}
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 relative max-w-2xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              className="input !pl-12 !pr-12 !h-14 !text-base shadow-soft"
              placeholder={t("courses.filters.searchPlaceholder")}
              value={filters.q}
              onChange={(e) => set("q", e.target.value)}
            />
            {filters.q && (
              <button
                onClick={() => set("q", "")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="container py-10">
        {/* ── Toolbar ──────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Results count */}
          <p className="text-sm text-slate-500 dark:text-slate-400 mr-auto">
            {isLoading ? "…" : t("courses.totalCourses", { count: total })}
          </p>

          {/* Level pills */}
          <div className="hidden sm:flex gap-1.5">
            {LEVELS.map((lv) => (
              <button
                key={lv}
                onClick={() => set("level", filters.level === lv ? "" : lv)}
                className={`badge cursor-pointer transition text-xs font-medium ${
                  filters.level === lv
                    ? "bg-brand-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-50 dark:hover:bg-brand-500/10 hover:text-brand-700"
                }`}
              >
                {levelLabel[lv]}
              </button>
            ))}
          </div>

          {/* Price pills */}
          <div className="hidden sm:flex gap-1.5">
            {PRICES.map((p) => (
              <button
                key={p}
                onClick={() => set("price", filters.price === p ? "" : p)}
                className={`badge cursor-pointer transition text-xs font-medium ${
                  filters.price === p
                    ? "bg-green-600 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-700"
                }`}
              >
                {priceLabel[p]}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            className="input !w-auto !h-8 !py-0 !text-xs !pr-8 cursor-pointer"
            value={filters.sort}
            onChange={(e) => set("sort", e.target.value)}
          >
            {SORTS.map((s) => (
              <option key={s} value={s}>{sortLabel[s]}</option>
            ))}
          </select>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`sm:hidden btn-outline !h-8 !px-3 !text-xs gap-1.5 ${showFilters ? "bg-brand-50 border-brand-300 text-brand-700" : ""}`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            {am ? "ማጣሪያ" : "Filters"}
          </button>

          {/* Clear */}
          {hasFilters && (
            <button onClick={clearAll} className="btn-ghost !h-8 !px-3 !text-xs gap-1 text-slate-500 hover:text-red-500">
              <X className="h-3.5 w-3.5" /> {t("common.clear")}
            </button>
          )}
        </div>

        {/* Mobile filters drawer */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-5"
            >
              <div className="card p-4 flex flex-wrap gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{am ? "ደረጃ" : "Level"}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {LEVELS.map((lv) => (
                      <button key={lv} onClick={() => set("level", filters.level === lv ? "" : lv)}
                        className={`badge cursor-pointer text-xs font-medium transition ${filters.level === lv ? "bg-brand-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
                        {levelLabel[lv]}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-2">{am ? "ዋጋ" : "Price"}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {PRICES.map((p) => (
                      <button key={p} onClick={() => set("price", filters.price === p ? "" : p)}
                        className={`badge cursor-pointer text-xs font-medium transition ${filters.price === p ? "bg-green-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"}`}>
                        {priceLabel[p]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active filter chips */}
        {(filters.level || filters.price) && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filters.level && (
              <span className="badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 gap-1.5">
                {levelLabel[filters.level]}
                <button onClick={() => set("level", "")}><X className="h-3 w-3" /></button>
              </span>
            )}
            {filters.price && (
              <span className="badge bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 gap-1.5">
                {priceLabel[filters.price]}
                <button onClick={() => set("price", "")}><X className="h-3 w-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* ── Course Grid ───────────────────────────────────────────────── */}
        {!isLoading && courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24 text-center"
          >
            <BookOpen className="h-14 w-14 text-slate-200 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">{t("courses.empty.title")}</h3>
            <p className="text-slate-500 dark:text-slate-400">{t("courses.empty.description")}</p>
            {hasFilters && (
              <button onClick={clearAll} className="btn-outline mt-5">
                {t("common.clear")} {am ? "ሁሉንም ማጣሪያዎች" : "all filters"}
              </button>
            )}
          </motion.div>
        ) : (
          <CourseGrid courses={courses} isLoading={isLoading} />
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-1.5">
            {Array.from({ length: pagination.pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setFilters((f) => ({ ...f, page: i + 1 }))}
                className={`h-9 w-9 rounded-xl text-sm font-medium transition ${
                  filters.page === i + 1
                    ? "bg-brand-600 text-white shadow-soft"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Updating indicator */}
      <AnimatePresence>
        {isFetching && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-6 right-6 text-xs bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 rounded-full shadow-soft px-4 py-2 border border-slate-200 dark:border-slate-700"
          >
            {am ? "በማዘምን..." : "Updating…"}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
