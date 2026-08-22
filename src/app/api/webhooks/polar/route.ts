import { Webhooks } from "@polar-sh/nextjs";
import { getSupabaseAdmin } from "@/lib/supabase";

const TEAM_PRODUCT_ID = process.env.NEXT_PUBLIC_POLAR_TEAM_PRODUCT_ID;

// New teams get a sane default so budget alerts work from the first sync.
// Buyers change both from the settings panel on their team dashboard.
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

    // teams.name is NOT NULL. Polar normally sends a customer email, but if it
    // ever does not, inserting null would abort the whole order and the buyer
    // would be charged and receive nothing.
    const teamName = order.customer?.email || `Team ${order.id.slice(0, 8)}`;

    const { data: team, error } = await supabase
      .from("teams")
      .insert({
        name: teamName,
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

    if (order.customer?.email) {
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
