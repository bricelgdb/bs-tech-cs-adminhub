import { Navigate } from "react-router-dom";
import { useAppStore } from "@/store/appStore";
import { rolePermissions } from "@/data/users";
import { ShieldX } from "lucide-react";
import { Link } from "react-router-dom";

interface RouteGuardProps {
  allowedPaths: string[];
  children: React.ReactNode;
}

export function RouteGuard({ allowedPaths, children }: RouteGuardProps) {
  const { activeRole } = useAppStore();
  const allowed = rolePermissions[activeRole];
  const hasAccess = allowedPaths.some(path => allowed.some(a => {
    if (a === "/") return path === "/";
    return path.startsWith(a);
  }));

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <ShieldX className="h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-bold text-foreground">You don't have access to this page</h2>
        <p className="mt-1 text-sm text-muted-foreground">Your current role ({activeRole}) doesn't have permission to view this content.</p>
        <Link to="/" className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
          Go to Dashboard
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
