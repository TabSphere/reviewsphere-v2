// POST /api/stripe/portal
// Returns a Stripe Billing Portal URL
// Requires: Authorization: Bearer <token>

import { NextResponse } from "next/server";
import { getUserFromBearerToken } from "@/lib/auth/getUser";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getUserFromBearerToken(req);

    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("stripe_customer_id")
      .eq("id", user.id)
      .single();

    const customerId = profile?.stripe_customer_id as string | undefined;

    if (!customerId) {
      return NextResponse.json(
        { error: "No billing account found. Please subscribe first." },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

    const session = await stripe.billingPortal.sessions.create({
      customer:   customerId,
      return_url: `${baseUrl}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    console.error("[portal]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}