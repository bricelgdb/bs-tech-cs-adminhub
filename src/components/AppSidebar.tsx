import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Box, BarChart3, Shield, Key, BookOpen,
  ChevronLeft, ChevronRight, LogOut,
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { rolePermissions } from "@/data/users";
import { useAuth } from "@/providers/AuthProvider";
import logoImg from "@/assets/bestseller-logo.png";

const navSections = [
  {
    label: "Platform",
    items: [
      { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
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
      { to: "/resources", icon: BookOpen, label: "Links" },
    ],
  },
];

export function AppSidebar() {
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { roles } = useAuth();
  const location = useLocation();
  const allowed = Array.from(new Set(roles.flatMap((r) => rolePermissions[r] ?? [])));

  return (
    <aside
      className={`flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-200 ${sidebarCollapsed ? "w-14" : "w-[220px]"} shrink-0 h-screen sticky top-0`}
    >
      <div className="flex items-center justify-center px-3 h-[52px] border-b border-sidebar-border">
        <img src={logoImg} alt="BESTSELLER TECH" className={`${sidebarCollapsed ? "h-6" : "h-14"} w-auto shrink-0`} />
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {navSections.map(section => (
          <div key={section.label} className="mb-4">
            {!sidebarCollapsed && (
              <div className="px-4 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-white">{section.label}</div>
            )}
            {section.items.map(item => {
              const isAllowed = allowed.some(p => {
                if (p === "/") return item.to === "/";
                return item.to.startsWith(p);
              });
              if (!isAllowed) return null;

              const isActive = location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-md text-sm transition-colors ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground border-l-2 border-sidebar-primary"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent border-l-2 border-transparent"
                  }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full bg-sidebar-accent px-1.5 py-0.5 text-[10px] font-medium text-sidebar-foreground/50">
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

      <div className="border-t border-sidebar-border p-3">
        <button onClick={toggleSidebar} className="flex w-full items-center justify-center rounded-md p-1.5 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent">
          {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
        {!sidebarCollapsed && (
          <SignOutButton />
        )}
      </div>
    </aside>
  );
}

function SignOutButton() {
  const { signOut } = useAuth();
  return (
    <button
      onClick={async () => { await signOut(); window.location.href = "/login"; }}
      className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-sidebar-foreground/50 hover:text-sidebar-foreground w-full transition-colors"
    >
      <LogOut className="h-3 w-3" />
      Sign out
    </button>
  );
}

