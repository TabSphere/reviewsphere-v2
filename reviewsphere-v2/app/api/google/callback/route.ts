import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

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

    // Store tokens in a simple table `oauth_tokens` associated by subject 'google'
    // Note: in a real app you must associate with the logged-in user and protect access properly.
    try {
      await supabaseAdmin.from("oauth_tokens").insert({ provider: "google", tokens: tokenJson });
    } catch (e) {
      console.warn("Failed to persist oauth tokens", e);
    }

    return NextResponse.redirect(new URL("/dashboard?google_linked=1", req.url));
  } catch (e) {
    console.error("/api/google/callback", e);
    return NextResponse.redirect(new URL("/dashboard?google_error=1", req.url));
  }
}
