import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Box, BarChart3, Shield, Key, BookOpen,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { rolePermissions } from "@/data/users";
import logoImg from "@/assets/logo.png";

const navSections = [
  {
    label: "Platform",
    items: [
      { to: "/", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/products", icon: Box, label: "Products", badge: "8" },
      { to: "/reports", icon: BarChart3, label: "Reports" },
    ],
  },
  {
    label: "Governance",
    items: [
      { to: "/access", icon: Shield, label: "Access", badge: "3" },
      { to: "/licences", icon: Key, label: "Licences" },
    ],
  },
  {
    label: "Team",
    items: [
      { to: "/resources", icon: BookOpen, label: "Resources" },
    ],
  },
];

export function AppSidebar() {
  const { sidebarCollapsed, toggleSidebar, activeRole } = useAppStore();
  const location = useLocation();
  const allowed = rolePermissions[activeRole];

  return (
    <aside
      className={`flex flex-col border-r border-border bg-card transition-all duration-200 ${sidebarCollapsed ? "w-14" : "w-[220px]"} shrink-0 h-screen sticky top-0`}
    >
      <div className="flex items-center gap-2 px-3 h-[52px] border-b border-border">
        <img src={logoImg} alt="TECH Creative Solutions Admin Hub" className="h-8 shrink-0" />
        {!sidebarCollapsed && (
          <span className="text-xs font-bold text-foreground truncate leading-tight">
            TECH Creative Solutions<br />Admin Hub
          </span>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {navSections.map(section => (
          <div key={section.label} className="mb-4">
            {!sidebarCollapsed && (
              <div className="section-label px-4 mb-1.5">{section.label}</div>
            )}
            {section.items.map(item => {
              const isAllowed = allowed.some(p => {
                if (p === "/") return item.to === "/";
                return item.to.startsWith(p);
              });
              if (!isAllowed) return null;

              const isActive = item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary border-l-2 border-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-elevated border-l-2 border-transparent"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <button onClick={toggleSidebar} className="flex w-full items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-surface-elevated">
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        {!sidebarCollapsed && (
          <div className="mt-2 text-[10px] text-muted-foreground text-center">
            v1.0.0 · © BESTSELLER TECH
          </div>
        )}
      </div>
    </aside>
  );
}
