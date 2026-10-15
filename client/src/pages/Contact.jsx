import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MapPin, Clock, Send, Loader2, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "react-hot-toast";

export default function Contact() {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    setSubmitted(true);
    toast.success(t("contact.form.success"));
    reset();
    setTimeout(() => setSubmitted(false), 3000);
  };

  const infoItems = [
    {
      icon: Mail,
      label: t("contact.info.email"),
      desc: t("contact.info.emailDesc"),
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-500/10"
    },
    {
      icon: MapPin,
      label: t("contact.info.location"),
      desc: t("contact.info.locationDesc"),
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-500/10"
    },
    {
      icon: Clock,
      label: t("contact.info.hours"),
      desc: t("contact.info.hoursDesc"),
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-500/10"
    }
  ];

  return (
    <section className="container py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 badge bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-300 mb-4"
          >
            <Mail className="h-3.5 w-3.5" />
            {t("contact.title")}
          </motion.span>
          <h1 className="text-4xl md:text-5xl font-extrabold font-display">
            {t("contact.subtitle")}
          </h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="card p-8 space-y-6"
          >
            <h2 className="text-2xl font-bold">{t("contact.form.title")}</h2>
            <p className="text-slate-500 dark:text-slate-400">
              {t("contact.form.subtitle")}
            </p>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input
                      label={t("contact.form.name")}
                      error={errors.name?.message}
                      {...register("name", { required: t("common.required") })}
                    />
                    <Input
                      type="email"
                      label={t("contact.form.email")}
                      error={errors.email?.message}
                      {...register("email", {
                        required: t("common.required"),
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: t("contact.form.invalidEmail")
                        }
                      })}
                    />
                  </div>
                  <Input
                    label={t("contact.form.subject")}
                    error={errors.subject?.message}
                    {...register("subject", { required: t("common.required") })}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      {t("contact.form.message")}
                    </label>
                    <textarea
                      rows={5}
                      className="input resize-y"
                      {...register("message", { required: t("common.required") })}
                    />
                    {errors.message && (
                      <p className="mt-1.5 text-xs text-red-500">{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {t("contact.form.submitting")}
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t("contact.form.submit")}
                      </>
                    )}
                  </Button>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", damping: 15 }}
                    className="grid h-16 w-16 place-items-center rounded-full bg-green-50 text-green-600 mx-auto mb-4"
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">
                    {t("contact.form.success")}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400">
                    {t("contact.form.successDesc")}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6">
                {t("contact.info.title")}
              </h2>
              <div className="space-y-6">
                {infoItems.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className={`grid h-12 w-12 place-items-center rounded-xl ${item.bg}`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} />
                    </div>
                    <div>
                      <p className="font-semibold">{item.label}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Social/Additional Info */}
            <div className="card p-8">
              <h3 className="text-lg font-semibold mb-4">
                {t("contact.social.title")}
              </h3>
              <div className="flex gap-4">
                {["Twitter", "LinkedIn", "GitHub", "YouTube"].map((social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-brand-500 hover:text-white transition-all"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                  >
                    {social[0]}
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}