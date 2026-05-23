import { useLocation } from "react-router-dom";
import { Bell, ChevronRight, LogOut } from "lucide-react";
import { useProducts } from "@/hooks/useDataHooks";
import { useAuth } from "@/providers/AuthProvider";

function useBreadcrumbs(pathname: string, productName?: (id: string) => string | undefined) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return [{ label: "Dashboard" }];
  const crumbs: { label: string; path?: string }[] = [];
  const labelMap: Record<string, string> = {
    products: "Products", reports: "Reports", access: "Access & Permissions",
    licences: "Licence Governance", resources: "Team Resources",
  };

  parts.forEach((part, i) => {
    const path = "/" + parts.slice(0, i + 1).join("/");
    if (labelMap[part]) {
      crumbs.push({ label: labelMap[part], path });
    } else {
      const name = productName?.(part);
      crumbs.push({ label: name ?? part.charAt(0).toUpperCase() + part.slice(1), path });
    }
  });
  return crumbs;
}

export function AppHeader() {
  const { profile, signOut } = useAuth();
  const { data: products } = useProducts();
  const location = useLocation();
  const breadcrumbs = useBreadcrumbs(location.pathname, (id) => products?.find((p) => p.id === id)?.name);

  const initials = profile?.initials || profile?.email?.[0]?.toUpperCase() || "U";
  const displayName = profile?.name || profile?.email || "";

  return (
    <header className="flex h-[52px] items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-1.5 text-sm">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
            <span className={i === breadcrumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground"}>
              {crumb.label}
            </span>
          </span>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full border border-border px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
          TECH CREATIVE SOLUTIONS
        </span>
        <button className="relative text-muted-foreground hover:text-foreground transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-semantic-red" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
            {initials}
          </div>
          <span className="text-xs text-foreground hidden xl:block">{displayName}</span>
        </div>
        <button
          onClick={signOut}
          title="Sign out"
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
