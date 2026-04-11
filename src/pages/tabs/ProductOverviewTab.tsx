import { useParams } from "react-router-dom";
import { useProduct, useLicences, useProductIntegrations } from "@/hooks/useDataHooks";
import { KpiTile } from "@/components/KpiTile";
import { StatusBadge } from "@/components/StatusBadge";
import { SkeletonKpi, SkeletonChart } from "@/components/Skeletons";
import { Users, UserCheck, DollarSign, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function ProductOverviewTab() {
  const { productId } = useParams<{ productId: string }>();
  const { data: product, isLoading: pLoading } = useProduct(productId!);
  const { data: licences, isLoading: lLoading } = useLicences(productId!);
  const { data: integrations } = useProductIntegrations(productId!);

  if (pLoading) return <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <SkeletonKpi key={i} />)}</div>;
  if (!product) return null;

  const activeUsers = licences?.filter(l => l.status === "active").length ?? 0;
  const daysToRenewal = product.renewal ? Math.max(0, Math.ceil((new Date(product.renewal).getTime() - Date.now()) / 86400000)) : null;

  const dauData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    users: Math.floor(Math.random() * product.seats * 0.6 + product.seats * 0.2),
  }));

  const donutData = [
    { name: "Used", value: product.utilisation },
    { name: "Free", value: 100 - product.utilisation },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-4">
        <KpiTile label="Total Seats" value={product.seats.toLocaleString()} icon={Users} />
        <KpiTile label="Active Users" value={activeUsers.toLocaleString()} icon={UserCheck} delta={`${product.utilisation}% utilisation`} deltaType="up" />
        <KpiTile label="Monthly Cost" value={product.costMonthly > 0 ? `€${product.costMonthly.toLocaleString()}` : "Internal"} icon={DollarSign} />
        <KpiTile label="Renewal Date" value={product.renewal ?? "N/A"} icon={Calendar} subLabel={daysToRenewal !== null ? `${daysToRenewal} days remaining` : undefined} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Daily active users (30 days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dauData}>
              <XAxis dataKey="day" tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#888", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1d1d1d", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12, color: "#f0f0f0" }} />
              <Bar dataKey="users" radius={[2, 2, 0, 0]}>
                {dauData.map((_, i) => <Cell key={i} fill={i === 29 ? "#e8ff40" : "#333"} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border border-border bg-card p-5">
          <h3 className="text-sm font-bold text-foreground mb-4">Utilisation rate</h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width={200} height={200}>
              <PieChart>
                <Pie data={donutData} innerRadius={60} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270}>
                  <Cell fill="#e8ff40" />
                  <Cell fill="#2a2a2a" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="text-center -ml-24">
              <div className="text-3xl font-bold text-foreground">{product.utilisation}%</div>
              <div className="text-xs text-muted-foreground">utilisation</div>
            </div>
          </div>
        </div>
      </div>

      {integrations && integrations.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-foreground mb-3">Integration health</h3>
          <div className="grid grid-cols-3 gap-3">
            {integrations.map(int => (
              <div key={int.id} className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-foreground">{int.name}</div>
                  <div className="text-[11px] text-muted-foreground">Last synced: {new Date(int.lastSync).toLocaleString()}</div>
                </div>
                <StatusBadge status={int.status} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
