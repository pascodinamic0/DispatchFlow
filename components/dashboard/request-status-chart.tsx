"use client";

import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { chartStatusColors } from "@/lib/status-styles";
import type { RequestStatus } from "@/types";

type RequestStatusChartProps = {
  data: { status: RequestStatus; count: number }[];
};

export function RequestStatusChart({ data }: RequestStatusChartProps) {
  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No request data yet.
      </p>
    );
  }

  const chartData = data.map((d) => ({
    name: d.status.replace(/_/g, " "),
    value: d.count,
    fill: chartStatusColors[d.status],
  }));

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <div className="mx-auto h-[180px] w-[180px] shrink-0 sm:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex-1 space-y-2.5 text-sm">
        {chartData.map((item) => (
          <li key={item.name} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-2 capitalize text-foreground">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.fill }}
              />
              {item.name}
            </span>
            <span className="font-medium tabular-nums text-muted-foreground">
              {total > 0 ? Math.round((item.value / total) * 100) : 0}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
