// Credit ledger helpers — always use these to modify credits
// Ensures idempotency via stripe_event_id

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function applyCredit(params: {
  userId: string;
  delta: number;
  source: string;
  stripePaymentIntent?: string | null;
  stripeEventId?: string;
}): Promise<void> {
  const { userId, delta, source, stripePaymentIntent, stripeEventId } = params;

  // Idempotency check — skip if already processed
  if (stripeEventId) {
    const { data: existing } = await supabaseAdmin
      .from("credit_ledger")
      .select("id")
      .eq("stripe_event_id", stripeEventId)
      .maybeSingle();

    if (existing) {
      console.log(`[credits] Skipping duplicate event ${stripeEventId}`);
      return;
    }
  }

  // Insert ledger row
  const { error: ledgerErr } = await supabaseAdmin
    .from("credit_ledger")
    .insert({
      user_id:               userId,
      source,
      delta,
      stripe_payment_intent: stripePaymentIntent ?? null,
      stripe_event_id:       stripeEventId ?? null,
    });

  if (ledgerErr) throw new Error(`credit_ledger insert: ${ledgerErr.message}`);

  // Recompute balance from ledger (ledger is source of truth)
  const { data: rows, error: sumErr } = await supabaseAdmin
    .from("credit_ledger")
    .select("delta")
    .eq("user_id", userId);

  if (sumErr) throw new Error(`credit_ledger sum: ${sumErr.message}`);

  const balance = Math.max(
    0,
    (rows ?? []).reduce((acc, r) => acc + (r.delta as number), 0)
  );

  const { error: profileErr } = await supabaseAdmin
    .from("profiles")
    .update({ credits_balance: balance })
    .eq("id", userId);

  if (profileErr) throw new Error(`profiles balance update: ${profileErr.message}`);
}