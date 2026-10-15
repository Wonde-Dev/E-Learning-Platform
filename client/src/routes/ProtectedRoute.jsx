import { useAuth } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "@/hooks/useUser";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoaded, isSignedIn } = useAuth();
  const { data: user, isLoading: userLoading } = useUser();
  const location = useLocation();

  if (!isLoaded || (isSignedIn && userLoading)) {
    return (
      <div className="grid place-items-center min-h-[60vh]">
        <div className="h-10 w-10 rounded-full border-4 border-brand-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect non-admins away from admin routes
    if (requiredRole === "admin") {
      return <Navigate to="/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
