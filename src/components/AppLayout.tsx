import { Outlet } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1440px] px-7 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
