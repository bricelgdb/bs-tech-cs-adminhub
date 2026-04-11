export interface SavedReport {
  id: string;
  name: string;
  type: "Utilisation" | "Cost" | "Access" | "Compliance";
  scope: string;
  lastRun: string;
  schedule: string | null;
}

export const savedReports: SavedReport[] = [
  { id: "rpt-1", name: "Monthly Licence Utilisation", type: "Utilisation", scope: "All products", lastRun: "2026-04-01", schedule: "1st of month" },
  { id: "rpt-2", name: "Q1 2026 Cost Summary", type: "Cost", scope: "All products", lastRun: "2026-04-01", schedule: null },
  { id: "rpt-3", name: "Adobe CC Seat Allocation", type: "Access", scope: "Adobe Creative Cloud Suite", lastRun: "2026-03-15", schedule: "15th of month" },
  { id: "rpt-4", name: "Unused Seat Audit", type: "Compliance", scope: "All products", lastRun: "2026-04-07", schedule: "Weekly (Mon)" },
];
