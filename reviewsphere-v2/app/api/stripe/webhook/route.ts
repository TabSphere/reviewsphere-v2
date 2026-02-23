// POST /api/stripe/webhook
// Handles all Stripe events — signature verified, no auth header needed
//
// Events handled:
//   checkout.session.completed    → provision plan OR add credits
//   invoice.payment_succeeded     → renew subscription credits
//   customer.subscription.updated → plan change
//   customer.subscription.deleted → cancellation

import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { applyCredit } from "@/lib/stripe/credits";
import { PLAN_CONFIG, planFromPriceId } from "@/lib/stripe/plans";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body      = await req.text();
  const signature = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  console.log(`[webhook] ${event.type} | ${event.id}`);

  try {
    switch (event.type) {

      // ── Checkout completed ──────────────────────────────────────────
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId  = session.metadata?.supabase_user_id;
        const plan    = session.metadata?.plan;

        if (!userId || !plan) {
          console.error("[webhook] Missing metadata on session:", session.id);
          break;
        }

        const config = PLAN_CONFIG[plan];
        if (!config) break;

        if (config.isSubscription && session.mode === "subscription") {
          const sub = await stripe.subscriptions.retrieve(
            session.subscription as string
          );

          await supabaseAdmin.from("profiles").update({
            plan:                   plan,
            generation_limit:       config.generationLimit,
            used_count:             0,
            stripe_subscription_id: sub.id,
          }).eq("id", userId);

          await applyCredit({
            userId,
            delta:         config.generationLimit,
            source:        "subscription",
            stripeEventId: event.id,
          });

        } else if (!config.isSubscription && session.mode === "payment") {
          await applyCredit({
            userId,
            delta:               config.credits,
            source:              "purchase",
            stripePaymentIntent: session.payment_intent as string,
            stripeEventId:       event.id,
          });
        }

        console.log(`[webhook] Provisioned ${plan} for user ${userId}`);
        break;
      }

      // ── Subscription renewal ────────────────────────────────────────
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as any;
        if (invoice.billing_reason !== "subscription_cycle") break;

        const sub    = await stripe.subscriptions.retrieve(
          invoice.subscription as string
        );
        const userId = sub.metadata?.supabase_user_id;
        const plan   = sub.metadata?.plan;

        if (!userId || !plan) break;

        const config = PLAN_CONFIG[plan];
        if (!config) break;

        await supabaseAdmin.from("profiles")
          .update({ used_count: 0 })
          .eq("id", userId);

        await applyCredit({
          userId,
          delta:               config.generationLimit,
          source:              "subscription",
          stripePaymentIntent: invoice.payment_intent as string,
          stripeEventId:       event.id,
        });

        console.log(`[webhook] Renewed ${plan} for user ${userId}`);
        break;
      }

      // ── Plan change ─────────────────────────────────────────────────
      case "customer.subscription.updated": {
        const sub    = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) break;

        const priceId = sub.items.data[0]?.price?.id;
        if (!priceId) break;

        const plan   = planFromPriceId(priceId);
        const config = PLAN_CONFIG[plan];
        if (!config) break;

        await supabaseAdmin.from("profiles").update({
          plan,
          generation_limit:       config.generationLimit,
          stripe_subscription_id: sub.id,
        }).eq("id", userId);

        console.log(`[webhook] Plan updated → ${plan} for user ${userId}`);
        break;
      }

      // ── Cancellation ────────────────────────────────────────────────
      case "customer.subscription.deleted": {
        const sub    = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.supabase_user_id;
        if (!userId) break;

        await supabaseAdmin.from("profiles").update({
          plan:                   "free",
          generation_limit:       0,
          used_count:             0,
          stripe_subscription_id: null,
        }).eq("id", userId);

        console.log(`[webhook] Cancelled for user ${userId}`);
        break;
      }

      default:
        console.log(`[webhook] Unhandled: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (err) {
    console.error("[webhook] Handler error:", err);
    return NextResponse.json(
      { received: true, error: String(err) },
      { status: 200 }
    );
  }
}