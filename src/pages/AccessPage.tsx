import { useState } from "react";
import { useUsers, useAccessRequests } from "@/hooks/useDataHooks";
import { DataTable, exportToCsv } from "@/components/DataTable";
import { AlertStrip } from "@/components/AlertStrip";
import { Modal } from "@/components/Modal";
import { StatusBadge } from "@/components/StatusBadge";
import { type ColumnDef } from "@tanstack/react-table";
import type { AppUser, AccessRequest } from "@/data/users";

const requestColumns: ColumnDef<AccessRequest, any>[] = [
  { accessorKey: "userName", header: "User" },
  { accessorKey: "productName", header: "Product" },
  { accessorKey: "roleRequested", header: "Role Requested" },
  { accessorKey: "brand", header: "Brand" },
  { accessorKey: "submittedDate", header: "Date" },
  {
    id: "actions", header: "",
    cell: () => (
      <div className="flex gap-2">
        <button className="text-xs text-semantic-green hover:underline">Approve</button>
        <button className="text-xs text-semantic-red hover:underline">Deny</button>
      </div>
    ),
  },
];

const userColumns: ColumnDef<AppUser, any>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "brand", header: "Brand" },
  { accessorKey: "role", header: "Role" },
  {
    accessorKey: "productAccess", header: "Products",
    cell: ({ getValue }) => (
      <div className="flex flex-wrap gap-1">
        {(getValue() as string[]).slice(0, 3).map(p => (
          <span key={p} className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{p}</span>
        ))}
        {(getValue() as string[]).length > 3 && <span className="text-[10px] text-muted-foreground">+{(getValue() as string[]).length - 3}</span>}
      </div>
    ),
  },
  { accessorKey: "status", header: "Status", cell: ({ getValue }) => <StatusBadge status={getValue()} /> },
  { accessorKey: "lastActive", header: "Last Active" },
];

export default function AccessPage() {
  const { data: users, isLoading: uLoading } = useUsers();
  const { data: requests, isLoading: rLoading } = useAccessRequests();
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [offboardOpen, setOffboardOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-page">Access & Permissions</h1>
          <p className="subtitle-page mt-1">Manage user access across all creative tools</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setOffboardOpen(true)} className="rounded-md border border-border px-3 py-2 text-xs text-foreground hover:bg-surface-elevated">Offboard user</button>
          <button onClick={() => setOnboardOpen(true)} className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:opacity-90">Onboard user</button>
        </div>
      </div>

      {(requests?.length ?? 0) > 0 && (
        <AlertStrip severity="red" message={`${requests?.length} access request${(requests?.length ?? 0) > 1 ? "s" : ""} pending review`} />
      )}

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Pending requests</h3>
        <DataTable columns={requestColumns} data={requests ?? []} isLoading={rLoading} />
      </div>

      <div>
        <h3 className="text-sm font-bold text-foreground mb-3">Active users</h3>
        <DataTable columns={userColumns} data={users ?? []} isLoading={uLoading} searchable searchPlaceholder="Search users…" onExportCsv={() => exportToCsv(users ?? [], "users.csv", [
          { key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "brand", label: "Brand" }, { key: "role", label: "Role" }, { key: "status", label: "Status" },
        ])} />
      </div>

      <Modal open={onboardOpen} onClose={() => setOnboardOpen(false)} title="Onboard user"
        primaryAction={{ label: "Onboard", onClick: () => setOnboardOpen(false) }}
        secondaryAction={{ label: "Cancel", onClick: () => setOnboardOpen(false) }}>
        <div className="space-y-4">
          <div><label className="text-xs text-muted-foreground">Full name</label><input className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" /></div>
          <div><label className="text-xs text-muted-foreground">Email</label><input className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" /></div>
          <div><label className="text-xs text-muted-foreground">Brand</label><select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"><option>BESTSELLER Tech</option><option>JACK & JONES</option><option>VERO MODA</option><option>ONLY</option><option>SELECTED</option><option>NAME IT</option></select></div>
          <div><label className="text-xs text-muted-foreground">Platform role</label><select className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"><option>Team Member</option><option>Brand Design Lead</option><option>Creative Tech</option><option>IT Admin</option></select></div>
        </div>
      </Modal>

      <Modal open={offboardOpen} onClose={() => setOffboardOpen(false)} title="Offboard user"
        primaryAction={{ label: "Revoke all access", onClick: () => setOffboardOpen(false) }}
        secondaryAction={{ label: "Cancel", onClick: () => setOffboardOpen(false) }}>
        <div className="space-y-4">
          <div><label className="text-xs text-muted-foreground">Search user</label><input className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary" placeholder="Search by name or email…" /></div>
          <p className="text-xs text-semantic-amber">Warning: This will revoke all product access for the selected user. This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}
