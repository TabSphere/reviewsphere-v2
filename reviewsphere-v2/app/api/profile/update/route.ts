import { NextResponse } from "next/server";
import { getUserFromBearerToken } from "@/lib/auth/getUser";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const user = await getUserFromBearerToken(req);
    const body = await req.json();

    const updates: Record<string, any> = {};
    if (body.logo_url) updates.logo_url = body.logo_url;
    if (body.business_name) updates.business_name = body.business_name;

    if (!Object.keys(updates).length) {
      return NextResponse.json({ error: "No updates provided" }, { status: 400 });
    }

    await supabaseAdmin.from("profiles").update(updates).eq("id", user.id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof Error && e.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
    }
    console.error("[profile/update]", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
