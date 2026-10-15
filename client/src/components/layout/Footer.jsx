import { GraduationCap, BookOpen, Home, Info, Mail, Shield, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@clerk/clerk-react";

export default function Footer() {
  const { t, i18n } = useTranslation();
  const { isSignedIn } = useAuth();
  const { data: user } = useUser();
  const year = new Date().getFullYear();
  const am = i18n.language === "am";

  // Role-aware dashboard link
  const dashHref =
    user?.role === "admin"       ? "/admin"
    : user?.role === "instructor" ? "/instructor"
    : "/dashboard";

  const dashLabel =
    user?.role === "admin"       ? (am ? "አስተዳዳሪ ዳሽቦርድ" : "Admin Dashboard")
    : user?.role === "instructor" ? (am ? "አስተማሪ ዳሽቦርድ" : "Instructor Dashboard")
    : (am ? "የእኔ ዳሽቦርድ" : "My Dashboard");

  const columns = [
    {
      title: am ? "ዋና ገጾች" : "Explore",
      items: [
        { icon: Home,     label: am ? "መነሻ"       : "Home",       to: "/"        },
        { icon: BookOpen, label: am ? "ትምህርቶች"   : "Courses",    to: "/courses" },
        { icon: Info,     label: am ? "ስለ እኛ"     : "About",      to: "/courses" },
        { icon: Mail,     label: am ? "አግኙን"      : "Contact",    to: "/contact" },
      ],
    },
    {
      title: am ? "ትምህርት" : "Learning",
      items: [
        { label: am ? "ሁሉም ትምህርቶች"   : "All Courses",        to: "/courses"                          },
        { label: am ? "ሲርቲፊኬቶች"      : "Certificates",       to: "/courses"                          },
        { label: am ? "አስተማሪ ሁን"      : "Become Instructor",  to: isSignedIn ? "/instructor" : "/login" },
        ...(isSignedIn ? [{ label: dashLabel, to: dashHref }] : []),
      ],
    },
    {
      title: am ? "ኩባንያ" : "Company",
      items: [
        { label: am ? "ስለ EduFlow"  : "About EduFlow",  to: "/courses" },
        { label: am ? "አግኙን"       : "Contact Us",      to: "/contact" },
        { label: am ? "የግል ፖሊሲ"  : "Privacy Policy",   to: "/courses" },
        { label: am ? "የአገልግሎት ውሎች" : "Terms of Service", to: "/courses" },
      ],
    },
  ];

  return (
    <footer className="border-t border-slate-200/70 dark:border-slate-800 bg-white dark:bg-slate-950">
      <div className="container py-12 grid gap-10 sm:grid-cols-2 md:grid-cols-4">
        {/* Brand column */}
        <div className="sm:col-span-2 md:col-span-1">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white shadow-soft group-hover:scale-105 transition">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-lg font-extrabold font-display">EduFlow</span>
          </Link>

          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[220px]">
            {am
              ? "ክህሎቶችን ያዳብሩ፣ ሲርቲፊኬት ያግኙ እና ሙያዎን ያሻሽሉ።"
              : "Build skills, earn certificates, and advance your career with expert-led courses."}
          </p>

          {/* Auth CTA */}
          <div className="mt-5 flex flex-col gap-2">
            {!isSignedIn ? (
              <>
                <Link to="/login" className="btn-primary !py-2 !px-4 !text-sm w-fit">
                  {am ? "ጀምር — ነፃ ነው" : "Get started — free"}
                </Link>
                <Link to="/courses" className="btn-ghost !py-1.5 !px-3 !text-sm w-fit text-slate-500">
                  {am ? "ትምህርቶችን ፈልግ" : "Browse courses"}
                </Link>
              </>
            ) : (
              <Link to={dashHref} className="btn-outline !py-2 !px-4 !text-sm w-fit gap-1.5">
                {user?.role === "admin"  && <Shield className="h-3.5 w-3.5" />}
                {user?.role !== "admin" && <Users className="h-3.5 w-3.5" />}
                {dashLabel}
              </Link>
            )}
          </div>
        </div>

        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.items.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
                  >
                    {item.icon && <item.icon className="h-3.5 w-3.5 shrink-0" />}
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-200/70 dark:border-slate-800">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
          <span>{t("footer.copyright", { year })}</span>
          <div className="flex items-center gap-4">
            <Link to="/courses" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
              {am ? "የግል ፖሊሲ" : "Privacy"}
            </Link>
            <Link to="/courses" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
              {am ? "ውሎች" : "Terms"}
            </Link>
            <span>{t("footer.builtWith")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
