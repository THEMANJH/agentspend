import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  let body: { email?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    // Demo mode: no database provisioned yet. Accept the request so the
    // landing page still works end-to-end during local development.
    console.log("[waitlist:demo-mode]", email, body.role ?? "");
    return NextResponse.json({ ok: true, mode: "demo" });
  }

  const { error } = await supabase
    .from("waitlist_emails")
    .upsert({ email, role: body.role ?? null }, { onConflict: "email" });

  if (error) {
    console.error("waitlist insert failed", error);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
