import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

// OAuth callback for Google. Exchanges code for tokens and stores them.
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/dashboard?google_error=1", req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard?google_error=1", req.url));
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"}/api/google/callback`;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "Google OAuth not configured" }, { status: 501 });
  }

  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.redirect(new URL("/login?google_error=1", req.url));
    }

    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });

    const tokenJson = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("Google token exchange failed", tokenJson);
      return NextResponse.redirect(new URL("/dashboard?google_error=1", req.url));
    }

    // Store Google Business account linked to user
    try {
      await supabaseAdmin.from("google_business_accounts").upsert({
        user_id: user.id,
        account_name: "Google Business Account",
        location_id: "demo_location",
        location_name: "Demo Business",
        access_token: tokenJson.access_token,
        refresh_token: tokenJson.refresh_token,
        token_expires_at: new Date(Date.now() + (tokenJson.expires_in * 1000)).toISOString(),
        is_active: true,
      });
    } catch (e) {
      console.warn("Failed to persist Google Business account", e);
    }

    return NextResponse.redirect(new URL("/dashboard?google_linked=1", req.url));
  } catch (e) {
    console.error("/api/google/callback", e);
    return NextResponse.redirect(new URL("/dashboard?google_error=1", req.url));
  }
}
