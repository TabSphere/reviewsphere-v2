import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    // If Google OAuth is configured, return the OAuth consent URL as JSON so
    // the client can navigate there. Otherwise show the friendly HTML guidance.
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"}/api/google/callback`;

    console.log("📡 Google Link Endpoint - Checking credentials:", {
      hasClientId: !!clientId,
      hasClientSecret: !!clientSecret,
      redirectUri,
      clientIdPrefix: clientId?.substring(0, 20) + "...",
    });

    if (clientId && clientSecret) {
      const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      authUrl.searchParams.set("client_id", clientId);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("response_type", "code");
      authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/business.manage openid email profile");
      authUrl.searchParams.set("access_type", "offline");
      authUrl.searchParams.set("prompt", "consent");
      
      console.log("✅ Google OAuth credentials found, returning auth URL");
      return NextResponse.json({ url: authUrl.toString() });
    }

    // Missing credentials
    console.warn("❌ Google OAuth credentials are not configured");
    return NextResponse.json(
      {
        error: "GOOGLE_CLIENT_ID and/or GOOGLE_CLIENT_SECRET not configured",
        hasClientId: !!clientId,
        hasClientSecret: !!clientSecret,
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("💥 Error in /api/google/link:", error);
    return NextResponse.json(
      { error: "Internal server error", details: String(error) },
      { status: 500 }
    );
  }
}
