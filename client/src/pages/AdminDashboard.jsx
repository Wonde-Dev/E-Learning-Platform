import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, BookOpen, DollarSign, Shield, AlertCircle,
  BarChart2, Activity, UserCheck, GraduationCap,
  ChevronRight, Plus, X, Image, Loader2, FileText,
  Eye, Search, TrendingUp, CheckCircle2,
  Globe, Lock, ArrowLeft, ArrowRight, Home,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { uploadsApi } from "@/services/uploads.service";
import { coursesApi } from "@/services/courses.service";
import { formatPrice } from "@/lib/utils";

// ─── ProgressBar ─────────────────────────────────────────────────────────────
function ProgressBar({ value }) {
  return (
    <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.25 }}
        className="h-full bg-brand-500 rounded-full"
      />
    </div>
  );
}

// ─── DropZone ────────────────────────────────────────────────────────────────
function DropZone({ accept, label, hint, icon: Icon, preview, uploading, progress, onChange, onClear }) {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  const isImage = typeof preview === "string" && (preview.startsWith("blob:") || preview.startsWith("http") || preview.startsWith("data:image"));

  return (
    <div
      onClick={() => !uploading && ref.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) onChange(f); }}
      className={`relative group flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed transition cursor-pointer overflow-hidden
        ${drag ? "border-brand-400 bg-brand-50/50 dark:bg-brand-500/5" : "border-slate-200 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500"}
        ${preview ? "h-40" : "h-32"}`}
    >
      {preview ? (
        <>
          {isImage
            ? <img src={preview} alt="" className="absolute inset-0 w-full h-full object-cover" />
            : <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-800/60">
                <FileText className="h-9 w-9 text-brand-500 mb-2" />
                <p className="text-sm font-medium truncate max-w-[85%] px-3">{preview}</p>
              </div>
          }
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <button type="button" onClick={(e) => { e.stopPropagation(); ref.current?.click(); }}
              className="text-white text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg">Change</button>
            {onClear && <button type="button" onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="text-white text-xs font-semibold bg-red-500/80 hover:bg-red-600/80 px-3 py-1.5 rounded-lg">Remove</button>}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500 pointer-events-none p-4">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800">
            {uploading ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : <Icon className="h-5 w-5" />}
          </div>
          <span className="text-sm font-medium text-center">{label}</span>
          <span className="text-xs text-center">{hint}</span>
        </div>
      )}
      {uploading && <div className="absolute bottom-0 left-0 right-0 px-2 pb-2"><ProgressBar value={progress} /></div>}
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onChange(f); e.target.value = ""; }} />
    </div>
  );
}

// ─── StepDots ────────────────────────────────────────────────────────────────
function StepDots({ total, current }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1.5 rounded-full transition-all ${
          i === current ? "w-6 bg-brand-600" : i < current ? "w-2.5 bg-brand-300" : "w-2.5 bg-slate-200 dark:bg-slate-700"}`} />
      ))}
    </div>
  );
}

// ─── LessonRow — extracted component so hooks aren't inside .map() ────────────
function LessonRow({ si, li, les, am, updateLesson, removeLesson, handleLessonVideo, sectionLessonsCount }) {
  const videoRef = useRef(null);
  return (
    <div className="p-3 space-y-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
        <span className="text-xs text-slate-400 shrink-0 w-14">{am ? `ትምህርት ${li + 1}` : `Lesson ${li + 1}`}</span>
        <input className="input !h-8 !py-0 !text-sm flex-1 min-w-0"
          value={les.title} onChange={(e) => updateLesson(si, li, "title", e.target.value)}
          placeholder={am ? "ትምህርቱ ርዕስ" : "Lesson title"} />
        <label className="flex items-center gap-1 text-xs text-slate-500 cursor-pointer shrink-0">
          <input type="checkbox" checked={les.isPreview} onChange={(e) => updateLesson(si, li, "isPreview", e.target.checked)} className="rounded" />
          {am ? "ቅድሚያ" : "Preview"}
        </label>
        {sectionLessonsCount > 1 && (
          <button onClick={() => removeLesson(si, li)} className="btn-ghost !p-1 text-red-400 shrink-0">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      {les.videoUrl ? (
        <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-green-50 dark:bg-green-500/10">
          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
          <span className="text-xs text-green-700 dark:text-green-300 flex-1 truncate">
            {am ? "ቪዲዮ ተጭኗል" : "Video uploaded"}{les.duration > 0 ? ` · ${Math.round(les.duration / 60)}min` : ""}
          </span>
          <button onClick={() => updateLesson(si, li, "videoUrl", "")} className="text-xs text-red-500 hover:underline shrink-0">
            {am ? "አስወግድ" : "Remove"}
          </button>
        </div>
      ) : (
        <>
          <input ref={videoRef} type="file" accept="video/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleLessonVideo(si, li, f); e.target.value = ""; }} />
          {les.uploading ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700">
              <Loader2 className="h-4 w-4 animate-spin text-brand-500 shrink-0" />
              <div className="flex-1"><ProgressBar value={les.progress} /></div>
              <span className="text-xs text-slate-500">{les.progress}%</span>
            </div>
          ) : (
            <button type="button" onClick={() => videoRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-brand-400 text-sm text-slate-500 transition">
              <FileText className="h-4 w-4" />
              {am ? "ቪዲዮ አክል" : "Upload video"}
            </button>
          )}
        </>
      )}
    </div>
  );
}

// ─── CourseUploadModal ───────────────────────────────────────────────────────
const MODAL_STEPS = 4;

function CourseUploadModal({ onClose }) {
  const { i18n } = useTranslation();
  const am = i18n.language === "am";
  const qc = useQueryClient();
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    title: "", subtitle: "", description: "",
    level: "beginner", status: "draft",
    currency: "USD", price: 0, discountPrice: 0, isFree: true,
    whatYouWillLearn: [""], requirements: [""],
    thumbnail: "", descriptionPdfUrl: "", introVideoUrl: "",
  });
  const [sections, setSections] = useState([
    { title: "", lessons: [{ title: "", videoUrl: "", duration: 0, isPreview: false, uploading: false, progress: 0 }] },
  ]);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbProgress, setThumbProgress] = useState(0);
  const [pdfName, setPdfName] = useState(null);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [pdfProgress, setPdfProgress] = useState(0);
  const [introName, setIntroName] = useState(null);
  const [introUploading, setIntroUploading] = useState(false);
  const [introProgress, setIntroProgress] = useState(0);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleThumb = async (file) => {
    setThumbPreview(URL.createObjectURL(file));
    setThumbUploading(true); setThumbProgress(0);
    try {
      const t = setInterval(() => setThumbProgress((p) => Math.min(90, p + 7)), 120);
      const r = await uploadsApi.thumbnail(file);
      clearInterval(t); setThumbProgress(100);
      set("thumbnail", r.url || r.secure_url || r);
    } catch { toast.error("Thumbnail upload failed"); setThumbPreview(null); }
    finally { setThumbUploading(false); }
  };

  const handlePdf = async (file) => {
    setPdfName(file.name); setPdfUploading(true); setPdfProgress(0);
    try {
      const t = setInterval(() => setPdfProgress((p) => Math.min(90, p + 5)), 150);
      const r = await uploadsApi.document(file);
      clearInterval(t); setPdfProgress(100);
      set("descriptionPdfUrl", r.url || r.secure_url);
      toast.success("PDF uploaded");
    } catch { toast.error("PDF upload failed"); setPdfName(null); }
    finally { setPdfUploading(false); }
  };

  const handleIntro = async (file) => {
    setIntroName(file.name); setIntroUploading(true); setIntroProgress(0);
    try {
      const t = setInterval(() => setIntroProgress((p) => Math.min(90, p + 4)), 200);
      const r = await uploadsApi.video(file);
      clearInterval(t); setIntroProgress(100);
      set("introVideoUrl", r.url || r.secure_url);
      toast.success("Intro video uploaded");
    } catch { toast.error("Video upload failed"); setIntroName(null); }
    finally { setIntroUploading(false); }
  };

  const handleLessonVideo = async (si, li, file) => {
    setSections((p) => p.map((s, i) => i !== si ? s : {
      ...s, lessons: s.lessons.map((l, j) => j !== li ? l : { ...l, uploading: true, progress: 0 }),
    }));
    try {
      const t = setInterval(() => setSections((p) => p.map((s, i) => i !== si ? s : {
        ...s, lessons: s.lessons.map((l, j) => j !== li ? l : { ...l, progress: Math.min(90, l.progress + 4) }),
      })), 200);
      const r = await uploadsApi.video(file);
      clearInterval(t);
      setSections((p) => p.map((s, i) => i !== si ? s : {
        ...s, lessons: s.lessons.map((l, j) => j !== li ? l : { ...l, videoUrl: r.url || r.secure_url, duration: r.duration || 0, uploading: false, progress: 100 }),
      }));
      toast.success("Lesson video uploaded");
    } catch {
      toast.error("Lesson video upload failed");
      setSections((p) => p.map((s, i) => i !== si ? s : {
        ...s, lessons: s.lessons.map((l, j) => j !== li ? l : { ...l, uploading: false, progress: 0 }),
      }));
    }
  };

  const addSection = () => setSections((p) => [...p, { title: "", lessons: [{ title: "", videoUrl: "", duration: 0, isPreview: false, uploading: false, progress: 0 }] }]);
  const removeSection = (si) => setSections((p) => p.filter((_, i) => i !== si));
  const updateSection = (si, v) => setSections((p) => p.map((s, i) => i !== si ? s : { ...s, title: v }));
  const addLesson = (si) => setSections((p) => p.map((s, i) => i !== si ? s : { ...s, lessons: [...s.lessons, { title: "", videoUrl: "", duration: 0, isPreview: false, uploading: false, progress: 0 }] }));
  const removeLesson = (si, li) => setSections((p) => p.map((s, i) => i !== si ? s : { ...s, lessons: s.lessons.filter((_, j) => j !== li) }));
  const updateLesson = (si, li, k, v) => setSections((p) => p.map((s, i) => i !== si ? s : { ...s, lessons: s.lessons.map((l, j) => j !== li ? l : { ...l, [k]: v }) }));

  const listChange = (f, idx, v) => setForm((prev) => { const a = [...prev[f]]; a[idx] = v; return { ...prev, [f]: a }; });
  const addItem = (f) => setForm((prev) => ({ ...prev, [f]: [...prev[f], ""] }));
  const removeItem = (f, idx) => setForm((prev) => ({ ...prev, [f]: prev[f].filter((_, i) => i !== idx) }));

  const createMutation = useMutation({
    mutationFn: (p) => coursesApi.create(p),
    onSuccess: () => { toast.success(am ? "ትምህርት ተፈጠረ!" : "Course created!"); qc.invalidateQueries({ queryKey: ["courses"] }); qc.invalidateQueries({ queryKey: ["admin", "courses"] }); qc.invalidateQueries({ queryKey: ["admin", "stats"] }); onClose(); },
    onError: (e) => toast.error(e.message || "Failed to create course"),
  });

  const submit = () => {
    if (!form.title.trim()) { toast.error("Title is required"); setStep(0); return; }
    createMutation.mutate({
      title: form.title, subtitle: form.subtitle, description: form.description,
      level: form.level, status: form.status, currency: form.currency,
      price: form.isFree ? 0 : Number(form.price),
      discountPrice: form.isFree ? 0 : Number(form.discountPrice),
      thumbnail: form.thumbnail,
      whatYouWillLearn: form.whatYouWillLearn.filter(Boolean),
      requirements: form.requirements.filter(Boolean),
      sections: sections.map((s, si) => ({
        title: s.title || `Section ${si + 1}`, order: si,
        lessons: s.lessons.map((l, li) => ({ title: l.title || `Lesson ${li + 1}`, videoUrl: l.videoUrl, duration: l.duration, isPreview: l.isPreview, order: li })),
      })),
      ...(form.descriptionPdfUrl && { descriptionPdfUrl: form.descriptionPdfUrl }),
      ...(form.introVideoUrl     && { introVideoUrl: form.introVideoUrl }),
    });
  };

  const stepLabels = am ? ["ዝርዝር", "ሚዲያ", "ትምህርቶች", "ዋጋ"] : ["Details", "Media", "Curriculum", "Pricing"];
  const canNext = [form.title.trim().length > 0, true, true, true];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="relative w-full max-w-2xl my-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold">{am ? "አዲስ ትምህርት ፍጠር" : "Create New Course"}</h2>
            <div className="flex items-center gap-2.5 mt-1.5">
              <StepDots total={MODAL_STEPS} current={step} />
              <span className="text-xs text-slate-400">{am ? `ደረጃ ${step + 1}/${MODAL_STEPS}` : `Step ${step + 1} of ${MODAL_STEPS}`} · {stepLabels[step]}</span>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost !p-2 text-slate-400"><X className="h-5 w-5" /></button>
        </div>

        {/* Tab pills */}
        <div className="flex px-5 pt-3 gap-1">
          {stepLabels.map((s, i) => (
            <button key={i} onClick={() => i <= step && setStep(i)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition ${
                i === step ? "bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-300"
                : i < step ? "text-brand-600 dark:text-brand-400 hover:bg-brand-50 cursor-pointer"
                : "text-slate-400 cursor-default"}`}>
              {i < step && <CheckCircle2 className="h-3 w-3 inline mr-1 text-brand-500" />}{s}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="px-5 py-4 max-h-[60vh] overflow-y-auto space-y-4">

          {/* Step 0 */}
          {step === 0 && (
            <motion.div key="s0" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label">{am ? "ርዕስ *" : "Title *"}</label>
                  <input className="input mt-1" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. React & TypeScript Mastery" autoFocus />
                </div>
                <div>
                  <label className="label">{am ? "ንዑስ ርዕስ" : "Subtitle"}</label>
                  <input className="input mt-1" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Short tagline" />
                </div>
                <div>
                  <label className="label">{am ? "ደረጃ" : "Level"}</label>
                  <select className="input mt-1" value={form.level} onChange={(e) => set("level", e.target.value)}>
                    {[["beginner", am?"ጀማሪ":"Beginner"],["intermediate",am?"መካከለኛ":"Intermediate"],["advanced",am?"ከፍተኛ":"Advanced"],["all-levels",am?"ሁሉም":"All Levels"]].map(([v,l])=><option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label">{am ? "ዝርዝር" : "Description"}</label>
                <textarea className="input mt-1 min-h-[80px] resize-none" value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder={am?"ስለ ትምህርቱ ያስረዱ...":"What will students learn?"} />
              </div>
              <div>
                <label className="label block mb-2">{am?"ተማሪዎች ምን ይማሩ":"Learning outcomes"}</label>
                <div className="space-y-2">
                  {form.whatYouWillLearn.map((v, i) => (
                    <div key={i} className="flex gap-2">
                      <input className="input flex-1" value={v} onChange={(e) => listChange("whatYouWillLearn", i, e.target.value)} placeholder={`Outcome ${i+1}`} />
                      {form.whatYouWillLearn.length > 1 && <button type="button" onClick={() => removeItem("whatYouWillLearn", i)} className="btn-ghost !p-2 text-red-400"><X className="h-4 w-4" /></button>}
                    </div>
                  ))}
                  <button type="button" onClick={() => addItem("whatYouWillLearn")} className="btn-outline !py-1 !text-xs gap-1"><Plus className="h-3.5 w-3.5"/>{am?"ጨምር":"Add"}</button>
                </div>
              </div>
              <div>
                <label className="label block mb-2">{am?"ቅድመ ሁኔታዎች":"Requirements"}</label>
                <div className="space-y-2">
                  {form.requirements.map((v, i) => (
                    <div key={i} className="flex gap-2">
                      <input className="input flex-1" value={v} onChange={(e) => listChange("requirements", i, e.target.value)} placeholder={`Requirement ${i+1}`} />
                      {form.requirements.length > 1 && <button type="button" onClick={() => removeItem("requirements", i)} className="btn-ghost !p-2 text-red-400"><X className="h-4 w-4" /></button>}
                    </div>
                  ))}
                  <button type="button" onClick={() => addItem("requirements")} className="btn-outline !py-1 !text-xs gap-1"><Plus className="h-3.5 w-3.5"/>{am?"ጨምር":"Add"}</button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="label block mb-2">{am?"ሽፋን ስዕል":"Course Thumbnail"}</label>
                <DropZone accept="image/*" label={am?"ስዕል ምረጥ ወይም ጎትት":"Click or drag image"} hint="PNG, JPG · max 5MB"
                  icon={Image} preview={thumbPreview} uploading={thumbUploading} progress={thumbProgress}
                  onChange={handleThumb} onClear={() => { setThumbPreview(null); set("thumbnail",""); }} />
                {form.thumbnail && !thumbUploading && <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5"/>{am?"ተጭኗል":"Uploaded"}</p>}
              </div>
              <div>
                <label className="label block mb-2">{am?"የመግቢያ ቪዲዮ (አማራጭ)":"Intro Video (optional)"}</label>
                <DropZone accept="video/*" label={am?"ቪዲዮ ምረጥ ወይም ጎትት":"Click or drag video"} hint="MP4, WEBM · max 500MB"
                  icon={FileText} preview={introName} uploading={introUploading} progress={introProgress}
                  onChange={handleIntro} onClear={() => { setIntroName(null); set("introVideoUrl",""); }} />
                {form.introVideoUrl && !introUploading && <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5"/>{am?"ቪዲዮ ተጭኗል":"Video uploaded"}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="label">{am?"ፒዲኤፍ (አማራጭ)":"PDF Description (optional)"}</label>
                  {form.descriptionPdfUrl && <a href={form.descriptionPdfUrl} target="_blank" rel="noreferrer" className="text-xs text-brand-600 hover:underline flex items-center gap-1"><Eye className="h-3 w-3"/>Preview</a>}
                </div>
                <DropZone accept="application/pdf" label={am?"ፒዲኤፍ ምረጥ ወይም ጎትት":"Click or drag PDF"} hint="PDF · max 50MB"
                  icon={FileText} preview={pdfName} uploading={pdfUploading} progress={pdfProgress}
                  onChange={handlePdf} onClear={() => { setPdfName(null); set("descriptionPdfUrl",""); }} />
                {form.descriptionPdfUrl && !pdfUploading && <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1"><CheckCircle2 className="h-3.5 w-3.5"/>{am?"ፒዲኤፍ ተጭኗል":"PDF uploaded"}</p>}
              </div>
            </motion.div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400">{am?"ክፍሎችና ትምህርቶችን ያዋቅሩ":"Build sections and upload lesson videos."}</p>
              {sections.map((sec, si) => (
                <div key={si} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/60 px-3 py-2.5">
                    <span className="text-xs font-bold text-slate-400 uppercase shrink-0">{am?`ክፍል ${si+1}`:`Sec ${si+1}`}</span>
                    <input className="input !h-7 !py-0 !text-sm flex-1" value={sec.title} onChange={(e) => updateSection(si, e.target.value)} placeholder={am?"ክፍሉን ስም":"Section title"} />
                    {sections.length > 1 && <button onClick={() => removeSection(si)} className="btn-ghost !p-1 text-red-400 shrink-0"><X className="h-4 w-4"/></button>}
                  </div>
                  {sec.lessons.map((les, li) => (
                    <LessonRow key={li} si={si} li={li} les={les} am={am}
                      updateLesson={updateLesson} removeLesson={removeLesson}
                      handleLessonVideo={handleLessonVideo} sectionLessonsCount={sec.lessons.length} />
                  ))}
                  <div className="px-3 py-2">
                    <button type="button" onClick={() => addLesson(si)} className="btn-ghost !py-1 !text-xs gap-1 text-brand-600 dark:text-brand-400">
                      <Plus className="h-3.5 w-3.5"/>{am?"ትምህርት ጨምር":"Add lesson"}
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addSection} className="btn-outline w-full gap-1.5 !text-sm">
                <Plus className="h-4 w-4"/>{am?"ክፍል ጨምር":"Add section"}
              </button>
            </motion.div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div>
                <label className="label block mb-2">{am?"ዓይነት":"Course Type"}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { v: true,  icon: Globe, l: am?"ነፃ":"Free",        s: am?"ሁሉም ሊደርሱ":"Anyone can enroll",  c:"green" },
                    { v: false, icon: Lock,  l: am?"የሚከፈልበት":"Paid", s: am?"ዋጋ ያስፈልጋል":"Requires payment",  c:"brand" },
                  ].map(({v,icon:Ic,l,s,c}) => (
                    <button key={String(v)} type="button" onClick={() => set("isFree", v)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-4 transition text-center ${
                        form.isFree === v
                          ? c==="green" ? "border-green-500 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300"
                          : "border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-500"}`}>
                      <Ic className="h-6 w-6"/><span className="font-semibold text-sm">{l}</span><span className="text-xs opacity-70">{s}</span>
                    </button>
                  ))}
                </div>
              </div>
              <AnimatePresence>
                {!form.isFree && (
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}} className="overflow-hidden space-y-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div><label className="label">{am?"ዋጋ":"Price"}</label><input className="input mt-1" type="number" min="0" step="0.01" value={form.price} onChange={(e)=>set("price",e.target.value)}/></div>
                      <div><label className="label">{am?"ቅናሽ":"Discount"}</label><input className="input mt-1" type="number" min="0" step="0.01" value={form.discountPrice} onChange={(e)=>set("discountPrice",e.target.value)}/></div>
                      <div><label className="label">{am?"ምንዛሪ":"Currency"}</label>
                        <select className="input mt-1" value={form.currency} onChange={(e)=>set("currency",e.target.value)}>
                          <option value="USD">USD ($)</option><option value="ETB">ETB (ብር)</option><option value="EUR">EUR (€)</option>
                        </select>
                      </div>
                    </div>
                    {Number(form.price)>0 && Number(form.discountPrice)>0 && (
                      <div className="p-3 rounded-xl bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-300 text-sm">
                        {am?"ቅናሽ: ":"Discount: "}<strong>{Math.round((1-form.discountPrice/form.price)*100)}% off</strong>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
              <div>
                <label className="label">{am?"ሁኔታ":"Publish status"}</label>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  {[["draft",am?"ቁልፍ":"Draft"],["published",am?"አሁን አትም":"Publish now"]].map(([v,l])=>(
                    <button key={v} type="button" onClick={()=>set("status",v)}
                      className={`py-2.5 rounded-xl border text-sm font-medium transition ${
                        form.status===v
                          ? v==="published" ? "border-brand-500 bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300"
                          : "border-slate-400 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                          : "border-slate-200 dark:border-slate-700 text-slate-500"}`}>{l}</button>
                  ))}
                </div>
              </div>
              {/* Summary */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-800 text-sm overflow-hidden">
                {[
                  [am?"ርዕስ":"Title", form.title||"—"],
                  [am?"ሁኔታ":"Status", form.status],
                  [am?"ዋጋ":"Price", form.isFree?(am?"ነፃ":"Free"):formatPrice(Number(form.price),form.currency)],
                  [am?"ክፍሎች":"Sections", String(sections.length)],
                  [am?"ትምህርቶች":"Lessons", String(sections.reduce((a,s)=>a+s.lessons.length,0))],
                  ["PDF", form.descriptionPdfUrl?"✓":(am?"የለም":"None")],
                  [am?"ቪዲዮ":"Intro video", form.introVideoUrl?"✓":(am?"የለም":"None")],
                ].map(([k,v])=>(
                  <div key={k} className="flex justify-between px-4 py-2 text-slate-500 dark:text-slate-400">
                    <span>{k}</span><span className="font-medium text-slate-700 dark:text-slate-200 truncate max-w-[160px]">{v}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          <button type="button" onClick={() => step > 0 ? setStep(step-1) : onClose()} className="btn-ghost gap-1.5 !px-3 !text-sm">
            <ArrowLeft className="h-4 w-4"/>{step===0?(am?"ሰርዝ":"Cancel"):(am?"ተመለስ":"Back")}
          </button>
          {step < MODAL_STEPS-1
            ? <Button onClick={() => canNext[step] && setStep(step+1)} disabled={!canNext[step]} className="gap-1.5">
                {am?"ቀጣይ":"Continue"} <ArrowRight className="h-4 w-4"/>
              </Button>
            : <Button onClick={submit} disabled={createMutation.isPending||thumbUploading||pdfUploading||introUploading} className="gap-1.5">
                {createMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin"/>{am?"በሂደት…":"Creating…"}</> : <><CheckCircle2 className="h-4 w-4"/>{am?"ትምህርት ፍጠር":"Create Course"}</>}
              </Button>
          }
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ConfirmDialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4"
      onClick={onCancel}>
      <motion.div initial={{scale:0.95,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.95,opacity:0}}
        className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6"
        onClick={(e)=>e.stopPropagation()}>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-outline !py-2 !px-4 !text-sm">Cancel</button>
          <button onClick={onConfirm} className="btn !py-2 !px-4 !text-sm bg-red-600 hover:bg-red-700 text-white rounded-xl">Confirm</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main AdminDashboard ──────────────────────────────────────────────────────
const TABS = ["overview", "users", "courses", "reports"];

export default function AdminDashboard() {
  const { i18n } = useTranslation();
  const am = i18n.language === "am";
  const { data: currentUser } = useUser();
  const qc = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [showUpload, setShowUpload] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [courseStatusFilter, setCourseStatusFilter] = useState("");

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => (await api.get("/admin/stats")).data.data,
    staleTime: 60000,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users", userSearch, userRoleFilter],
    queryFn: async () => (await api.get("/admin/users", { params: { q: userSearch, role: userRoleFilter, limit: 50 } })).data.data,
    enabled: activeTab === "users",
    staleTime: 30000,
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["admin", "courses", courseSearch, courseStatusFilter],
    queryFn: async () => (await api.get("/admin/courses", { params: { q: courseSearch, status: courseStatusFilter, limit: 50 } })).data.data,
    enabled: activeTab === "courses",
    staleTime: 30000,
  });

  // ── Mutations ──────────────────────────────────────────────────────────────
  const changeRole = useMutation({
    mutationFn: ({ id, role }) => api.patch(`/admin/users/${id}/role`, { role }),
    onSuccess: () => { toast.success(am?"ሚና ተቀይሯል":"Role updated"); qc.invalidateQueries({ queryKey: ["admin","users"] }); },
    onError: (e) => toast.error(e.message || "Failed"),
  });

  const deleteUser = useMutation({
    mutationFn: (id) => api.delete(`/admin/users/${id}`),
    onSuccess: () => { toast.success(am?"ተሰርዟል":"User deleted"); qc.invalidateQueries({ queryKey: ["admin","users"] }); qc.invalidateQueries({ queryKey: ["admin","stats"] }); setConfirm(null); },
    onError: (e) => toast.error(e.message || "Failed"),
  });

  const changeCourseStatus = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/admin/courses/${id}/status`, { status }),
    onSuccess: () => { toast.success(am?"ሁኔታ ተቀይሯል":"Status updated"); qc.invalidateQueries({ queryKey: ["admin","courses"] }); },
    onError: (e) => toast.error(e.message || "Failed"),
  });

  const deleteCourse = useMutation({
    mutationFn: (id) => api.delete(`/admin/courses/${id}`),
    onSuccess: () => { toast.success(am?"ትምህርቱ ተሰርዟል":"Course deleted"); qc.invalidateQueries({ queryKey: ["admin","courses"] }); qc.invalidateQueries({ queryKey: ["admin","stats"] }); setConfirm(null); },
    onError: (e) => toast.error(e.message || "Failed"),
  });

  // ── Derived ────────────────────────────────────────────────────────────────
  const s = {
    totalUsers:       stats?.totalUsers        ?? "—",
    totalCourses:     stats?.totalCourses      ?? "—",
    totalEnrollments: stats?.totalEnrollments  ?? "—",
    instructors:      stats?.instructors       ?? "—",
    publishedCourses: stats?.publishedCourses  ?? "—",
  };
  const users   = usersData?.items   ?? [];
  const courses = coursesData?.items ?? [];
  const tabLabels = { overview: am?"አጠቃላይ":"Overview", users: am?"ተጠቃሚዎች":"Users", courses: am?"ትምህርቶች":"Courses", reports: am?"ሪፖርቶች":"Reports" };

  return (
    <>
      <AnimatePresence>
        {confirm && (
          <ConfirmDialog
            title={confirm.type==="deleteUser"?(am?"ተጠቃሚ ሰርዝ":"Delete user"):(am?"ትምህርቱ ሰርዝ":"Delete course")}
            message={am?`"${confirm.name}" ን ለማስወገድ እርግጠኛ ነህ?`:`Delete "${confirm.name}"? This cannot be undone.`}
            onConfirm={() => { if (confirm.type==="deleteUser") deleteUser.mutate(confirm.id); else deleteCourse.mutate(confirm.id); }}
            onCancel={() => setConfirm(null)} />
        )}
        {showUpload && <CourseUploadModal onClose={() => setShowUpload(false)} />}
      </AnimatePresence>

      <section className="container py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white"><Shield className="h-3.5 w-3.5"/></div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">{am?"አስተዳዳሪ":"Admin Panel"}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display">{am?"አስተዳዳሪ ዳሽቦርድ":"Admin Dashboard"}</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{am?`እንኳን ደህና, ${currentUser?.firstName||"Admin"}`:`Welcome back, ${currentUser?.firstName||"Admin"}`}</p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button onClick={() => setShowUpload(true)} className="gap-1.5 !text-sm"><Plus className="h-4 w-4"/>{am?"ትምህርት ፍጠር":"New Course"}</Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setActiveTab("users")}><Users className="h-4 w-4"/>{am?"ተጠቃሚዎች":"Manage Users"}</Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-0.5 mb-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-sm font-medium shrink-0 border-b-2 -mb-px whitespace-nowrap transition ${
                activeTab===t ? "border-brand-600 text-brand-700 dark:text-brand-400 dark:border-brand-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}>
              {tabLabels[t]}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {activeTab === "overview" && (
          <>
            {/* Stats */}
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-6">
              {statsLoading ? Array(5).fill(0).map((_,i)=><Skeleton key={i} className="h-24"/>) : [
                { icon: Users,         label: am?"ተጠቃሚዎች":"Users",          value: s.totalUsers,        color: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",   action: ()=>setActiveTab("users")   },
                { icon: BookOpen,      label: am?"ትምህርቶች":"Courses",         value: s.totalCourses,      color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400", action: ()=>setActiveTab("courses") },
                { icon: Activity,      label: am?"ምዝገባዎች":"Enrollments",      value: s.totalEnrollments,  color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
                { icon: GraduationCap, label: am?"አስተማሪዎች":"Instructors",     value: s.instructors,       color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
                { icon: CheckCircle2,  label: am?"የወጡ":"Published",            value: s.publishedCourses,  color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",  action: ()=>setActiveTab("courses") },
              ].map((st,i) => (
                <motion.div key={i} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}
                  onClick={st.action} className={`card p-4 ${st.action?"cursor-pointer hover:shadow-md transition-shadow":""}`}>
                  <div className={`grid h-9 w-9 place-items-center rounded-lg mb-2 ${st.color}`}><st.icon className="h-5 w-5"/></div>
                  <p className="text-xl font-bold">{st.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{st.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick actions + Activity */}
            <div className="grid gap-5 lg:grid-cols-3 mb-5">
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="lg:col-span-2 card p-5">
                <h2 className="font-semibold mb-3">{am?"ፈጣን እርምጃዎች":"Quick Actions"}</h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Plus,          l: am?"ትምህርት ፍጠር":"Create Course",           action: ()=>setShowUpload(true),            c:"text-brand-600 dark:text-brand-400" },
                    { icon: Users,         l: am?"ተጠቃሚዎችን ያስተዳድሩ":"Manage Users",       action: ()=>setActiveTab("users"),           c:"text-purple-600 dark:text-purple-400" },
                    { icon: BookOpen,      l: am?"ትምህርቶችን ያሳዩ":"Publish Courses",        action: ()=>setActiveTab("courses"),         c:"text-green-600 dark:text-green-400" },
                    { icon: Shield,        l: am?"ሚና ቀይር":"Change Roles",                action: ()=>setActiveTab("users"),           c:"text-amber-600 dark:text-amber-400" },
                    { icon: BarChart2,     l: am?"ሪፖርቶች":"Reports",                      action: ()=>setActiveTab("reports"),         c:"text-slate-600 dark:text-slate-300" },
                    { icon: Home,          l: am?"ወደ ቤት":"Home",                          to: "/" },
                  ].map((a,i) => (
                    a.to
                      ? <Link key={i} to={a.to} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition border border-slate-100 dark:border-slate-800"><Home className="h-4 w-4 text-slate-500"/><span className="truncate">{a.l}</span></Link>
                      : <button key={i} onClick={a.action} className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition border border-slate-100 dark:border-slate-800 text-left"><a.icon className={`h-4 w-4 ${a.c}`}/><span className="truncate">{a.l}</span></button>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.35}} className="card p-5">
                <h2 className="font-semibold mb-3">{am?"የቅርብ ጊዜ እንቅስቃሴ":"Recent Activity"}</h2>
                {[
                  { icon: UserCheck,    title: am?"አዲስ ተጠቃሚ":"New user",          sub: "Abebe Girma",    time: "2m", s: "text-green-500" },
                  { icon: BookOpen,     title: am?"ትምህርት ታተመ":"Course published", sub: "React Patterns", time: "1h", s: "text-brand-500" },
                  { icon: AlertCircle,  title: am?"ቅሬታ":"Review flagged",          sub: "Python Basics",  time: "3h", s: "text-amber-500" },
                  { icon: GraduationCap, title: am?"ሲርቲፊኬት":"Cert. issued",       sub: "Sara M.",        time: "6h", s: "text-green-500" },
                ].map((a,i) => (
                  <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 dark:bg-slate-800"><a.icon className={`h-4 w-4 ${a.s}`}/></div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{a.title}</p><p className="text-xs text-slate-500 truncate">{a.sub}</p></div>
                    <span className="text-xs text-slate-400 shrink-0">{a.time}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Health bars */}
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.4}} className="card p-5">
              <h2 className="font-semibold mb-4">{am?"የፕላትፎርም ጤና":"Platform Health"}</h2>
              <div className="grid gap-5 sm:grid-cols-3">
                {[
                  { label: am?"ኮርስ ማጠናቀቂያ":"Course Completion", value: 72, cls: "from-brand-500 to-brand-700" },
                  { label: am?"ተጠቃሚ ቆይታ":"User Retention",    value: 68, cls: "from-green-500 to-emerald-600" },
                  { label: am?"አማካይ ደረጃ":"Avg. Rating",        value: 91, cls: "from-amber-400 to-orange-500" },
                ].map((item,i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-500 dark:text-slate-400">{item.label}</span><span className="font-semibold">{item.value}%</span></div>
                    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div initial={{width:0}} animate={{width:`${item.value}%`}} transition={{duration:0.9,delay:0.5+i*0.1,ease:"easeOut"}}
                        className={`h-full bg-gradient-to-r ${item.cls} rounded-full`}/>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* ═══ USERS ═══ */}
        {activeTab === "users" && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                <input className="input !pl-9" placeholder={am?"ስም ወይም ኢሜይል...":"Search name or email…"} value={userSearch} onChange={(e)=>setUserSearch(e.target.value)}/>
              </div>
              <select className="input !w-auto" value={userRoleFilter} onChange={(e)=>setUserRoleFilter(e.target.value)}>
                <option value="">{am?"ሁሉም ሚናዎች":"All roles"}</option>
                <option value="user">{am?"ተማሪ":"Learner"}</option>
                <option value="instructor">{am?"አስተማሪ":"Instructor"}</option>
                <option value="admin">{am?"አስተዳዳሪ":"Admin"}</option>
              </select>
            </div>
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-semibold">{am?"ሁሉም ተጠቃሚዎች":"All Users"}</h2>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-full">{usersData?.total??"—"}</span>
              </div>
              {usersLoading ? <div className="p-4 space-y-3">{Array(6).fill(0).map((_,i)=><Skeleton key={i} className="h-12"/>)}</div>
              : users.length === 0 ? <div className="py-14 text-center text-slate-500">{am?"ተጠቃሚ አልተገኘም":"No users found"}</div>
              : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/60">
                      <tr>{[am?"ስም":"Name", am?"ኢሜይል":"Email", am?"ሚና":"Role", am?"ቀን":"Joined", ""].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {u.imageUrl ? <img src={u.imageUrl} alt="" className="h-8 w-8 rounded-full object-cover shrink-0"/>
                                : <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-500/20 grid place-items-center text-brand-700 dark:text-brand-300 text-xs font-bold shrink-0">{(u.firstName?.[0]||u.email?.[0]||"?").toUpperCase()}</div>}
                              <span className="font-medium truncate max-w-[140px]">{[u.firstName,u.lastName].filter(Boolean).join(" ")||"—"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500 max-w-[160px] truncate">{u.email||"—"}</td>
                          <td className="px-4 py-3">
                            <select className="input !w-auto !h-7 !py-0 !text-xs" value={u.role}
                              disabled={String(u._id)===String(currentUser?._id)||changeRole.isPending}
                              onChange={(e) => changeRole.mutate({id:u._id,role:e.target.value})}>
                              <option value="user">{am?"ተማሪ":"Learner"}</option>
                              <option value="instructor">{am?"አስተማሪ":"Instructor"}</option>
                              <option value="admin">{am?"አስተዳዳሪ":"Admin"}</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{u.createdAt?new Date(u.createdAt).toLocaleDateString():"—"}</td>
                          <td className="px-4 py-3">
                            <button onClick={() => setConfirm({type:"deleteUser",id:u._id,name:u.firstName||u.email||"user"})}
                              disabled={String(u._id)===String(currentUser?._id)}
                              className="btn-ghost !p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30">
                              <X className="h-4 w-4"/>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══ COURSES ═══ */}
        {activeTab === "courses" && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                <input className="input !pl-9" placeholder={am?"ርዕስ ፈልግ...":"Search title…"} value={courseSearch} onChange={(e)=>setCourseSearch(e.target.value)}/>
              </div>
              <select className="input !w-auto" value={courseStatusFilter} onChange={(e)=>setCourseStatusFilter(e.target.value)}>
                <option value="">{am?"ሁሉም":"All"}</option>
                <option value="draft">{am?"ቁልፍ":"Draft"}</option>
                <option value="published">{am?"ታትሟል":"Published"}</option>
                <option value="archived">{am?"ቀዳሚ":"Archived"}</option>
              </select>
              <Button onClick={() => setShowUpload(true)} size="sm" className="gap-1 shrink-0"><Plus className="h-4 w-4"/>{am?"ጨምር":"New"}</Button>
            </div>
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-semibold">{am?"ሁሉም ትምህርቶች":"All Courses"}</h2>
                <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 px-2.5 py-1 rounded-full">{coursesData?.total??"—"}</span>
              </div>
              {coursesLoading ? <div className="p-4 space-y-3">{Array(6).fill(0).map((_,i)=><Skeleton key={i} className="h-14"/>)}</div>
              : courses.length === 0 ? (
                <div className="py-14 text-center">
                  <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3"/>
                  <p className="text-slate-500">{am?"ምንም ትምህርት":"No courses found"}</p>
                  <Button onClick={() => setShowUpload(true)} className="mt-4 gap-1" size="sm"><Plus className="h-4 w-4"/>{am?"ፍጠር":"Create"}</Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/60">
                      <tr>{[am?"ትምህርቱ":"Course", am?"አስተማሪ":"Instructor", am?"ዋጋ":"Price", am?"ሁኔታ":"Status", am?"እርምጃ":"Actions"].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {courses.map((c) => (
                        <tr key={c._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {c.thumbnail ? <img src={c.thumbnail} alt="" className="h-10 w-14 rounded-lg object-cover shrink-0"/>
                                : <div className="h-10 w-14 rounded-lg bg-slate-100 dark:bg-slate-800 grid place-items-center shrink-0"><BookOpen className="h-4 w-4 text-slate-400"/></div>}
                              <div className="min-w-0">
                                <p className="font-medium truncate max-w-[160px]">{c.title}</p>
                                <p className="text-xs text-slate-400 capitalize">{c.level||"—"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500 truncate max-w-[120px]">
                            {c.instructor?[c.instructor.firstName,c.instructor.lastName].filter(Boolean).join(" ")||c.instructor.email||"—":"—"}
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {c.price===0 ? <span className="text-green-600 dark:text-green-400 text-xs font-semibold">{am?"ነፃ":"Free"}</span>
                              : formatPrice(c.effectivePrice??c.price,c.currency)}
                          </td>
                          <td className="px-4 py-3">
                            <select className="input !w-auto !h-7 !py-0 !text-xs" value={c.status}
                              disabled={changeCourseStatus.isPending}
                              onChange={(e) => changeCourseStatus.mutate({id:c._id,status:e.target.value})}>
                              <option value="draft">{am?"ቁልፍ":"Draft"}</option>
                              <option value="published">{am?"አሳታሚ":"Published"}</option>
                              <option value="archived">{am?"ቀዳሚ":"Archived"}</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Link to={`/courses/${c.slug}`} className="btn-ghost !p-1.5 text-slate-400 hover:text-brand-600" title="View"><Eye className="h-4 w-4"/></Link>
                              <button onClick={() => setConfirm({type:"deleteCourse",id:c._id,name:c.title})} className="btn-ghost !p-1.5 text-red-400 hover:text-red-600" title="Delete"><X className="h-4 w-4"/></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══ REPORTS ═══ */}
        {activeTab === "reports" && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-5">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
              {[
                { icon: Users,         label: am?"ጠቅላላ ተጠቃሚዎች":"Total Users",    value: s.totalUsers,       cls:"bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300" },
                { icon: BookOpen,      label: am?"ጠቅላላ ትምህርቶች":"Total Courses",   value: s.totalCourses,     cls:"bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
                { icon: Activity,      label: am?"ምዝገባዎች":"Enrollments",           value: s.totalEnrollments, cls:"bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400" },
                { icon: GraduationCap, label: am?"አስተማሪዎች":"Instructors",          value: s.instructors,      cls:"bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
              ].map((r,i) => (
                <motion.div key={i} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="card p-5">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl mb-3 ${r.cls}`}><r.icon className="h-5 w-5"/></div>
                  <p className="text-2xl font-bold">{r.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{r.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="card p-6">
              <h3 className="font-semibold mb-2">{am?"ሙሉ ሪፖርቶች ሲዘጋጁ ይቀርባሉ":"Full analytics coming soon"}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{am?"ቻርቶች፣ የገቢ ሪፖርቶች እና CSV እዚህ ይቀርባሉ።":"Revenue charts, enrollment trends, and CSV export will appear here."}</p>
            </div>
          </motion.div>
        )}
      </section>
    </>
  );
}
