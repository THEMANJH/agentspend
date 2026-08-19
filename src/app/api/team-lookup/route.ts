import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const checkoutId = request.nextUrl.searchParams.get("checkout_id");
  if (!checkoutId) {
    return NextResponse.json({ error: "checkout_id required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "service not configured" }, { status: 503 });
  }

  const { data, error } = await supabase
    .from("teams")
    .select("name, ingest_key")
    .eq("checkout_id", checkoutId)
    .single();

  if (error || !data) {
    return NextResponse.json({ ready: false });
  }

  return NextResponse.json({ ready: true, name: data.name, ingestKey: data.ingest_key });
}
