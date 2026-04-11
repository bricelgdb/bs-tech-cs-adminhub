import { useLicenceRegister, useUnusedSeats, useProducts } from "@/hooks/useDataHooks";
import { KpiTile } from "@/components/KpiTile";
import { AlertStrip } from "@/components/AlertStrip";
import { DataTable, exportToCsv } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { SkeletonKpi } from "@/components/Skeletons";
import { type ColumnDef } from "@tanstack/react-table";
import type { LicenceRegisterEntry } from "@/data/licences";
import type { UnusedSeat } from "@/data/licences";
import { DollarSign, Percent, AlertTriangle } from "lucide-react";

const regColumns: ColumnDef<LicenceRegisterEntry, any>[] = [
  { accessorKey: "productName", header: "Product" },
  { accessorKey: "totalSeats", header: "Total Seats" },
  {
    accessorKey: "utilisation", header: "Utilisation",
    cell: ({ getValue }) => {
      const v = getValue() as number;
      const color = v >= 80 ? "bg-semantic-green" : v >= 60 ? "bg-semantic-amber" : "bg-semantic-red";
      return (
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 rounded-full bg-muted">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${v}%` }} />
          </div>
          <span className="text-xs">{v}%</span>
        </div>
      );
    },
  },
  { accessorKey: "costMonthly", header: "Monthly Cost", cell: ({ getValue }) => { const v = getValue() as number; return v > 0 ? `€${v.toLocaleString()}` : "Internal"; } },
  { accessorKey: "costAnnual", header: "Annual Cost", cell: ({ getValue }) => { const v = getValue() as number; return v > 0 ? `€${v.toLocaleString()}` : "Internal"; } },
  { accessorKey: "renewalDate", header: "Renewal", cell: ({ getValue }) => getValue() ?? "N/A" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
];

const unusedColumns: ColumnDef<UnusedSeat, any>[] = [
  { accessorKey: "productName", header: "Product" },
  { accessorKey: "userName", header: "User" },
  { accessorKey: "lastActiveDaysAgo", header: "Last Active", cell: ({ getValue }) => `${getValue()} days ago` },
  { accessorKey: "costPerSeat", header: "Cost/Seat", cell: ({ getValue }) => `€${getValue()}/mo` },
  {
    id: "actions", header: "",
    cell: () => <button className="text-xs text-semantic-red hover:underline">Revoke</button>,
  },
];

export default function LicencesPage() {
  const { data: register, isLoading: regLoading } = useLicenceRegister();
  const { data: unused, isLoading: unusedLoading } = useUnusedSeats();
  const { data: products } = useProducts();

  const expiringProducts = products?.filter(p => p.status === "expiring") ?? [];
  const totalSpend = register?.reduce((s, r) => s + r.costMonthly, 0) ?? 0;
  const avgUtil = register ? Math.round(register.reduce((s, r) => s + r.utilisation, 0) / register.length) : 0;
  const unusedCount = unused?.length ?? 0;
  const potentialSavings = unused?.reduce((s, u) => s + u.costPerSeat, 0) ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-page">Licence Governance</h1>
        <p className="subtitle-page mt-1">Monitor licence spend, utilisation, and renewals</p>
      </div>

      {expiringProducts.map(p => (
        <AlertStrip key={p.id} severity="amber" message={`${p.name} expires on ${p.renewal} — ${Math.max(0, Math.ceil((new Date(p.renewal!).getTime() - Date.now()) / 86400000))} days remaining`} />
      ))}

      {regLoading ? (
        <div className="grid grid-cols-3 gap-4">{[1,2,3].map(i => <SkeletonKpi key={i} />)}</div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          <KpiTile label="Total Monthly Spend" value={`€${totalSpend.toLocaleString()}`} icon={DollarSign} />
          <KpiTile label="Average Utilisation" value={`${avgUtil}%`} icon={Percent} />
          <KpiTile label="Unused Seats Flagged" value={String(unusedCount)} icon={AlertTriangle} subLabel={`€${potentialSavings}/mo potential savings`} />
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Cross-product licence register</h3>
        <DataTable columns={regColumns} data={register ?? []} isLoading={regLoading} searchable onExportCsv={() => exportToCsv(register ?? [], "licence-register.csv", [
          { key: "productName", label: "Product" }, { key: "totalSeats", label: "Seats" }, { key: "utilisation", label: "Utilisation %" },
          { key: "costMonthly", label: "Monthly Cost" }, { key: "costAnnual", label: "Annual Cost" }, { key: "renewalDate", label: "Renewal" }, { key: "status", label: "Status" },
        ])} />
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Unused seats</h3>
        <DataTable columns={unusedColumns} data={unused ?? []} isLoading={unusedLoading} onExportCsv={() => exportToCsv(unused ?? [], "unused-seats.csv", [
          { key: "productName", label: "Product" }, { key: "userName", label: "User" }, { key: "lastActiveDaysAgo", label: "Days Inactive" }, { key: "costPerSeat", label: "Cost/Seat" },
        ])} />
      </div>
    </div>
  );
}
