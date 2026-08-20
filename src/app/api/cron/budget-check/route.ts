import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getResend } from "@/lib/resend";

/**
 * Runs on a schedule (see vercel.json). For every budget_alerts row, sums
 * that team's usage cost for the current calendar month and, if it has
 * crossed the configured threshold since the last time this alert fired
 * this month, sends one email. Re-checked on every run, but last_fired_at
 * is compared against the start of the current month so each team gets at
 * most one email per threshold per month.
 */
export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (cronSecret && auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const resend = getResend();
  if (!supabase) {
    return NextResponse.json({ error: "service not configured" }, { status: 503 });
  }

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const { data: alerts, error: alertsError } = await supabase
    .from("budget_alerts")
    .select("id, team_id, threshold_pct, notify_email, last_fired_at, teams(name, monthly_budget_usd)");

  if (alertsError) {
    console.error("budget-check: failed to load budget_alerts", alertsError);
    return NextResponse.json({ error: "query failed" }, { status: 500 });
  }

  let checked = 0;
  let fired = 0;

  for (const alert of alerts ?? []) {
    checked++;
    const team = Array.isArray(alert.teams) ? alert.teams[0] : alert.teams;
    const budget = team?.monthly_budget_usd;
    if (!budget || budget <= 0) continue;

    const alreadyFiredThisMonth =
      alert.last_fired_at && new Date(alert.last_fired_at) >= monthStart;
    if (alreadyFiredThisMonth) continue;

    const { data: events, error: eventsError } = await supabase
      .from("usage_events")
      .select("cost_usd")
      .eq("team_id", alert.team_id)
      .gte("occurred_at", monthStart.toISOString());

    if (eventsError) {
      console.error("budget-check: failed to sum usage for team", alert.team_id, eventsError);
      continue;
    }

    const spend = (events ?? []).reduce((sum, e) => sum + Number(e.cost_usd), 0);
    const pctUsed = (spend / Number(budget)) * 100;
    if (pctUsed < alert.threshold_pct) continue;

    if (resend) {
      const { error: sendError } = await resend.emails.send({
        from: "AgentSpend <alerts@resend.dev>",
        to: alert.notify_email,
        subject: `${team?.name ?? "Your team"} has used ${Math.round(pctUsed)}% of its Claude Code budget`,
        html: `
          <p>Hi,</p>
          <p><strong>${team?.name ?? "Your team"}</strong> has spent
          <strong>$${spend.toFixed(2)}</strong> of the
          <strong>$${Number(budget).toFixed(2)}</strong> monthly budget
          (${Math.round(pctUsed)}%) on Claude Code so far this month.</p>
          <p>See the full breakdown in your AgentSpend dashboard.</p>
        `,
      });
      if (sendError) {
        console.error("budget-check: send failed for", alert.notify_email, sendError);
        continue;
      }
    } else {
      console.warn("budget-check: RESEND_API_KEY not set, skipping send for", alert.notify_email);
    }

    await supabase
      .from("budget_alerts")
      .update({ last_fired_at: new Date().toISOString() })
      .eq("id", alert.id);
    fired++;
  }

  return NextResponse.json({ ok: true, checked, fired });
}
