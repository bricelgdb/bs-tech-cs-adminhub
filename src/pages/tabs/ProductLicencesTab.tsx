import { useParams } from "react-router-dom";
import { useLicences, useProduct } from "@/hooks/useDataHooks";
import { DataTable, exportToCsv } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { type ColumnDef } from "@tanstack/react-table";
import type { LicenceUser } from "@/data/products";

const columns: ColumnDef<LicenceUser, any>[] = [
  { accessorKey: "name", header: "User" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "seatType", header: "Seat Type" },
  { accessorKey: "assignedDate", header: "Assigned" },
  { accessorKey: "lastActive", header: "Last Active" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue()} />,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <div className="flex gap-2">
        {row.original.status === "active" ? (
          <button className="text-xs text-semantic-red hover:underline">Revoke</button>
        ) : (
          <button className="text-xs text-primary hover:underline">Assign</button>
        )}
      </div>
    ),
  },
];

export default function ProductLicencesTab() {
  const { productId } = useParams<{ productId: string }>();
  const { data: product } = useProduct(productId!);
  const { data: licences, isLoading } = useLicences(productId!);

  const unassigned = product ? product.seats - (licences?.length ?? 0) : 0;
  const daysToRenewal = product?.renewal ? Math.max(0, Math.ceil((new Date(product.renewal).getTime() - Date.now()) / 86400000)) : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        {unassigned > 0 && (
          <span className="rounded-full bg-semantic-blue/15 px-3 py-1 text-xs font-medium text-semantic-blue">
            {unassigned} unassigned seats
          </span>
        )}
        {daysToRenewal !== null && (
          <span className="rounded-full bg-semantic-amber/15 px-3 py-1 text-xs font-medium text-semantic-amber">
            Renewal in {daysToRenewal} days
          </span>
        )}
      </div>
      <DataTable
        columns={columns}
        data={licences ?? []}
        isLoading={isLoading}
        searchable
        searchPlaceholder="Search users…"
        onExportCsv={() => exportToCsv(licences ?? [], `${productId}-licences.csv`, [
          { key: "name", label: "User" }, { key: "role", label: "Role" }, { key: "seatType", label: "Seat Type" },
          { key: "assignedDate", label: "Assigned" }, { key: "lastActive", label: "Last Active" }, { key: "status", label: "Status" },
        ])}
        actions={
          <button className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
            Assign seat
          </button>
        }
      />
    </div>
  );
}
