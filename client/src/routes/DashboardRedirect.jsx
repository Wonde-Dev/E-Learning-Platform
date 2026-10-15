import { Navigate } from "react-router-dom";
import { useUser } from "@/hooks/useUser";
import { useAuth } from "@clerk/clerk-react";

/**
 * Redirects authenticated users to the correct dashboard based on their role.
 * admin → /admin, instructor → /instructor, default → /dashboard
 */
export default function DashboardRedirect() {
  const { isSignedIn, isLoaded } = useAuth();
  const { data: user, isLoading } = useUser();

  if (!isLoaded || (isSignedIn && isLoading)) {
    return (
      <div className="grid place-items-center min-h-[60vh]">
        <div className="h-10 w-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) return <Navigate to="/login" replace />;

  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  if (user?.role === "instructor") return <Navigate to="/instructor" replace />;
  return <Navigate to="/dashboard" replace />;
}
