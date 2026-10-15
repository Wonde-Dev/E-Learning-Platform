import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  CreditCard,
  Banknote,
  Wallet,
  Shield,
  Lock,
  ShoppingCart,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useCourse } from "@/hooks/useCourses";
import { useEnroll, useMyEnrollments } from "@/hooks/useEnrollments";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatPrice } from "@/lib/utils";

const steps = [
  { id: 1, label: "Payment method", icon: CreditCard },
  { id: 2, label: "Review & confirm", icon: ShoppingCart },
  { id: 3, label: "Success", icon: CheckCircle2 },
];

const paymentMethods = [
  { id: "card", label: "Credit / Debit Card", icon: CreditCard, color: "bg-blue-500" },
  { id: "paypal", label: "PayPal", icon: Wallet, color: "bg-sky-500" },
  { id: "apple", label: "Bank Transfer", icon: Banknote, color: "bg-slate-800 dark:bg-slate-200" },
];

export default function Checkout() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: course, isLoading } = useCourse(slug);
  const { data: enrollments = [] } = useMyEnrollments();
  const enroll = useEnroll();
  const { isSignedIn } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvc: "" });

  const isEnrolled = enrollments.some(
    (e) => e.course?._id === course?._id || e.course?.slug === course?.slug
  );

  if (isLoading)
    return (
      <section className="container py-10 space-y-6">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="aspect-video w-full" />
      </section>
    );

  if (!course) return null;

  const price = course.discountPrice > 0 ? course.discountPrice : course.price;
  const original = course.discountPrice > 0 ? course.price : 0;

  const handleEnroll = async () => {
    if (!isSignedIn) return navigate("/");
    await enroll.mutateAsync(course._id);
    setStep(3);
  };

  return (
    <section className="container py-10 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Step header */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`grid h-9 w-9 place-items-center rounded-full transition-all duration-200 ${
                  step === s.id
                    ? "bg-brand-600 text-white shadow-lg shadow-brand-500/30"
                    : step > s.id
                    ? "bg-green-500 text-white"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                }`}
              >
                <s.icon className="h-4 w-4" />
              </motion.div>
              <span
                className={`text-sm font-medium ${
                  step === s.id
                    ? "text-brand-700 dark:text-brand-300"
                    : "text-slate-500"
                }`}
              >
                {s.label}
              </span>
              {i < steps.length - 1 && (
                <div className="w-12 h-px bg-slate-200 dark:bg-slate-800" />
              )}
            </motion.div>
          ))}
        </div>

        <div className="card p-6 space-y-6">
          {/* Course summary */}
          <div className="flex items-start gap-4 pb-4 border-b border-slate-200/70 dark:border-slate-800">
            <div className="aspect-video w-24 shrink-0 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold">{course.title}</h2>
              <p className="text-sm text-slate-500">
                By {course.instructor?.firstName} {course.instructor?.lastName}
              </p>
              <div className="mt-2 flex items-baseline gap-2">
                {price === 0 ? (
                  <span className="text-xl font-bold text-green-600">Free</span>
                ) : (
                  <>
                    <span className="text-xl font-bold">
                      {formatPrice(price, course.currency)}
                    </span>
                    {original > 0 && (
                      <span className="text-sm text-slate-400 line-through">
                        {formatPrice(original, course.currency)}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Step 1: Payment method */}
          <AnimatePresence>
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold mb-4">Choose payment method</h3>

                <div className="grid gap-3">
                  {paymentMethods.map((pm) => (
                    <motion.label
                      key={pm.id}
                      whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedPayment === pm.id
                          ? "border-brand-600 bg-brand-50 dark:bg-brand-500/5"
                          : "border-slate-200 dark:border-slate-800 hover:border-brand-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={pm.id}
                        checked={selectedPayment === pm.id}
                        onChange={() => setSelectedPayment(pm.id)}
                        className="sr-only"
                      />
                      <motion.span
                        whileHover={{ rotate: 5 }}
                        className={`grid h-10 w-10 place-items-center rounded-lg text-white ${pm.color}`}
                      >
                        <pm.icon className="h-5 w-5" />
                      </motion.span>
                      <span className="font-medium">{pm.label}</span>
                      {selectedPayment === pm.id && (
                        <motion.div
                          layoutId="check"
                          className="ml-auto text-green-500"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                        </motion.div>
                      )}
                    </motion.label>
                  ))}
                </div>

                {selectedPayment === "card" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3 pt-2"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        placeholder=" "
                        value={card.number}
                        onChange={(e) =>
                          setCard({ ...card, number: e.target.value })
                        }
                        className="input peer"
                      />
                      <label className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 peer-focus:top-0 peer-focus:text-xs peer-focus:text-brand-500 transition-all pointer-events-none">
                        Card number
                      </label>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={card.expiry}
                        onChange={(e) =>
                          setCard({ ...card, expiry: e.target.value })
                        }
                        className="input"
                      />
                      <input
                        type="text"
                        placeholder="CVC"
                        value={card.cvc}
                        onChange={(e) =>
                          setCard({ ...card, cvc: e.target.value })
                        }
                        className="input"
                      />
                    </div>
                  </motion.div>
                )}

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                  <Lock className="h-3.5 w-3.5" />
                  Your payment information is securely encrypted
                </div>
              </motion.div>
            )}

            {/* Step 2: Review */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h3 className="text-lg font-semibold mb-4">Review order</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-slate-200/70 dark:border-slate-800">
                    <span className="text-slate-600 dark:text-slate-300">
                      Subtotal
                    </span>
                    <span>{formatPrice(course.price, course.currency)}</span>
                  </div>
                  {original > 0 && (
                    <div className="flex items-center justify-between py-2 border-b border-slate-200/70 dark:border-slate-800">
                      <span className="text-slate-600 dark:text-slate-300">
                        Discount
                      </span>
                      <span className="text-green-600">
                        -{formatPrice(original - price, course.currency)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2 font-bold text-lg">
                    <span>Total</span>
                    <span className="text-brand-600">
                      {formatPrice(price, course.currency)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Shield className="h-4 w-4" />
                    Secure checkout with SSL encryption
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", damping: 15 }}
                  className="grid h-20 w-20 place-items-center rounded-full bg-green-50 text-green-600 mx-auto mb-4"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">
                  You're enrolled!
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-8">
                  Start learning right away. Your certificate will be issued upon
                  completion.
                </p>
                <div className="flex gap-3 justify-center">
                  <Button as={Link} to={`/learn/${course.slug}`}>
                    Go to course
                  </Button>
                  <Button as={Link} to="/dashboard" variant="outline">
                    Dashboard
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          {step < 3 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between pt-4 border-t border-slate-200/70 dark:border-slate-800"
            >
              <Button
                variant="outline"
                size="sm"
                as={Link}
                to={`/courses/${course.slug}`}
              >
                <ArrowLeft className="h-4 w-4" /> Back to course
              </Button>

              {step === 1 && (
                <Button
                  size="sm"
                  onClick={() => setStep(2)}
                  disabled={price === 0 && !selectedPayment}
                >
                  Continue to review
                </Button>
              )}
              {step === 2 && (
                <Button
                  size="sm"
                  onClick={handleEnroll}
                  disabled={enroll.isPending}
                >
                  {enroll.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingCart className="h-4 w-4" />
                  )}
                  {enroll.isPending ? "Processing…" : "Complete enrollment"}
                </Button>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
