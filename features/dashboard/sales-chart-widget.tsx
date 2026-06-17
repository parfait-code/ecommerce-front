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

const data = [
  { month: "Jan", ventes: 820000 },
  { month: "Fév", ventes: 1100000 },
  { month: "Mar", ventes: 950000 },
  { month: "Avr", ventes: 1350000 },
  { month: "Mai", ventes: 1200000 },
  { month: "Jun", ventes: 1600000 },
  { month: "Jul", ventes: 1450000 },
  { month: "Aoû", ventes: 1800000 },
  { month: "Sep", ventes: 2100000 },
  { month: "Oct", ventes: 1900000 },
  { month: "Nov", ventes: 2400000 },
  { month: "Déc", ventes: 4200000 },
];

function formatXAF(val: number) {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
  return val.toString();
}

export function SalesChartWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ventes mensuelles</CardTitle>
        <span className="text-xs text-[var(--text-muted)]">2026 · XAF</span>
      </CardHeader>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
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
    </Card>
  );
}