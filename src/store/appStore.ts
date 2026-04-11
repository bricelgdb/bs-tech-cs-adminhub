import { create } from "zustand";
import type { AppRole } from "@/data/users";
import { currentUser } from "@/data/users";

interface AppStore {
  activeRole: AppRole;
  setActiveRole: (role: AppRole) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
  userName: string;
  userInitials: string;
}

export const useAppStore = create<AppStore>((set) => ({
  activeRole: currentUser.role,
  setActiveRole: (role) => set({ activeRole: role }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
  userName: currentUser.name,
  userInitials: currentUser.initials,
}));
