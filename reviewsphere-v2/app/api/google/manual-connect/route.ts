import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken || typeof accessToken !== "string") {
      return NextResponse.json(
        { error: "Valid Google access token required" },
        { status: 400 }
      );
    }

    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    // Verify the token is valid by calling Google API
    const verifyRes = await fetch("https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=" + accessToken);
    const verifyData = await verifyRes.json();

    if (!verifyRes.ok || verifyData.error) {
      return NextResponse.json(
        { error: "Invalid or expired access token" },
        { status: 400 }
      );
    }

    // Store the token
    await supabaseAdmin.from("google_business_accounts").upsert({
      user_id: user.id,
      account_name: "Google Business Account",
      location_id: "user_managed",
      location_name: "User Business",
      access_token: accessToken,
      refresh_token: null, // Manual token won't have refresh
      token_expires_at: new Date(Date.now() + (3600 * 1000)).toISOString(), // 1 hour
      is_active: true,
    });

    console.log("✅ User connected Google account via manual token");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Manual Google connect error:", error);
    return NextResponse.json(
      { error: "Failed to connect Google account" },
      { status: 500 }
    );
  }
}
