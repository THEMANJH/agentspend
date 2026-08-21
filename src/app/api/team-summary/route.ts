import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { DailyTotal, MemberTotal, ProjectTotal } from "@/lib/types";

/**
 * Real per-team dashboard data, gated by the team's ingest_key. The ingest
 * key already functions as the shared team secret handed to every member
 * for the CLI (see /welcome), so reusing it as the read-access token here
 * avoids needing a separate auth system for a v1.
 */
/** Selectable dashboard windows, in days. 0 = the team's entire history. */
const ALLOWED_RANGES = [14, 30, 90, 0];

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) {
    return NextResponse.json({ error: "missing key" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "service not configured" }, { status: 503 });
  }

  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("id, name, monthly_budget_usd")
    .eq("ingest_key", key)
    .single();

  if (teamError || !team) {
    return NextResponse.json({ error: "team not found" }, { status: 404 });
  }

  // `days=0` means the team's whole retained history — nothing is ever
  // pruned server-side, so the pricing page's "unlimited history" is
  // something the dashboard can actually show, not just something we store.
  const daysParam = Number(request.nextUrl.searchParams.get("days") ?? 14);
  const days = ALLOWED_RANGES.includes(daysParam) ? daysParam : 14;

  let query = supabase
    .from("usage_events")
    .select("occurred_at, cost_usd, project_label, member_id, members(label)")
    .eq("team_id", team.id);

  if (days > 0) {
    const since = new Date();
    since.setUTCDate(since.getUTCDate() - days);
    query = query.gte("occurred_at", since.toISOString());
  }

  const { data: events, error: eventsError } = await query;

  if (eventsError) {
    return NextResponse.json({ error: "query failed" }, { status: 500 });
  }

  const byDay = new Map<string, number>();
  const byMember = new Map<string, MemberTotal>();
  const byProject = new Map<string, number>();

  for (const e of events ?? []) {
    const date = e.occurred_at.slice(0, 10);
    byDay.set(date, (byDay.get(date) ?? 0) + Number(e.cost_usd));

    const memberRow = Array.isArray(e.members) ? e.members[0] : e.members;
    const memberLabel = memberRow?.label ?? "unknown";
    const cur = byMember.get(memberLabel) ?? { member: memberLabel, costUsd: 0, sessions: 0 };
    cur.costUsd += Number(e.cost_usd);
    cur.sessions += 1;
    byMember.set(memberLabel, cur);

    byProject.set(e.project_label, (byProject.get(e.project_label) ?? 0) + Number(e.cost_usd));
  }

  const dailyTotals: DailyTotal[] = Array.from(byDay.entries())
    .map(([date, costUsd]) => ({ date, costUsd: Math.round(costUsd * 100) / 100 }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const memberTotals: MemberTotal[] = Array.from(byMember.values())
    .map((m) => ({ ...m, costUsd: Math.round(m.costUsd * 100) / 100 }))
    .sort((a, b) => b.costUsd - a.costUsd);

  const projectTotals: ProjectTotal[] = Array.from(byProject.entries())
    .map(([project, costUsd]) => ({ project, costUsd: Math.round(costUsd * 100) / 100 }))
    .sort((a, b) => b.costUsd - a.costUsd);

  const totalSpend = Math.round(memberTotals.reduce((sum, m) => sum + m.costUsd, 0) * 100) / 100;

  return NextResponse.json({
    teamName: team.name,
    monthlyBudgetUsd: team.monthly_budget_usd,
    days,
    totalSpend,
    activeMembers: memberTotals.length,
    dailyTotals,
    memberTotals,
    projectTotals,
  });
}
