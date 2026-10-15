import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { configureApiAuth } from "@/lib/api";
import AppRoutes from "@/routes/AppRoutes";
import { useAuthSync } from "@/hooks/useAuthSync";

export default function App() {
  const { getToken } = useAuth();

  // Attach Clerk token getter to axios on mount
  useEffect(() => {
    configureApiAuth(() => getToken());
  }, [getToken]);

  // Sync user into MongoDB on login
  useAuthSync();

  return <AppRoutes />;
}