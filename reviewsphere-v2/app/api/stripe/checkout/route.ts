// POST /api/stripe/checkout
// Creates a Stripe Checkout session (subscription or one-time)
// Requires: Authorization: Bearer <token>
// Body: { plan: 'starter' | 'pro' | 'credits_100' | 'credits_300' }

import { NextResponse } from "next/server";
import { getUserFromBearerToken } from "@/lib/auth/getUser";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";
import { PLAN_CONFIG } from "@/lib/stripe/plans";
import type { CheckoutRequest } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getUserFromBearerToken(req);
    const { plan } = (await req.json()) as CheckoutRequest;

    const config = PLAN_CONFIG[plan];
    if (!config) {
      return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400 });
    }

    if (!config.priceId) {
      return NextResponse.json(
        { error: `Stripe price ID for plan '${plan}' is not configured. Please set the appropriate STRIPE_PRICE_* environment variable.` },
        { status: 503 }
      );
    }

    // Get or create Stripe customer
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id, email")
      .eq("id", user.id)
      .single();

    let customerId = profile?.stripe_customer_id as string | undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email:    user.email ?? profile?.email ?? undefined,
        metadata: { supabase_user_id: user.id },
      });
      customerId = customer.id;

      await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

    const sessionParams: any = {
      customer:              customerId,
      line_items:            [{ price: config.priceId, quantity: 1 }],
      success_url:           `${baseUrl}/dashboard?upgraded=1`,
      cancel_url:            `${baseUrl}/upgrade?cancelled=1`,
      allow_promotion_codes: true,
      metadata: {
        supabase_user_id: user.id,
        plan,
      },
    };

    if (config.isSubscription) {
      sessionParams.mode = "subscription";
      sessionParams.subscription_data = {
        metadata: {
          supabase_user_id: user.id,
          plan,
        },
      };
    } else {
      sessionParams.mode = "payment";
      sessionParams.payment_intent_data = {
        metadata: {
          supabase_user_id: user.id,
          plan,
          credits:          String(config.credits),
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    console.error("[checkout]", e);
    const message = e instanceof Error ? e.message : String(e);
    const body: any = { error: "Server error" };
    if (process.env.NODE_ENV !== "production") body.details = message;
    return NextResponse.json(body, { status: 500 });
  }
}