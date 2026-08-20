import { Webhooks } from "@polar-sh/nextjs";
import { getSupabaseAdmin } from "@/lib/supabase";

const TEAM_PRODUCT_ID = process.env.NEXT_PUBLIC_POLAR_TEAM_PRODUCT_ID;

// New teams get a sane default so budget alerts work out of the box;
// adjustable later once there's a settings UI for it.
const DEFAULT_MONTHLY_BUDGET_USD = 150;
const DEFAULT_ALERT_THRESHOLD_PCT = 80;

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onOrderPaid: async (payload) => {
    const order = payload.data;
    if (TEAM_PRODUCT_ID && order.productId !== TEAM_PRODUCT_ID) return;

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.error("Polar webhook: Supabase not configured, dropping order", order.id);
      return;
    }

    const { data: team, error } = await supabase
      .from("teams")
      .insert({
        name: order.customer.email ?? null,
        checkout_id: order.checkoutId,
        polar_subscription_id: order.subscriptionId,
        plan: "team",
        monthly_budget_usd: DEFAULT_MONTHLY_BUDGET_USD,
      })
      .select("id")
      .single();

    if (error || !team) {
      console.error("Polar webhook: failed to create team", error);
      return;
    }

    if (order.customer.email) {
      const { error: alertError } = await supabase.from("budget_alerts").insert({
        team_id: team.id,
        threshold_pct: DEFAULT_ALERT_THRESHOLD_PCT,
        notify_email: order.customer.email,
      });
      if (alertError) {
        console.error("Polar webhook: failed to create default budget alert", alertError);
      }
    }
  },
});
