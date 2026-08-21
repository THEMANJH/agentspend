import Link from "next/link";
import { buildDemoUsageEvents, totalsByDay, totalsByMember, totalsByProject } from "@/lib/demo-data";
import { DailyTrendChart, MemberBarChart, ProjectBarChart } from "@/components/UsageCharts";

export const metadata = {
  title: "Dashboard preview — AgentSpend",
};

export default function DashboardPreview() {
  const events = buildDemoUsageEvents();
  const byDay = totalsByDay(events);
  const byMember = totalsByMember(events);
  const byProject = totalsByProject(events);
  const totalSpend = byMember.reduce((sum, m) => sum + m.costUsd, 0);
  const budget = 150;
  const pctOfBudget = Math.min(100, Math.round((totalSpend / budget) * 100));

  return (
    <div className="flex-1 bg-[#08090a]">
      <header className="border-b border-zinc-800 px-6 py-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/" className="font-semibold tracking-tight text-zinc-100">
          Agent<span className="text-accent">Spend</span>
        </Link>
        <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs text-zinc-400">
          Sample data · your team&apos;s dashboard will look like this
        </span>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-50">Acme Inc — Claude Code spend</h1>
          <p className="mt-1 text-sm text-zinc-400">Last 14 days, 4 members, 4 projects</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Total spend (14d)</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">${totalSpend.toFixed(2)}</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Monthly budget</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">${budget}</p>
            <div className="mt-3 h-1.5 w-full rounded-full bg-zinc-800">
              <div
                className={`h-1.5 rounded-full ${pctOfBudget > 80 ? "bg-amber-400" : "bg-accent"}`}
                style={{ width: `${pctOfBudget}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-zinc-500">{pctOfBudget}% of budget used</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <p className="text-xs uppercase tracking-wide text-zinc-500">Active members</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-50">{byMember.length}</p>
            <p className="mt-1 text-xs text-zinc-500">last synced 12 minutes ago</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="mb-3 text-sm font-medium text-zinc-300">Daily spend trend</h2>
            <DailyTrendChart data={byDay} />
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
            <h2 className="mb-3 text-sm font-medium text-zinc-300">Spend by member</h2>
            <MemberBarChart data={byMember} />
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 lg:col-span-2">
            <h2 className="mb-3 text-sm font-medium text-zinc-300">Spend by project</h2>
            <ProjectBarChart data={byProject} />
          </div>
        </div>

        <div className="rounded-xl border border-zinc-800 bg-zinc-900/20 p-5 text-sm text-zinc-400">
          This is what your team sees after installing the CLI on each machine. No source code or
          prompt text is ever uploaded — only token counts, model, project name, and timestamps.
        </div>
      </main>
    </div>
  );
}
