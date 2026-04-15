import { useParams } from "react-router-dom";
import { useProduct } from "@/hooks/useDataHooks";
import { KpiTile } from "@/components/KpiTile";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { chartTickStyle, chartTooltipStyle, chartBarAccent } from "@/lib/chartTheme";

export default function ProductUsageTab() {
  const { productId } = useParams<{ productId: string }>();
  const { data: product } = useProduct(productId!);
  if (!product) return null;

  const topUsers = [
    { name: "Emma Nielsen", hours: 142 },
    { name: "Lars Pedersen", hours: 128 },
    { name: "Sofia Andersen", hours: 115 },
    { name: "Mikkel Hansen", hours: 98 },
    { name: "Camilla Jensen", hours: 87 },
    { name: "Frederik Larsen", hours: 76 },
    { name: "Anna Christensen", hours: 64 },
    { name: "Oliver Rasmussen", hours: 52 },
    { name: "Ida Madsen", hours: 41 },
    { name: "Magnus Eriksen", hours: 33 },
  ];

  const featureUsage = [
    { feature: "Photo Editing", hours: 320 },
    { feature: "Vector Design", hours: 210 },
    { feature: "Layout", hours: 180 },
    { feature: "Video Editing", hours: 150 },
    { feature: "Export/Render", hours: 95 },
    { feature: "Collaboration", hours: 72 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <KpiTile label="Utilisation Rate" value={`${product.utilisation}%`} delta="+5% vs prior 30d" deltaType="up" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Top 10 users by activity hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topUsers} layout="vertical">
              <XAxis type="number" tick={chartTickStyle} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" width={130} tick={chartTickStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="hours" fill={chartBarAccent} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-lg border border-border bg-card p-5 shadow-card">
          <h3 className="text-sm font-semibold text-foreground mb-4">Feature usage breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={featureUsage} layout="vertical">
              <XAxis type="number" tick={chartTickStyle} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="feature" width={120} tick={chartTickStyle} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="hours" fill="hsl(214, 72%, 48%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
