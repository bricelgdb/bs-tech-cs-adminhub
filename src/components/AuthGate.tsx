import { Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return null;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
}
