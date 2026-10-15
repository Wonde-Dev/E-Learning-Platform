import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, BookOpen, DollarSign, Shield, AlertCircle,
  BarChart2, Activity, UserCheck, GraduationCap,
  ChevronRight, Plus, X, Image, Loader2, FileText,
  Eye, Search, TrendingUp, CheckCircle2,
  Globe, Lock, ArrowLeft, ArrowRight, Home,
  Award, Sparkles, Printer, Edit3, Trash2, Check,
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
import CertificateModal from "@/components/common/CertificateModal";

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

// ─── LessonRow ───────────────────────────────────────────────────────────────
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
    level: "beginner", status: "published",
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
    onSuccess: () => {
      toast.success(am ? "ትምህርት በተሳካ ሁኔታ ተለጠፈ!" : "Course created & published successfully!");
      qc.invalidateQueries({ queryKey: ["courses"] });
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      onClose();
    },
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
            <h2 className="text-lg font-bold">{am ? "አዲስ ትምህርት ፍጠር እና ለጥፍ" : "Create & Post New Course"}</h2>
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
                  <input className="input mt-1" value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Modern Full-Stack Web Development" autoFocus />
                </div>
                <div>
                  <label className="label">{am ? "ንዑስ ርዕስ" : "Subtitle"}</label>
                  <input className="input mt-1" value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="Short compelling tagline" />
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
                <label className="label block mb-2">{am?"ተማሪዎች ምን ይማራሉ":"Learning outcomes"}</label>
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
                  {[["draft",am?"ረቂቅ (Draft)":"Draft"],["published",am?"ታትሟል (Published)":"Publish now"]].map(([v,l])=>(
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
                {createMutation.isPending ? <><Loader2 className="h-4 w-4 animate-spin"/>{am?"በሂደት…":"Posting…"}</> : <><CheckCircle2 className="h-4 w-4"/>{am?"ትምህርት ለጥፍ":"Post Course"}</>}
              </Button>
          }
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── EditCourseModal ─────────────────────────────────────────────────────────
function EditCourseModal({ course, onClose }) {
  const { i18n } = useTranslation();
  const am = i18n.language === "am";
  const qc = useQueryClient();

  const [form, setForm] = useState({
    title: course.title || "",
    subtitle: course.subtitle || "",
    description: course.description || "",
    level: course.level || "beginner",
    status: course.status || "published",
    price: course.price || 0,
    discountPrice: course.discountPrice || 0,
    currency: course.currency || "USD",
    isFree: (course.price || 0) === 0,
  });

  const updateMutation = useMutation({
    mutationFn: (payload) => api.patch(`/courses/${course._id}`, payload),
    onSuccess: () => {
      toast.success(am ? "ትምህርት ተሻሽሏል!" : "Course updated successfully!");
      qc.invalidateQueries({ queryKey: ["admin", "courses"] });
      qc.invalidateQueries({ queryKey: ["courses"] });
      onClose();
    },
    onError: (e) => toast.error(e.message || "Failed to update course"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    updateMutation.mutate({
      title: form.title,
      subtitle: form.subtitle,
      description: form.description,
      level: form.level,
      status: form.status,
      currency: form.currency,
      price: form.isFree ? 0 : Number(form.price),
      discountPrice: form.isFree ? 0 : Number(form.discountPrice),
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-brand-600" />
            <h3 className="font-bold text-lg">{am ? "ትምህርት አርትዕ" : "Edit Course"}</h3>
          </div>
          <button onClick={onClose} className="btn-ghost !p-2 text-slate-400"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">{am ? "ርዕስ *" : "Title *"}</label>
            <input className="input mt-1" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div>
            <label className="label">{am ? "ንዑስ ርዕስ" : "Subtitle"}</label>
            <input className="input mt-1" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">{am ? "ደረጃ" : "Level"}</label>
              <select className="input mt-1" value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}>
                <option value="beginner">{am ? "ጀማሪ" : "Beginner"}</option>
                <option value="intermediate">{am ? "መካከለኛ" : "Intermediate"}</option>
                <option value="advanced">{am ? "ከፍተኛ" : "Advanced"}</option>
                <option value="all-levels">{am ? "ሁሉም" : "All Levels"}</option>
              </select>
            </div>
            <div>
              <label className="label">{am ? "ሁኔታ" : "Status"}</label>
              <select className="input mt-1" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="draft">{am ? "ረቂቅ (Draft)" : "Draft"}</option>
                <option value="published">{am ? "ታትሟል (Published)" : "Published"}</option>
                <option value="archived">{am ? "ቀዳሚ (Archived)" : "Archived"}</option>
              </select>
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
              <input type="checkbox" checked={form.isFree} onChange={(e) => setForm({ ...form, isFree: e.target.checked })} className="rounded" />
              {am ? "ነፃ ትምህርት" : "Free Course"}
            </label>
          </div>
          {!form.isFree && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">{am ? "ዋጋ" : "Price"}</label>
                <input className="input mt-1" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label className="label">{am ? "ቅናሽ ዋጋ" : "Discount Price"}</label>
                <input className="input mt-1" type="number" step="0.01" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} />
              </div>
            </div>
          )}
          <div>
            <label className="label">{am ? "ዝርዝር" : "Description"}</label>
            <textarea className="input mt-1" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="btn-outline !py-2 !px-4 text-sm">{am ? "ሰርዝ" : "Cancel"}</button>
            <Button type="submit" disabled={updateMutation.isPending} className="!py-2 !px-5 text-sm gap-1.5">
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              {am ? "አስቀምጥ" : "Save Changes"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── AwardCertificateModal ───────────────────────────────────────────────────
function AwardCertificateModal({ users, courses, onClose }) {
  const { i18n } = useTranslation();
  const am = i18n.language === "am";
  const qc = useQueryClient();

  const [selectedUserId, setSelectedUserId] = useState(users[0]?._id || "");
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?._id || "");
  const [note, setNote] = useState("");

  const issueMutation = useMutation({
    mutationFn: (payload) => api.post("/admin/certificates/issue", payload),
    onSuccess: () => {
      toast.success(am ? "የምስክር ወረቀት በተሳካ ሁኔታ ተሰጥቷል!" : "Certificate awarded successfully!");
      qc.invalidateQueries({ queryKey: ["admin", "certificates"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      onClose();
    },
    onError: (e) => toast.error(e.message || "Failed to award certificate"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUserId || !selectedCourseId) {
      toast.error("Please select a student and a course");
      return;
    }
    issueMutation.mutate({
      userId: selectedUserId,
      courseId: selectedCourseId,
      note,
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{am ? "ሲርቲፊኬት ይስጡ (Award Certificate)" : "Give & Award Certificate"}</h3>
              <p className="text-xs text-slate-500">{am ? "ለተማሪው የተረጋገጠ ሲርቲፊኬት ያውጡ" : "Issue an authenticated credential to any student"}</p>
            </div>
          </div>
          <button onClick={onClose} className="btn-ghost !p-2 text-slate-400"><X className="h-4 w-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">{am ? "ተማሪ ይምረጡ *" : "Select Student *"}</label>
            <select className="input mt-1" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {[u.firstName, u.lastName].filter(Boolean).join(" ") || u.email || u.clerkId} ({u.email || "No email"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">{am ? "ትምህርት ይምረጡ *" : "Select Course *"}</label>
            <select className="input mt-1" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)} required>
              {courses.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title} ({c.level})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">{am ? "ልዩ ክብር / ማስታወሻ (አማራጭ)" : "Honors / Note (optional)"}</label>
            <input className="input mt-1" placeholder="e.g. Graduated with High Distinction" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
            <span>
              {am
                ? "ሲርቲፊኬቱ ወዲያውኑ በኦፊሴላዊ መለያ ቁጥር ይዘጋጃል እና በተማሪው ዳሽቦርድ ላይ ይታያል።"
                : "The certificate will be instantly generated with a unique verification code and will be accessible from the student's dashboard."}
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button type="button" onClick={onClose} className="btn-outline !py-2 !px-4 text-sm">{am ? "ሰርዝ" : "Cancel"}</button>
            <Button type="submit" disabled={issueMutation.isPending} className="!py-2 !px-5 text-sm gap-1.5 bg-amber-600 hover:bg-amber-700 text-white">
              {issueMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Award className="h-4 w-4" />}
              {am ? "ሲርቲፊኬቱን ስጥ" : "Award Certificate"}
            </Button>
          </div>
        </form>
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
const TABS = ["overview", "courses", "certificates", "users", "reports"];

export default function AdminDashboard() {
  const { i18n } = useTranslation();
  const am = i18n.language === "am";
  const { data: currentUser } = useUser();
  const qc = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [showUpload, setShowUpload] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showAwardCert, setShowAwardCert] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("");
  const [courseSearch, setCourseSearch] = useState("");
  const [courseStatusFilter, setCourseStatusFilter] = useState("");
  const [certSearch, setCertSearch] = useState("");
  const [certStatusFilter, setCertStatusFilter] = useState("");

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => (await api.get("/admin/stats")).data.data,
    staleTime: 30000,
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ["admin", "users", userSearch, userRoleFilter],
    queryFn: async () => (await api.get("/admin/users", { params: { q: userSearch, role: userRoleFilter, limit: 100 } })).data.data,
    staleTime: 30000,
  });

  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ["admin", "courses", courseSearch, courseStatusFilter],
    queryFn: async () => (await api.get("/admin/courses", { params: { q: courseSearch, status: courseStatusFilter, limit: 100 } })).data.data,
    staleTime: 30000,
  });

  const { data: certsData, isLoading: certsLoading } = useQuery({
    queryKey: ["admin", "certificates", certSearch, certStatusFilter],
    queryFn: async () => (await api.get("/admin/certificates", { params: { q: certSearch, status: certStatusFilter, limit: 100 } })).data.data,
    enabled: activeTab === "certificates" || activeTab === "overview",
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

  const instantIssueCert = useMutation({
    mutationFn: ({ enrollmentId }) => api.post("/admin/certificates/issue", { enrollmentId }),
    onSuccess: () => {
      toast.success(am ? "ሲርቲፊኬት ተሰጥቷል!" : "Certificate issued!");
      qc.invalidateQueries({ queryKey: ["admin", "certificates"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (e) => toast.error(e.message || "Failed to issue certificate"),
  });

  const revokeCert = useMutation({
    mutationFn: (id) => api.delete(`/admin/certificates/${id}`),
    onSuccess: () => {
      toast.success(am ? "ሲርቲፊኬት ተሰርዟል" : "Certificate revoked");
      qc.invalidateQueries({ queryKey: ["admin", "certificates"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      setConfirm(null);
    },
    onError: (e) => toast.error(e.message || "Failed to revoke certificate"),
  });

  // ── Derived ────────────────────────────────────────────────────────────────
  const s = {
    totalUsers:        stats?.totalUsers        ?? "—",
    totalCourses:      stats?.totalCourses      ?? "—",
    totalEnrollments:  stats?.totalEnrollments  ?? "—",
    totalCertificates: stats?.totalCertificates ?? "—",
    instructors:       stats?.instructors       ?? "—",
    publishedCourses:  stats?.publishedCourses  ?? "—",
  };
  const users        = usersData?.items   ?? [];
  const courses      = coursesData?.items ?? [];
  const certificates = certsData?.items   ?? [];

  const tabLabels = {
    overview: am ? "አጠቃላይ" : "Overview",
    courses: am ? "ትምህርቶች (Courses)" : "Courses & Posting",
    certificates: am ? "ሲርቲፊኬቶች (Certificates)" : "Certificates",
    users: am ? "ተጠቃሚዎች" : "Users",
    reports: am ? "ሪፖርቶች" : "Reports",
  };

  return (
    <>
      <AnimatePresence>
        {confirm && (
          <ConfirmDialog
            title={
              confirm.type === "deleteUser" ? (am ? "ተጠቃሚ ሰርዝ" : "Delete user")
              : confirm.type === "deleteCourse" ? (am ? "ትምህርቱ ሰርዝ" : "Delete course")
              : (am ? "ሲርቲፊኬት ሰርዝ" : "Revoke Certificate")
            }
            message={
              confirm.type === "revokeCert" ? (am ? `የ ${confirm.name} ሲርቲፊኬት እንዲሰረዝ እርግጠኛ ነዎት?` : `Revoke certificate for "${confirm.name}"?`)
              : (am ? `"${confirm.name}" ን ለማስወገድ እርግጠኛ ነዎት?` : `Delete "${confirm.name}"? This cannot be undone.`)
            }
            onConfirm={() => {
              if (confirm.type === "deleteUser") deleteUser.mutate(confirm.id);
              else if (confirm.type === "deleteCourse") deleteCourse.mutate(confirm.id);
              else if (confirm.type === "revokeCert") revokeCert.mutate(confirm.id);
            }}
            onCancel={() => setConfirm(null)} />
        )}
        {showUpload && <CourseUploadModal onClose={() => setShowUpload(false)} />}
        {editingCourse && <EditCourseModal course={editingCourse} onClose={() => setEditingCourse(null)} />}
        {showAwardCert && <AwardCertificateModal users={users} courses={courses} onClose={() => setShowAwardCert(false)} />}
        {selectedCertificate && <CertificateModal certificate={selectedCertificate} onClose={() => setSelectedCertificate(null)} />}
      </AnimatePresence>

      <section className="container py-6 md:py-8 max-w-7xl">
        {/* Header */}
        <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-600 text-white shadow-soft">
                <Shield className="h-3.5 w-3.5"/>
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">
                {am ? "አስተዳዳሪ ማዕከል" : "Administrator Portal"}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold font-display">
              {am ? "አስተዳዳሪ ዳሽቦርድ" : "Admin Command Dashboard"}
            </h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {am ? `እንኳን ደህና መጡ, ${currentUser?.firstName || "Admin"} · ትምህርቶችን ይለጥፉ፣ ያስተዳድሩ እና ሲርቲፊኬቶችን ይስጡ` : `Welcome back, ${currentUser?.firstName || "Admin"} · Post courses, govern users, and issue certified credentials`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            <Button onClick={() => setShowUpload(true)} className="gap-1.5 !text-sm shadow-soft">
              <Plus className="h-4 w-4"/>
              {am ? "ትምህርት ለጥፍ" : "Post New Course"}
            </Button>
            <Button onClick={() => setShowAwardCert(true)} className="gap-1.5 !text-sm bg-amber-600 hover:bg-amber-700 text-white">
              <Award className="h-4 w-4"/>
              {am ? "ሲርቲፊኬት ስጥ" : "Give Certificate"}
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setActiveTab("users")}>
              <Users className="h-4 w-4"/>
              {am ? "ተጠቃሚዎች" : "Users"}
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-px">
          {TABS.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`px-4 py-2.5 text-sm font-semibold shrink-0 border-b-2 -mb-px whitespace-nowrap transition-all ${
                activeTab === t
                  ? "border-brand-600 text-brand-700 dark:text-brand-400 dark:border-brand-400"
                  : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}>
              {tabLabels[t]}
            </button>
          ))}
        </div>

        {/* ═══ OVERVIEW ═══ */}
        {activeTab === "overview" && (
          <>
            {/* Stats */}
            <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 mb-6">
              {statsLoading ? Array(6).fill(0).map((_,i)=><Skeleton key={i} className="h-24"/>) : [
                { icon: Users,         label: am?"ተጠቃሚዎች":"Users",          value: s.totalUsers,        color: "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300",   action: ()=>setActiveTab("users")   },
                { icon: BookOpen,      label: am?"ትምህርቶች":"Courses",         value: s.totalCourses,      color: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400", action: ()=>setActiveTab("courses") },
                { icon: Activity,      label: am?"ምዝገባዎች":"Enrollments",      value: s.totalEnrollments,  color: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { icon: Award,         label: am?"የተሰጡ ሲርቲፊኬቶች":"Certificates", value: s.totalCertificates, color: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400", action: ()=>setActiveTab("certificates") },
                { icon: GraduationCap, label: am?"አስተማሪዎች":"Instructors",     value: s.instructors,       color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400" },
                { icon: CheckCircle2,  label: am?"የወጡ":"Published",            value: s.publishedCourses,  color: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",  action: ()=>setActiveTab("courses") },
              ].map((st,i) => (
                <motion.div key={i} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
                  onClick={st.action} className={`card p-4 ${st.action?"cursor-pointer hover:shadow-md transition-shadow":""}`}>
                  <div className={`grid h-9 w-9 place-items-center rounded-lg mb-2 ${st.color}`}><st.icon className="h-5 w-5"/></div>
                  <p className="text-xl font-bold">{st.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">{st.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Quick actions + Activity */}
            <div className="grid gap-5 lg:grid-cols-3 mb-5">
              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.25}} className="lg:col-span-2 card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-base">{am ? "ፈጣን እርምጃዎች (Admin Actions)" : "Quick Actions"}</h2>
                  <span className="text-xs text-slate-400">{am ? "ፕላትፎርሙን ሙሉ በሙሉ ይቆጣጠሩ" : "Platform Management"}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { icon: Plus,      l: am?"ትምህርት ለጥፍ":"Post New Course",       action: ()=>setShowUpload(true),      c:"text-brand-600 dark:text-brand-400" },
                    { icon: Award,     l: am?"ሲርቲፊኬት ስጥ":"Award Certificate",     action: ()=>setShowAwardCert(true),   c:"text-amber-600 dark:text-amber-400" },
                    { icon: BookOpen,  l: am?"ትምህርቶችን አስተዳድር":"Manage Courses",     action: ()=>setActiveTab("courses"),  c:"text-purple-600 dark:text-purple-400" },
                    { icon: Users,     l: am?"ተጠቃሚዎችን አስተዳድር":"Manage Users",       action: ()=>setActiveTab("users"),    c:"text-blue-600 dark:text-blue-400" },
                    { icon: Shield,    l: am?"ሚናዎችን ቀይር":"User Permissions",       action: ()=>setActiveTab("users"),    c:"text-emerald-600 dark:text-emerald-400" },
                    { icon: Home,      l: am?"ወደ ዋና ገጽ":"Public Catalog",         to: "/" },
                  ].map((a,i) => (
                    a.to
                      ? <Link key={i} to={a.to} className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition border border-slate-200/80 dark:border-slate-800"><Home className="h-4 w-4 text-slate-500"/><span className="truncate">{a.l}</span></Link>
                      : <button key={i} onClick={a.action} className="flex items-center gap-2.5 rounded-xl px-3.5 py-3 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition border border-slate-200/80 dark:border-slate-800 text-left"><a.icon className={`h-4 w-4 ${a.c}`}/><span className="truncate">{a.l}</span></button>
                  ))}
                </div>
              </motion.div>

              <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.3}} className="card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold text-base">{am ? "የቅርብ ጊዜ ሲርቲፊኬቶች" : "Recent Certificates"}</h2>
                  <button onClick={() => setActiveTab("certificates")} className="text-xs text-brand-600 hover:underline">
                    {am ? "ሁሉንም አሳይ" : "View all"}
                  </button>
                </div>
                {certificates.filter(c => c.certificateIssued).slice(0, 4).length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    <Award className="h-6 w-6 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                    {am ? "እስካሁን ምንም ሲርቲፊኬት አልተሰጠም" : "No certificates issued yet"}
                  </div>
                ) : (
                  certificates.filter(c => c.certificateIssued).slice(0, 4).map((c, i) => (
                    <div key={c._id || i} className="flex items-center gap-3 py-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-amber-500/10 text-amber-600">
                        <Award className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {[c.user?.firstName, c.user?.lastName].filter(Boolean).join(" ") || c.user?.email || "Student"}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{c.course?.title}</p>
                      </div>
                      <button
                        onClick={() => setSelectedCertificate({
                          studentName: [c.user?.firstName, c.user?.lastName].filter(Boolean).join(" ") || c.user?.email,
                          courseTitle: c.course?.title,
                          certificateId: c.certificateId,
                          issuedAt: c.certificateIssuedAt || c.completedAt,
                          instructorName: c.course?.instructor ? [c.course.instructor.firstName, c.course.instructor.lastName].filter(Boolean).join(" ") : "EduFlow Academy",
                          note: c.certificateNote,
                        })}
                        className="text-xs text-brand-600 font-medium hover:underline"
                      >
                        {am ? "እይ" : "View"}
                      </button>
                    </div>
                  ))
                )}
              </motion.div>
            </div>

            {/* Health bars */}
            <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.35}} className="card p-5">
              <h2 className="font-bold mb-4">{am?"የፕላትፎርም ጤና እና እድገት":"Platform Health & Analytics"}</h2>
              <div className="grid gap-5 sm:grid-cols-3">
                {[
                  { label: am?"ኮርስ ማጠናቀቂያ":"Course Completion Rate", value: 78, cls: "from-brand-500 to-brand-700" },
                  { label: am?"የሲርቲፊኬት ስኬት":"Verified Credentials Issued", value: 85, cls: "from-amber-400 to-amber-600" },
                  { label: am?"ተማሪ እርካታ":"Student Satisfaction",        value: 94, cls: "from-green-500 to-emerald-600" },
                ].map((item,i) => (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-500 dark:text-slate-400 font-medium">{item.label}</span><span className="font-bold">{item.value}%</span></div>
                    <div className="h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <motion.div initial={{width:0}} animate={{width:`${item.value}%`}} transition={{duration:0.9,delay:0.3+i*0.1,ease:"easeOut"}}
                        className={`h-full bg-gradient-to-r ${item.cls} rounded-full`}/>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* ═══ COURSES ═══ */}
        {activeTab === "courses" && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                <input className="input !pl-9" placeholder={am?"ትምህርቶችን ፈልግ...":"Search courses by title…"} value={courseSearch} onChange={(e)=>setCourseSearch(e.target.value)}/>
              </div>
              <select className="input !w-auto" value={courseStatusFilter} onChange={(e)=>setCourseStatusFilter(e.target.value)}>
                <option value="">{am?"ሁሉም ሁኔታዎች":"All statuses"}</option>
                <option value="draft">{am?"ረቂቅ (Draft)":"Draft"}</option>
                <option value="published">{am?"ታትሟል (Published)":"Published"}</option>
                <option value="archived">{am?"ቀዳሚ (Archived)":"Archived"}</option>
              </select>
              <Button onClick={() => setShowUpload(true)} size="sm" className="gap-1.5 shrink-0 shadow-soft">
                <Plus className="h-4 w-4"/>
                {am?"አዲስ ትምህርት ለጥፍ":"Post Course"}
              </Button>
            </div>

            <div className="card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="font-bold">{am?"ሁሉም ትምህርቶች እና መለጠፊያ":"Course Catalog & Management"}</h2>
                  <p className="text-xs text-slate-400">{am ? "ማንኛውንም ትምህርት ያርትዑ፣ ያትሙ ወይም ይሰርዙ" : "Administer all platform courses"}</p>
                </div>
                <span className="text-xs font-semibold bg-brand-50 dark:bg-brand-500/10 text-brand-700 dark:text-brand-300 px-3 py-1 rounded-full">
                  {coursesData?.total ?? courses.length} {am ? "ትምህርቶች" : "courses"}
                </span>
              </div>

              {coursesLoading ? <div className="p-4 space-y-3">{Array(6).fill(0).map((_,i)=><Skeleton key={i} className="h-14"/>)}</div>
              : courses.length === 0 ? (
                <div className="py-14 text-center">
                  <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3"/>
                  <p className="text-slate-500">{am?"ምንም ትምህርት አልተገኘም":"No courses found"}</p>
                  <Button onClick={() => setShowUpload(true)} className="mt-4 gap-1.5" size="sm">
                    <Plus className="h-4 w-4"/>{am?"አዲስ ትምህርት ፍጠር":"Post Course"}
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/60">
                      <tr>
                        {[am?"ትምህርቱ":"Course", am?"አስተማሪ":"Instructor", am?"ዋጋ":"Price", am?"ሁኔታ":"Status", am?"እርምጃ":"Actions"].map((h,i)=>(
                          <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((c) => (
                        <tr key={c._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {c.thumbnail ? (
                                <img src={c.thumbnail} alt="" className="h-10 w-14 rounded-lg object-cover shrink-0 border border-slate-200 dark:border-slate-700"/>
                              ) : (
                                <div className="h-10 w-14 rounded-lg bg-slate-100 dark:bg-slate-800 grid place-items-center shrink-0 border border-slate-200 dark:border-slate-700">
                                  <BookOpen className="h-4 w-4 text-slate-400"/>
                                </div>
                              )}
                              <div className="min-w-0">
                                <p className="font-semibold truncate max-w-[200px]">{c.title}</p>
                                <p className="text-xs text-slate-400 capitalize">{c.level||"—"}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-500 truncate max-w-[140px]">
                            {c.instructor?[c.instructor.firstName,c.instructor.lastName].filter(Boolean).join(" ")||c.instructor.email||"—":"Admin"}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {c.price===0 ? (
                              <span className="text-green-600 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full bg-green-50 dark:bg-green-500/10">
                                {am?"ነፃ":"Free"}
                              </span>
                            ) : formatPrice(c.effectivePrice??c.price,c.currency)}
                          </td>
                          <td className="px-4 py-3">
                            <select className="input !w-auto !h-7 !py-0 !text-xs" value={c.status}
                              disabled={changeCourseStatus.isPending}
                              onChange={(e) => changeCourseStatus.mutate({id:c._id,status:e.target.value})}>
                              <option value="draft">{am?"ረቂቅ (Draft)":"Draft"}</option>
                              <option value="published">{am?"ታትሟል (Published)":"Published"}</option>
                              <option value="archived">{am?"ቀዳሚ (Archived)":"Archived"}</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <button onClick={() => setEditingCourse(c)} className="btn-ghost !p-1.5 text-slate-500 hover:text-brand-600" title="Edit course">
                                <Edit3 className="h-4 w-4"/>
                              </button>
                              <Link to={`/courses/${c.slug}`} className="btn-ghost !p-1.5 text-slate-400 hover:text-brand-600" title="View catalog page">
                                <Eye className="h-4 w-4"/>
                              </Link>
                              <button onClick={() => setShowAwardCert(true)} className="btn-ghost !p-1.5 text-amber-600 hover:text-amber-700" title="Award certificate for this course">
                                <Award className="h-4 w-4"/>
                              </button>
                              <button onClick={() => setConfirm({type:"deleteCourse",id:c._id,name:c.title})} className="btn-ghost !p-1.5 text-red-400 hover:text-red-600" title="Delete">
                                <Trash2 className="h-4 w-4"/>
                              </button>
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

        {/* ═══ CERTIFICATES ═══ */}
        {activeTab === "certificates" && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className="space-y-4">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                <input className="input !pl-9" placeholder={am?"በተማሪ ስም፣ ኢሜይል ወይም ሲርቲፊኬት መለያ ፈልግ...":"Search student, course, or certificate ID…"} value={certSearch} onChange={(e)=>setCertSearch(e.target.value)}/>
              </div>
              <select className="input !w-auto" value={certStatusFilter} onChange={(e)=>setCertStatusFilter(e.target.value)}>
                <option value="">{am?"ሁሉም (All Records)":"All Records"}</option>
                <option value="issued">{am?"የተሰጡ (Issued Certs)":"Issued Certificates"}</option>
                <option value="pending">{am?"በሂደት ያሉ (In Progress)":"In Progress / Pending"}</option>
              </select>
              <Button onClick={() => setShowAwardCert(true)} size="sm" className="gap-1.5 shrink-0 bg-amber-600 hover:bg-amber-700 text-white shadow-soft">
                <Award className="h-4 w-4"/>
                {am?"ሲርቲፊኬት ስጥ (Award)":"Award Certificate"}
              </Button>
            </div>

            {/* Certificate Table */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <h2 className="font-bold flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    {am ? "የተማሪዎች ሲርቲፊኬት ዝርዝር" : "Student Credentials & Certificates"}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {am ? "ለተማሪዎች ሲርቲፊኬት ይስጡ፣ ያትሙ ወይም ይሰርዙ" : "Directly issue, inspect, and revoke authenticated certificates"}
                  </p>
                </div>
                <span className="text-xs font-semibold bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full">
                  {certificates.length} {am ? "መዝገቦች" : "records"}
                </span>
              </div>

              {certsLoading ? (
                <div className="p-4 space-y-3">{Array(5).fill(0).map((_,i)=><Skeleton key={i} className="h-14"/>)}</div>
              ) : certificates.length === 0 ? (
                <div className="py-16 text-center">
                  <Award className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                  <p className="text-base font-semibold text-slate-700 dark:text-slate-300">
                    {am ? "ምንም ሲርቲፊኬት አልተገኘም" : "No certificates or enrollments found"}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {am ? "ለተመዘገቡ ተማሪዎች ሲርቲፊኬት ለመስጠት 'ሲርቲፊኬት ስጥ' የሚለውን ይጫኑ።" : "Click 'Award Certificate' to give a verified credential to any student."}
                  </p>
                  <Button onClick={() => setShowAwardCert(true)} className="mt-4 gap-1.5 bg-amber-600 hover:bg-amber-700 text-white" size="sm">
                    <Award className="h-4 w-4" />
                    {am ? "ሲርቲፊኬት ስጥ" : "Award Certificate"}
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-800/60">
                      <tr>
                        {[am?"ተማሪ":"Student", am?"ትምህርት":"Course", am?"እድገት":"Progress", am?"ሲርቲፊኬት":"Certificate Status", am?"ቀን":"Date", am?"እርምጃ":"Actions"].map((h, i) => (
                          <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {certificates.map((item) => {
                        const studentName = [item.user?.firstName, item.user?.lastName].filter(Boolean).join(" ") || item.user?.email || "Student";
                        const courseTitle = item.course?.title || "Course";
                        const isIssued = item.certificateIssued;

                        return (
                          <tr key={item._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                            {/* Student */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2.5">
                                {item.user?.imageUrl ? (
                                  <img src={item.user.imageUrl} alt="" className="h-8 w-8 rounded-full object-cover shrink-0" />
                                ) : (
                                  <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-500/20 grid place-items-center text-brand-700 dark:text-brand-300 text-xs font-bold shrink-0">
                                    {(studentName[0] || "?").toUpperCase()}
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="font-semibold truncate max-w-[150px]">{studentName}</p>
                                  <p className="text-xs text-slate-400 truncate max-w-[150px]">{item.user?.email || "—"}</p>
                                </div>
                              </div>
                            </td>

                            {/* Course */}
                            <td className="px-4 py-3 max-w-[180px]">
                              <p className="font-medium truncate">{courseTitle}</p>
                              <span className="text-[11px] text-slate-400 capitalize">{item.course?.level || "Beginner"}</span>
                            </td>

                            {/* Progress */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${item.progressPercent >= 100 ? "bg-green-500" : "bg-brand-500"}`}
                                    style={{ width: `${item.progressPercent || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs font-semibold">{item.progressPercent || 0}%</span>
                              </div>
                            </td>

                            {/* Certificate Status Badge */}
                            <td className="px-4 py-3">
                              {isIssued ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300 border border-amber-200 dark:border-amber-500/30">
                                  <Award className="h-3.5 w-3.5 text-amber-500" />
                                  <span>{item.certificateId || "CERT-VERIFIED"}</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800">
                                  {am ? "አልተሰጠም" : "Not Issued"}
                                </span>
                              )}
                            </td>

                            {/* Date */}
                            <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                              {item.certificateIssuedAt ? new Date(item.certificateIssuedAt).toLocaleDateString() : (item.completedAt ? new Date(item.completedAt).toLocaleDateString() : "—")}
                            </td>

                            {/* Actions */}
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {isIssued ? (
                                  <>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setSelectedCertificate({
                                        studentName,
                                        courseTitle,
                                        certificateId: item.certificateId,
                                        issuedAt: item.certificateIssuedAt || item.completedAt,
                                        instructorName: item.course?.instructor ? [item.course.instructor.firstName, item.course.instructor.lastName].filter(Boolean).join(" ") : "EduFlow Academy",
                                        note: item.certificateNote,
                                      })}
                                      className="!py-1 !px-2.5 !text-xs gap-1 border-amber-300 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50"
                                    >
                                      <Printer className="h-3 w-3" />
                                      {am ? "እይ / አትም" : "View"}
                                    </Button>
                                    <button
                                      onClick={() => setConfirm({
                                        type: "revokeCert",
                                        id: item._id,
                                        name: `${studentName} - ${courseTitle}`,
                                      })}
                                      className="btn-ghost !p-1.5 text-red-400 hover:text-red-600"
                                      title="Revoke certificate"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => instantIssueCert.mutate({ enrollmentId: item._id })}
                                    disabled={instantIssueCert.isPending}
                                    className="!py-1 !px-2.5 !text-xs gap-1 bg-amber-600 hover:bg-amber-700 text-white"
                                  >
                                    <Award className="h-3 w-3" />
                                    {am ? "ሲርቲፊኬት ስጥ" : "Give Cert"}
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ═══ USERS ═══ */}
        {activeTab === "users" && (
          <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}>
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"/>
                <input className="input !pl-9" placeholder={am?"ስም ወይም ኢሜይል ፈልግ...":"Search name or email…"} value={userSearch} onChange={(e)=>setUserSearch(e.target.value)}/>
              </div>
              <select className="input !w-auto" value={userRoleFilter} onChange={(e)=>setUserRoleFilter(e.target.value)}>
                <option value="">{am?"ሁሉም ሚናዎች":"All roles"}</option>
                <option value="user">{am?"ተማሪ":"Learner"}</option>
                <option value="instructor">{am?"አስተማሪ":"Instructor"}</option>
                <option value="admin">{am?"አስተዳዳሪ":"Admin"}</option>
              </select>
              <Button onClick={() => setShowAwardCert(true)} size="sm" className="gap-1.5 shrink-0 bg-amber-600 hover:bg-amber-700 text-white">
                <Award className="h-4 w-4" />
                {am ? "ሲርቲፊኬት ስጥ" : "Award Cert"}
              </Button>
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
                      <tr>{[am?"ስም":"Name", am?"ኢሜይል":"Email", am?"ሚና":"Role", am?"ቀን":"Joined", am?"እርምጃ":"Actions"].map((h,i)=><th key={i} className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>)}</tr>
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
                            <select className="input !w-auto !h-7 !py-0 !text-xs font-medium" value={u.role}
                              disabled={String(u._id)===String(currentUser?._id)||changeRole.isPending}
                              onChange={(e) => changeRole.mutate({id:u._id,role:e.target.value})}>
                              <option value="user">{am?"ተማሪ (Learner)":"Learner"}</option>
                              <option value="instructor">{am?"አስተማሪ (Instructor)":"Instructor"}</option>
                              <option value="admin">{am?"አስተዳዳሪ (Admin)":"Admin"}</option>
                            </select>
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{u.createdAt?new Date(u.createdAt).toLocaleDateString():"—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setShowAwardCert(true)} className="btn-ghost !p-1.5 text-amber-600 hover:text-amber-700" title="Give certificate to this user">
                                <Award className="h-4 w-4" />
                              </button>
                              <button onClick={() => setConfirm({type:"deleteUser",id:u._id,name:u.firstName||u.email||"user"})}
                                disabled={String(u._id)===String(currentUser?._id)}
                                className="btn-ghost !p-1.5 text-red-400 hover:text-red-600 disabled:opacity-30">
                                <Trash2 className="h-4 w-4"/>
                              </button>
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
                { icon: Users,         label: am?"ጠቅላላ ተጠቃሚዎች":"Total Users",           value: s.totalUsers,       cls:"bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300" },
                { icon: BookOpen,      label: am?"ጠቅላላ ትምህርቶች":"Total Courses",          value: s.totalCourses,     cls:"bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400" },
                { icon: Activity,      label: am?"ምዝገባዎች":"Enrollments",                  value: s.totalEnrollments, cls:"bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400" },
                { icon: Award,         label: am?"የተሰጡ ሲርቲፊኬቶች":"Certificates Issued",    value: s.totalCertificates, cls:"bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400" },
              ].map((r,i) => (
                <motion.div key={i} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}} className="card p-5">
                  <div className={`grid h-11 w-11 place-items-center rounded-xl mb-3 ${r.cls}`}><r.icon className="h-5 w-5"/></div>
                  <p className="text-2xl font-bold">{r.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{r.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="card p-6">
              <h3 className="font-bold text-lg mb-2">{am?"የአካዳሚክ ማጠቃለያ ሪፖርት":"Academic Overview & Completion Status"}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                {am
                  ? "ሁሉም የኮርስ ምዝገባዎች እና የሲርቲፊኬት አሰጣጦች በስርዓቱ ውስጥ በቀጥታ ይመዘገባሉ። አስተዳዳሪው በማንኛውም ጊዜ አዲስ ሲርቲፊኬት መስጠት ወይም ያለውን ማየት ይችላል።"
                  : "All course enrollments, completion records, and certificate credentials are electronically tracked and verified. Administrators have full autonomy to post courses, issue credentials, and administer students."}
              </p>
              <div className="flex gap-2">
                <Button onClick={() => setActiveTab("certificates")} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white gap-1.5">
                  <Award className="h-4 w-4" />
                  {am ? "ሲርቲፊኬቶችን አስስ" : "Explore Certificates"}
                </Button>
                <Button onClick={() => setActiveTab("courses")} variant="outline" size="sm" className="gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  {am ? "ትምህርቶችን አስስ" : "Browse Courses"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </section>
    </>
  );
}
