import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { estimateCostUsd } from "@/lib/pricing";

type IngestEvent = {
  occurred_at: string;
  project_label: string;
  model: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  cache_creation_tokens: number;
};

type IngestBody = {
  teamKey?: string;
  member?: string;
  events?: IngestEvent[];
};

export async function POST(request: NextRequest) {
  let body: IngestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { teamKey, member, events } = body;
  if (!teamKey || !member || !Array.isArray(events) || events.length === 0) {
    return NextResponse.json(
      { error: "teamKey, member, and a non-empty events array are required" },
      { status: 400 },
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "service not configured" }, { status: 503 });
  }

  const { data: team, error: teamError } = await supabase
    .from("teams")
    .select("id")
    .eq("ingest_key", teamKey)
    .single();

  if (teamError || !team) {
    return NextResponse.json({ error: "invalid team key" }, { status: 401 });
  }

  const { data: memberRow, error: memberError } = await supabase
    .from("members")
    .upsert({ team_id: team.id, label: member }, { onConflict: "team_id,label" })
    .select("id")
    .single();

  if (memberError || !memberRow) {
    return NextResponse.json({ error: "could not resolve member" }, { status: 500 });
  }

  const rows = events.map((e) => ({
    team_id: team.id,
    member_id: memberRow.id,
    occurred_at: e.occurred_at,
    project_label: e.project_label,
    model: e.model,
    input_tokens: e.input_tokens,
    output_tokens: e.output_tokens,
    cache_read_tokens: e.cache_read_tokens,
    cache_creation_tokens: e.cache_creation_tokens,
    cost_usd: estimateCostUsd({
      model: e.model,
      inputTokens: e.input_tokens,
      outputTokens: e.output_tokens,
      cacheReadTokens: e.cache_read_tokens,
      cacheCreationTokens: e.cache_creation_tokens,
    }),
  }));

  const { error: insertError } = await supabase.from("usage_events").insert(rows);
  if (insertError) {
    console.error("usage_events insert failed", insertError);
    return NextResponse.json({ error: "insert failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, inserted: rows.length });
}
