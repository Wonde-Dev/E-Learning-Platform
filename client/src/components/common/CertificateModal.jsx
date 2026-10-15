import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  Download,
  Printer,
  CheckCircle2,
  Copy,
  Check,
  X,
  GraduationCap,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function CertificateModal({ certificate, onClose }) {
  const { i18n } = useTranslation();
  const am = i18n.language === "am";
  const [copied, setCopied] = useState(false);
  const certRef = useRef(null);

  if (!certificate) return null;

  const {
    studentName = "Learner",
    courseTitle = "Course",
    certificateId = "EDU-CERT-VERIFIED",
    issuedAt = new Date(),
    instructorName = "EduFlow Academy",
    note = "",
  } = certificate;

  const formattedDate = new Date(issuedAt).toLocaleDateString(
    am ? "am-ET" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const handleCopyId = () => {
    navigator.clipboard.writeText(certificateId);
    setCopied(true);
    toast.success(am ? "የሲርቲፊኬት መለያ ተቀድቷል" : "Certificate ID copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="relative w-full max-w-4xl my-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden print:border-none print:shadow-none print:m-0 print:w-full print:max-w-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top action bar (hidden during print) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 print:hidden">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {am ? "ኦፊሴላዊ የሙያ ሲርቲፊኬት" : "Official Verified Certificate"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  ID: {certificateId}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyId}
                className="btn-ghost !py-1.5 !px-3 text-xs gap-1.5 border border-slate-200 dark:border-slate-700"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span>{copied ? (am ? "ተቀድቷል" : "Copied") : (am ? "መለያ ቅዳ" : "Copy ID")}</span>
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="btn-primary !py-1.5 !px-3.5 text-xs gap-1.5 bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>{am ? "አትም / PDF" : "Print / PDF"}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-ghost !p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Certificate Body Container */}
          <div className="p-4 sm:p-8 overflow-x-auto">
            <div
              ref={certRef}
              id="printable-certificate"
              className="relative mx-auto w-full max-w-3xl aspect-[1.414/1] bg-gradient-to-br from-amber-50/40 via-white to-amber-50/20 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900 border-8 border-double border-amber-600/30 dark:border-amber-500/30 p-8 sm:p-12 flex flex-col justify-between rounded-xl shadow-inner select-text print:shadow-none print:border-amber-600"
            >
              {/* Corner decorative accents */}
              <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-amber-600/70 pointer-events-none" />
              <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-amber-600/70 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-amber-600/70 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-amber-600/70 pointer-events-none" />

              {/* Background watermark badge */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.04]">
                <GraduationCap className="w-96 h-96 text-slate-900 dark:text-white" />
              </div>

              {/* Certificate Header */}
              <div className="text-center relative z-10">
                <div className="inline-flex items-center gap-2 mb-2">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-600 text-white shadow-md">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <span className="text-xl font-black tracking-wider uppercase font-display text-slate-900 dark:text-white">
                    EduFlow Academy
                  </span>
                </div>
                <p className="text-[11px] sm:text-xs font-semibold tracking-widest uppercase text-amber-700 dark:text-amber-400 mt-1">
                  {am ? "የልህቀት እና የቀጣይ ትምህርት አካዳሚ" : "Center for Professional & Technical Excellence"}
                </p>
                <div className="h-0.5 w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent my-3" />
                <h1 className="text-xl sm:text-3xl font-extrabold uppercase tracking-wide text-slate-800 dark:text-slate-100 font-serif">
                  {am ? "የማጠናቀቂያ የምስክር ወረቀት" : "Certificate of Completion"}
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {am
                    ? "ይህ ሲርቲፊኬት በኩራት የተሰጠው ለ:"
                    : "This credential is proudly presented to:"}
                </p>
              </div>

              {/* Student Name */}
              <div className="text-center my-4 sm:my-6 relative z-10">
                <h2 className="text-2xl sm:text-4xl font-extrabold text-amber-900 dark:text-amber-300 font-serif tracking-tight underline decoration-amber-400/50 decoration-2 underline-offset-8">
                  {studentName}
                </h2>
                {note && (
                  <p className="mt-2 text-xs font-medium text-amber-700 dark:text-amber-400 italic">
                    ★ {note} ★
                  </p>
                )}
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto mt-4 leading-relaxed">
                  {am
                    ? "የሚከተለውን የሙያ ትምህርት ሥርዓተ ትምህርት በተሳካ ሁኔታ አጠናቀዋል እና ብቃታቸውን አረጋግጠዋል:"
                    : "for successfully fulfilling all curriculum requirements, evaluations, and practical demonstrations of:"}
                </p>
                <h3 className="text-lg sm:text-2xl font-bold text-brand-700 dark:text-brand-300 mt-2 font-display">
                  {courseTitle}
                </h3>
              </div>

              {/* Signatures & Seal Footer */}
              <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 relative z-10 flex items-end justify-between gap-4">
                {/* Director Signature */}
                <div className="text-center flex-1 max-w-[180px]">
                  <div className="h-10 flex items-center justify-center font-serif italic text-lg text-slate-800 dark:text-slate-200 select-none">
                    EduFlow Board
                  </div>
                  <div className="border-t border-slate-400 dark:border-slate-600 pt-1">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {am ? "የአካዳሚክ አስተዳዳሪ" : "Academic Director"}
                    </p>
                    <p className="text-[10px] text-slate-400">EduFlow Platform</p>
                  </div>
                </div>

                {/* Golden Official Seal */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="relative grid h-16 w-16 sm:h-20 sm:w-20 place-items-center rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-amber-300 text-white shadow-lg border-2 border-amber-200/60 p-2">
                    <div className="w-full h-full rounded-full border border-dashed border-amber-800/40 flex flex-col items-center justify-center text-center">
                      <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-amber-950 mb-0.5" />
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-tighter text-amber-950 leading-none">
                        VERIFIED
                      </span>
                      <span className="text-[6px] sm:text-[7px] font-semibold text-amber-900 leading-none mt-0.5">
                        CREDENTIAL
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 dark:text-slate-500 mt-1">
                    {certificateId}
                  </span>
                </div>

                {/* Instructor Signature */}
                <div className="text-center flex-1 max-w-[180px]">
                  <div className="h-10 flex items-center justify-center font-serif italic text-lg text-slate-800 dark:text-slate-200 select-none">
                    {instructorName}
                  </div>
                  <div className="border-t border-slate-400 dark:border-slate-600 pt-1">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {am ? "ዋና አስተማሪ" : "Course Instructor"}
                    </p>
                    <p className="text-[10px] text-slate-400">{formattedDate}</p>
                  </div>
                </div>
              </div>

              {/* Bottom security strip */}
              <div className="mt-4 pt-2 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3 text-green-500" />
                  {am ? "በዲጂታል ፊርማ የተረጋገጠ" : "Digitally Authenticated"}
                </span>
                <span>EduFlow Academic Verification ID: {certificateId}</span>
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
