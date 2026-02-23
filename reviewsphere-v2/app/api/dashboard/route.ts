// GET /api/dashboard
// Returns profile, usage stats, and last 10 generations
// Requires: Authorization: Bearer <token>

import { NextResponse } from "next/server";
import { getUserFromBearerToken } from "@/lib/auth/getUser";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DashboardPayload } from "@/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const user = await getUserFromBearerToken(req);

    // Load profile
    const { data: profile, error: profileErr } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Load last 10 generations
    const { data: history } = await supabaseAdmin
      .from("generations")
      .select("id, user_id, review_text, generated_reply, tone, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10);

    const payload: DashboardPayload = {
      profile,
      usage: {
        used:    profile.used_count,
        limit:   profile.generation_limit,
        credits: profile.credits_balance,
        plan:    profile.plan,
      },
      history: history ?? [],
    };

    return NextResponse.json(payload);
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    console.error("[dashboard]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}