import { useParams } from "react-router-dom";
import { useLicences, useAccessRequests } from "@/hooks/useDataHooks";
import { DataTable } from "@/components/DataTable";
import { StatusBadge } from "@/components/StatusBadge";
import { type ColumnDef } from "@tanstack/react-table";
import type { LicenceUser } from "@/data/products";

const requestColumns: ColumnDef<any, any>[] = [
  { accessorKey: "userName", header: "User" },
  { accessorKey: "brand", header: "Brand" },
  { accessorKey: "roleRequested", header: "Role Requested" },
  { accessorKey: "submittedDate", header: "Submitted" },
  {
    id: "actions",
    header: "",
    cell: () => (
      <div className="flex gap-2">
        <button className="text-xs text-semantic-green hover:underline">Approve</button>
        <button className="text-xs text-semantic-red hover:underline">Deny</button>
      </div>
    ),
  },
];

const userColumns: ColumnDef<LicenceUser, any>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
  { accessorKey: "seatType", header: "Access Level" },
  { accessorKey: "lastActive", header: "Last Active" },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
];

export default function ProductAccessTab() {
  const { productId } = useParams<{ productId: string }>();
  const { data: licences, isLoading } = useLicences(productId!);
  const { data: allRequests } = useAccessRequests();

  const productRequests = (allRequests ?? []).filter((r) => r.productId === productId);

  return (
    <div className="space-y-6">
      {productRequests.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Pending requests</h3>
          <DataTable columns={requestColumns} data={productRequests} />
        </div>
      )}
      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Active users</h3>
        <DataTable columns={userColumns} data={licences ?? []} isLoading={isLoading} searchable />
      </div>
    </div>
  );
}
