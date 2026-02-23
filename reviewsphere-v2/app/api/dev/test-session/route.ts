import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

// Dev-only helper to create a test user and return an access token.
// ENABLE_DEV_ENDPOINTS must be set to '1' to enable this route.
export async function POST(req: Request) {
  if (process.env.ENABLE_DEV_ENDPOINTS !== "1") {
    return NextResponse.json({ error: "Not enabled" }, { status: 404 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const email = body.email ?? `dev+${Date.now()}@example.com`;
    const password = body.password ?? `P@ssw0rd!${Date.now()}`;

    // Create user via admin API (idempotent if user exists)
    try {
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });
    } catch (e) {
      // ignore if user exists
      console.warn("createUser failed (may already exist)", e);
    }

    // Sign in to obtain a session token
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return NextResponse.json({ error: "Could not sign in test user", detail: error?.message }, { status: 500 });
    }

    // Ensure profiles row exists
    try {
      await supabaseAdmin.from("profiles").upsert({ id: data.user?.id, email }).select();
    } catch (e) {
      console.warn("upsert profile failed", e);
    }

    return NextResponse.json({ email, password, token: data.session.access_token });
  } catch (e) {
    console.error("/api/dev/test-session", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
