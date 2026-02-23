// POST /api/generate
// Generates a reply using OpenAI
// Deducts from subscription limit first, then credits_balance
// Requires: Authorization: Bearer <token>
// Body: { review_text: string, tone: string }

import { NextResponse } from "next/server";
import { getUserFromBearerToken } from "@/lib/auth/getUser";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateReply } from "@/lib/openai/client";
import { applyCredit } from "@/lib/stripe/credits";
import type { GenerateRequest, GenerateResponse } from "@/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getUserFromBearerToken(req);
    const { review_text, tone } = (await req.json()) as GenerateRequest;

    if (!review_text?.trim()) {
      return NextResponse.json(
        { error: "review_text is required" },
        { status: 400 }
      );
    }

    // Load profile
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("used_count, generation_limit, credits_balance, plan")
      .eq("id", user.id)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const hasSubLimit =
      profile.generation_limit > 0 &&
      profile.used_count < profile.generation_limit;
    const hasCredits = profile.credits_balance > 0;

    if (!hasSubLimit && !hasCredits) {
      return NextResponse.json(
        { error: "No generations remaining. Please upgrade or purchase credits." },
        { status: 402 }
      );
    }

    // Generate reply via OpenAI
    const reply = await generateReply(review_text, tone ?? "Professional");

    // Save to generations table
    await supabaseAdmin.from("generations").insert({
      user_id:         user.id,
      review_text:     review_text.trim(),
      generated_reply: reply,
      tone:            tone ?? "Professional",
    });

    // Deduct from subscription limit first, then credits
    let newUsed    = profile.used_count;
    let newCredits = profile.credits_balance;

    if (hasSubLimit) {
      newUsed = profile.used_count + 1;
      await supabaseAdmin
        .from("profiles")
        .update({ used_count: newUsed })
        .eq("id", user.id);
    } else {
      newCredits = profile.credits_balance - 1;
      await supabaseAdmin
        .from("profiles")
        .update({ credits_balance: newCredits })
        .eq("id", user.id);

      await applyCredit({
        userId: user.id,
        delta:  -1,
        source: "used",
      });
    }

    const response: GenerateResponse = {
      reply,
      used:    newUsed,
      limit:   profile.generation_limit,
      credits: newCredits,
    };

    return NextResponse.json(response);
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    console.error("[generate]", e);
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}