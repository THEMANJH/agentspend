import { Webhooks } from "@polar-sh/nextjs";
import { getSupabaseAdmin } from "@/lib/supabase";

const TEAM_PRODUCT_ID = process.env.NEXT_PUBLIC_POLAR_TEAM_PRODUCT_ID;

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

    const { error } = await supabase.from("teams").insert({
      name: order.customer.email ?? null,
      checkout_id: order.checkoutId,
      polar_subscription_id: order.subscriptionId,
      plan: "team",
    });

    if (error) {
      console.error("Polar webhook: failed to create team", error);
    }
  },
});
