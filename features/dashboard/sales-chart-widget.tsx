"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle } from "../../components/ui/card";
import { useSalesChart } from "../../hooks/use-dashboard";

function formatXAF(val: number) {
  if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}M`;
  if (val >= 1_000) return `${(val / 1_000).toFixed(0)}K`;
  return val.toString();
}

export function SalesChartWidget() {
  const { data, loading } = useSalesChart();

  const chartData =
    data?.points.map((p) => ({ month: p.label, ventes: p.amount })) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventes mensuelles</CardTitle>
        <span className="text-xs text-(--text-muted)">
          {data ? `${data.year} · ${data.currency}` : "Chargement…"}
        </span>
      </CardHeader>
      {loading ? (
        <div className="flex h-55 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-(--border) border-t-(--accent)" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={chartData}
            margin={{ top: 4, right: 4, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F7EFF" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#4F7EFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              tick={{ fill: "#7B8099", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatXAF}
              tick={{ fill: "#7B8099", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#161A22",
                border: "1px solid #252B38",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#E8EAF0",
              }}
              formatter={(val) => [`${formatXAF(Number(val))} XAF`, "Ventes"]}
            />
            <Area
              type="monotone"
              dataKey="ventes"
              stroke="#4F7EFF"
              strokeWidth={2}
              fill="url(#salesGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}