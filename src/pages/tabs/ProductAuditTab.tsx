import { useParams } from "react-router-dom";
import { useProductAudit } from "@/hooks/useDataHooks";
import { DataTable, exportToCsv } from "@/components/DataTable";
import { type ColumnDef } from "@tanstack/react-table";
import type { AuditEvent } from "@/data/products";

const columns: ColumnDef<AuditEvent, any>[] = [
  { accessorKey: "timestamp", header: "Timestamp", cell: ({ getValue }) => <span className="font-mono text-xs">{new Date(getValue()).toLocaleString()}</span> },
  { accessorKey: "user", header: "User" },
  { accessorKey: "action", header: "Action" },
  { accessorKey: "details", header: "Details", cell: ({ getValue }) => <span className="font-mono text-xs text-muted-foreground">{getValue()}</span> },
];

export default function ProductAuditTab() {
  const { productId } = useParams<{ productId: string }>();
  const { data: events, isLoading } = useProductAudit(productId!);

  return (
    <DataTable
      columns={columns}
      data={events ?? []}
      isLoading={isLoading}
      searchable
      searchPlaceholder="Search audit log…"
      onExportCsv={() => exportToCsv(events ?? [], `${productId}-audit.csv`, [
        { key: "timestamp", label: "Timestamp" }, { key: "user", label: "User" },
        { key: "action", label: "Action" }, { key: "details", label: "Details" },
      ])}
    />
  );
}
