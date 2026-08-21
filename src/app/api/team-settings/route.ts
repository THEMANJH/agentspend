import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

/**
 * Budget settings for a team, gated by the same ingest key the dashboard
 * already uses as its read token. Signup provisions a default budget and
 * an 80% alert; without this route a customer whose real budget is not the
 * default would get alerts they cannot correct, which is a churn reason
 * rather than a feature.
 */

type Payload = {
  key?: string;
  monthlyBudgetUsd?: number | null;
  thresholdPct?: number;
  notifyEmail?: string;
};

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "service not configured" }, { status: 503 });

  const { data: team } = await supabase
    .from("teams")
    .select("id, name, monthly_budget_usd")
    .eq("ingest_key", key)
    .single();

  if (!team) return NextResponse.json({ error: "team not found" }, { status: 404 });

  const { data: alert } = await supabase
    .from("budget_alerts")
    .select("threshold_pct, notify_email")
    .eq("team_id", team.id)
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    teamName: team.name,
    monthlyBudgetUsd: team.monthly_budget_usd,
    thresholdPct: alert?.threshold_pct ?? null,
    notifyEmail: alert?.notify_email ?? null,
  });
}

export async function POST(request: NextRequest) {
  let body: Payload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { key, monthlyBudgetUsd, thresholdPct, notifyEmail } = body;
  if (!key) return NextResponse.json({ error: "missing key" }, { status: 400 });

  if (monthlyBudgetUsd != null && (!Number.isFinite(monthlyBudgetUsd) || monthlyBudgetUsd < 0)) {
    return NextResponse.json({ error: "budget must be a positive number" }, { status: 400 });
  }
  if (thresholdPct != null && (!Number.isInteger(thresholdPct) || thresholdPct < 1 || thresholdPct > 100)) {
    return NextResponse.json({ error: "threshold must be between 1 and 100" }, { status: 400 });
  }
  if (notifyEmail != null && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(notifyEmail)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "service not configured" }, { status: 503 });

  const { data: team } = await supabase
    .from("teams")
    .select("id")
    .eq("ingest_key", key)
    .single();

  if (!team) return NextResponse.json({ error: "team not found" }, { status: 404 });

  if (monthlyBudgetUsd !== undefined) {
    const { error } = await supabase
      .from("teams")
      .update({ monthly_budget_usd: monthlyBudgetUsd })
      .eq("id", team.id);
    if (error) return NextResponse.json({ error: "could not save budget" }, { status: 500 });
  }

  if (thresholdPct !== undefined || notifyEmail !== undefined) {
    const { data: existing } = await supabase
      .from("budget_alerts")
      .select("id")
      .eq("team_id", team.id)
      .limit(1)
      .maybeSingle();

    if (existing) {
      const patch: Record<string, unknown> = {};
      if (thresholdPct !== undefined) patch.threshold_pct = thresholdPct;
      if (notifyEmail !== undefined) patch.notify_email = notifyEmail;
      // Changing the threshold should let the new one fire this month even
      // if the old one already did, so clear the dedupe timestamp.
      patch.last_fired_at = null;
      const { error } = await supabase.from("budget_alerts").update(patch).eq("id", existing.id);
      if (error) return NextResponse.json({ error: "could not save alert" }, { status: 500 });
    } else if (notifyEmail) {
      const { error } = await supabase.from("budget_alerts").insert({
        team_id: team.id,
        threshold_pct: thresholdPct ?? 80,
        notify_email: notifyEmail,
      });
      if (error) return NextResponse.json({ error: "could not create alert" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
