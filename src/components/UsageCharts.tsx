"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { DailyTotal, MemberTotal, ProjectTotal } from "@/lib/types";

const tooltipStyle = {
  background: "#18181b",
  border: "1px solid #3f3f46",
  borderRadius: 8,
  color: "#f4f4f5",
  fontSize: 12,
};

export function DailyTrendChart({ data }: { data: DailyTotal[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(v: string) => v.slice(5)}
          stroke="#71717a"
          fontSize={11}
          tickLine={false}
        />
        <YAxis
          stroke="#71717a"
          fontSize={11}
          tickLine={false}
          tickFormatter={(v: number) => `$${v}`}
          width={44}
        />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => [`$${Number(v).toFixed(2)}`, "Spend"]}
          labelStyle={{ color: "#a1a1aa" }}
        />
        <Line
          type="monotone"
          dataKey="costUsd"
          stroke="#7c5cff"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function MemberBarChart({ data }: { data: MemberTotal[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" stroke="#71717a" fontSize={11} tickFormatter={(v: number) => `$${v}`} />
        <YAxis type="category" dataKey="member" stroke="#a1a1aa" fontSize={12} width={70} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => [`$${Number(v).toFixed(2)}`, "Spend"]}
          cursor={{ fill: "#18181b" }}
        />
        <Bar dataKey="costUsd" fill="#7c5cff" radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProjectBarChart({ data }: { data: ProjectTotal[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="project" stroke="#71717a" fontSize={10} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
        <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(v: number) => `$${v}`} width={44} />
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v) => [`$${Number(v).toFixed(2)}`, "Spend"]}
          cursor={{ fill: "#18181b" }}
        />
        <Bar dataKey="costUsd" fill="#4ade80" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
