"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { DailyTrendChart, MemberBarChart, ProjectBarChart } from "@/components/UsageCharts";
import type { DailyTotal, MemberTotal, ProjectTotal } from "@/lib/types";

type TeamSummary = {
  teamName: string | null;
  monthlyBudgetUsd: number | null;
  lastSyncedAt: string | null;
  totalSpend: number;
  activeMembers: number;
  dailyTotals: DailyTotal[];
  memberTotals: MemberTotal[];
  projectTotals: ProjectTotal[];
};

/** "12 minutes ago" — vague on purpose; exact seconds help nobody here. */
function timeAgo(iso: string): string {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} minute${mins === 1 ? "" : "s"} ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function hoursSince(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 3600000;
}

const RANGES = [
  { days: 14, label: "14 days" },
  { days: 30, label: "30 days" },
  { days: 90, label: "90 days" },
  { days: 0, label: "All time" },
];

function TeamDashboardContent() {
  const params = useParams<{ key: string }>();
  const [summary, setSummary] = useState<TeamSummary | null>(null);
  const [error, setError] = useState(false);
  const [days, setDays] = useState(14);

  useEffect(() => {
    fetch(`/api/team-summary?key=${params.key}&days=${days}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then(setSummary)
      .catch(() => setError(true));
  }, [params.key, days]);

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-24 text-center text-zinc-400">
        <p>
          Couldn&apos;t find a team for this link. Check your Polar receipt email for the right
          one, or reach out if you think this is a mistake.
        </p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 py-24">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-accent" />
      </div>
    );
  }

  const budget = summary.monthlyBudgetUsd;
  const pctOfBudget = budget ? Math.min(100, Math.round((summary.totalSpend / budget) * 100)) : null;

  // Someone who has spent money in this window but has not synced in a day
  // has almost certainly lost their background job — worth calling out by name.
  const staleMembers = summary.memberTotals.filter(
    (m) => !m.lastSyncedAt || hoursSince(m.lastSyncedAt) >= 24,
  );

  return (
    <div className="flex-1 bg-[#08090a]">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800 px-6 py-4">
        <Link href="/" className="font-semibold tracking-tight text-zinc-100">
          Agent<span className="text-accent">Spend</span>
        </Link>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          Live data
        </span>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-50">
              {summary.teamName ?? "Your team"} — Claude Code spend
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {days === 0 ? "All time" : `Last ${days} days`}, {summary.activeMembers} member
              {summary.activeMembers === 1 ? "" : "s"}, {summary.projectTotals.length} project
              {summary.projectTotals.length === 1 ? "" : "s"}
            </p>
          </div>
          <div className="flex rounded-lg border border-zinc-800 p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.days}
                onClick={() => setDays(r.days)}
                className={`rounded-md px-3 py-1 text-xs transition ${
                  days === r.days
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {summary.lastSyncedAt && hoursSince(summary.lastSyncedAt) >= 6 && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 px-5 py-4 text-sm text-amber-200/90">
            <span className="font-medium">These numbers may be out of date.</span> The most
            recent sync was {timeAgo(summary.lastSyncedAt)}. If a teammate&apos;s machine has
            stopped syncing, re-run the installer there:{" "}
            <code className="mono text-xs text-amber-100">
              npx github:THEMANJH/agentspend-upload --install --key &lt;team key&gt;
            </code>
          </div>
        )}

        {staleMembers.length > 0 && (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-4 text-sm text-zinc-400">
            Not syncing recently:{" "}
            {staleMembers.map((m, i) => (
              <span key={m.member}>
                {i > 0 && ", "}
                <span className="text-zinc-200">{m.member}</span>{" "}
                <span className="text-zinc-500">
                  ({m.lastSyncedAt ? timeAgo(m.lastSyncedAt) : "never"})
                </span>
              </span>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">
              Total spend ({days === 0 ? "all time" : `${days}d`})
            </p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">
              ${summary.totalSpend.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Monthly budget</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">
              {budget ? `$${budget}` : "Not set"}
            </p>
            {pctOfBudget !== null && (
              <>
                <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-800">
                  <div
                    className={`h-1.5 rounded-full ${pctOfBudget > 80 ? "bg-amber-400" : "bg-accent"}`}
                    style={{ width: `${pctOfBudget}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-zinc-500">{pctOfBudget}% of budget used</p>
              </>
            )}
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Active members</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">{summary.activeMembers}</p>
            <p className="mt-1 text-xs text-zinc-500">
              {summary.lastSyncedAt
                ? `last synced ${timeAgo(summary.lastSyncedAt)}`
                : "no syncs yet"}
            </p>
          </div>
        </div>

        {summary.dailyTotals.length === 0 ? (
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-8 text-center text-sm text-zinc-400">
            No usage yet. Once teammates run the CLI, spend shows up here within minutes.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h2 className="mb-3 text-sm font-medium text-zinc-300">Daily spend trend</h2>
              <DailyTrendChart data={summary.dailyTotals} />
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
              <h2 className="mb-3 text-sm font-medium text-zinc-300">Spend by member</h2>
              <MemberBarChart data={summary.memberTotals} />
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 lg:col-span-2">
              <h2 className="mb-3 text-sm font-medium text-zinc-300">Spend by project</h2>
              <ProjectBarChart data={summary.projectTotals} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function TeamDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center px-6 py-24">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-accent" />
        </div>
      }
    >
      <TeamDashboardContent />
    </Suspense>
  );
}
