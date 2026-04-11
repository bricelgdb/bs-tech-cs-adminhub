import { useProducts, useActivity } from "@/hooks/useDataHooks";
import { useAppStore } from "@/store/appStore";
import { KpiTile } from "@/components/KpiTile";
import { AlertStrip } from "@/components/AlertStrip";
import { Timeline } from "@/components/Timeline";
import { SkeletonKpi, SkeletonChart } from "@/components/Skeletons";
import { Package, Users, Percent, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { domainColorMap, type Product } from "@/data/products";
import { accessRequests } from "@/data/users";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const monthlySpend = [
  { month: "Nov", spend: 17200 },
  { month: "Dec", spend: 18100 },
  { month: "Jan", spend: 19400 },
  { month: "Feb", spend: 18800 },
  { month: "Mar", spend: 19620 },
  { month: "Apr", spend: 19620 },
];

export default function DashboardPage() {
  const { userName } = useAppStore();
  const { data: products, isLoading: pLoading } = useProducts();
  const { data: activity, isLoading: aLoading } = useActivity();

  const expiringProducts = products?.filter(p => p.status === "expiring") ?? [];
  const totalSeats = products?.reduce((s, p) => s + p.seats, 0) ?? 0;
  const avgUtil = products ? Math.round(products.reduce((s, p) => s + p.utilisation, 0) / products.length) : 0;
  const totalSpend = products?.reduce((s, p) => s + p.costMonthly, 0) ?? 0;

  const seatsByProduct = products?.map(p => ({
    name: p.name.length > 20 ? p.name.slice(0, 20) + "…" : p.name,
    seats: p.seats,
    color: domainColorMap[p.domain[0]] ?? "#888",
  })).sort((a, b) => b.seats - a.seats) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="heading-page">{getGreeting()}, {userName.split(" ")[0]}</h1>
        <p className="subtitle-page mt-1">{new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</p>
      </div>

      <div className="space-y-2">
        {expiringProducts.map(p => (
          <AlertStrip
            key={p.id}
            severity="amber"
            message={`${p.name} licence expires on ${p.renewal} — action required`}
            actionTo="/licences"
          />
        ))}
        {accessRequests.length > 0 && (
          <AlertStrip
            severity="red"
            message={`${accessRequests.length} access request${accessRequests.length > 1 ? "s" : ""} pending review`}
            actionTo="/access"
          />
        )}
      </div>

      {pLoading ? (
        <div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <SkeletonKpi key={i} />)}</div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          <KpiTile label="Total Products" value={String(products?.length ?? 0)} icon={Package} />
          <KpiTile label="Active Seats" value={totalSeats.toLocaleString()} icon={Users} delta="+12 this month" deltaType="up" />
          <KpiTile label="Licence Utilisation" value={`${avgUtil}%`} icon={Percent} delta="+3%" deltaType="up" />
          <KpiTile label="Monthly Spend" value={`€${totalSpend.toLocaleString()}`} icon={DollarSign} subLabel="excl. internal tools" />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {pLoading ? (
          <><SkeletonChart height={320} /><SkeletonChart height={320} /></>
        ) : (
          <>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-foreground mb-4">Seats by product</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={seatsByProduct} layout="vertical" margin={{ left: 0, right: 20 }}>
                  <XAxis type="number" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={140} tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "#1d1d1d", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12, color: "#f0f0f0" }} />
                  <Bar dataKey="seats" radius={[0, 4, 4, 0]}>
                    {seatsByProduct.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <h3 className="text-sm font-bold text-foreground mb-4">Monthly spend (last 6 months)</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthlySpend} margin={{ left: 0, right: 20 }}>
                  <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#888", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `€${(v/1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: "#1d1d1d", border: "1px solid #2a2a2a", borderRadius: 6, fontSize: 12, color: "#f0f0f0" }} formatter={(v: number) => [`€${v.toLocaleString()}`, "Spend"]} />
                  <Bar dataKey="spend" radius={[4, 4, 0, 0]}>
                    {monthlySpend.map((_, i) => <Cell key={i} fill={i === monthlySpend.length - 1 ? "#e8ff40" : "#333"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-foreground">Recent activity</h3>
          <Link to="/products" className="text-xs text-primary hover:underline">View all →</Link>
        </div>
        {aLoading ? (
          <SkeletonChart height={200} />
        ) : (
          <div className="rounded-lg border border-border bg-card p-5">
            <Timeline events={activity?.slice(0, 8) ?? []} />
          </div>
        )}
      </div>
    </div>
  );
}
