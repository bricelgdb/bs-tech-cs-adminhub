import { useState } from "react";
import { useReports, useProducts } from "@/hooks/useDataHooks";
import { DataTable, exportToCsv } from "@/components/DataTable";
import { Modal } from "@/components/Modal";
import { type ColumnDef } from "@tanstack/react-table";
import type { SavedReport } from "@/data/reports";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { domainColorMap } from "@/data/products";

const columns: ColumnDef<SavedReport, any>[] = [
  { accessorKey: "name", header: "Report Name" },
  { accessorKey: "type", header: "Type" },
  { accessorKey: "scope", header: "Scope" },
  { accessorKey: "lastRun", header: "Last Run" },
  { accessorKey: "schedule", header: "Schedule", cell: ({ getValue }) => getValue() ?? <span className="text-muted-foreground">Manual</span> },
  {
    id: "actions",
    header: "",
    cell: () => (
      <div className="flex gap-2">
        <button className="text-xs text-primary hover:underline">Run</button>
        <button className="text-xs text-muted-foreground hover:underline">Edit</button>
      </div>
    ),
  },
];

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports();
  const { data: products } = useProducts();
  const [newReportOpen, setNewReportOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const utilisationData = products?.map(p => ({
    name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name,
    utilisation: p.utilisation,
    fill: p.utilisation >= 80 ? "#22c77a" : p.utilisation >= 60 ? "#f5a623" : "#ff4d4d",
  })).sort((a, b) => b.utilisation - a.utilisation) ?? [];

  const domainSpend: Record<string, number> = {};
  products?.forEach(p => {
    p.domain.forEach(d => { domainSpend[d] = (domainSpend[d] ?? 0) + p.costMonthly; });
  });
  const spendData = Object.entries(domainSpend).map(([domain, spend]) => ({
    domain, spend, fill: domainColorMap[domain] ?? "#888",
  })).sort((a, b) => b.spend - a.spend);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-page">Reports & Analytics</h1>
          <p className="subtitle-page mt-1">Generate, schedule, and export reports</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setScheduleOpen(true)} className="rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-surface-elevated">
            Schedule export
          </button>
          <button onClick={() => setNewReportOpen(true)} className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90">
            New report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Utilisation by product</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={utilisationData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
              <YAxis type="category" dataKey="name" width={140} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1d1d1d", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12, color: "#f0f0f0" }} formatter={(v: number) => [`${v}%`, "Utilisation"]} />
              <Bar dataKey="utilisation" radius={[0, 4, 4, 0]}>
                {utilisationData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Monthly spend by domain</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={spendData} layout="vertical">
              <XAxis type="number" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="domain" width={110} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1d1d1d", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12, color: "#f0f0f0" }} formatter={(v: number) => [`€${v.toLocaleString()}`, "Spend"]} />
              <Bar dataKey="spend" radius={[0, 4, 4, 0]}>
                {spendData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Saved reports</h3>
        <DataTable columns={columns} data={reports ?? []} isLoading={isLoading} searchable onExportCsv={() => exportToCsv(reports ?? [], "reports.csv", [
          { key: "name", label: "Name" }, { key: "type", label: "Type" }, { key: "scope", label: "Scope" }, { key: "lastRun", label: "Last Run" }, { key: "schedule", label: "Schedule" },
        ])} />
      </div>

      <Modal open={newReportOpen} onClose={() => setNewReportOpen(false)} title="New report"
        primaryAction={{ label: "Generate", onClick: () => setNewReportOpen(false) }}
        secondaryAction={{ label: "Cancel", onClick: () => setNewReportOpen(false) }}>
        <div className="space-y-4">
          <div><label className="text-xs text-muted-foreground">Report name</label><input className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Monthly utilisation report" /></div>
          <div><label className="text-xs text-muted-foreground">Type</label><select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"><option>Utilisation</option><option>Cost</option><option>Access</option><option>Compliance</option></select></div>
          <div><label className="text-xs text-muted-foreground">Output format</label><select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"><option>PDF</option><option>CSV</option></select></div>
        </div>
      </Modal>

      <Modal open={scheduleOpen} onClose={() => setScheduleOpen(false)} title="Schedule export"
        primaryAction={{ label: "Schedule", onClick: () => setScheduleOpen(false) }}
        secondaryAction={{ label: "Cancel", onClick: () => setScheduleOpen(false) }}>
        <div className="space-y-4">
          <div><label className="text-xs text-muted-foreground">Frequency</label><select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"><option>Daily</option><option>Weekly</option><option>Monthly</option></select></div>
          <div><label className="text-xs text-muted-foreground">Recipient email</label><input className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground" placeholder="team@bestseller.com" /></div>
        </div>
      </Modal>
    </div>
  );
}
