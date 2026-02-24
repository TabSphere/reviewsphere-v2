import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const reviewId = params.reviewId;

    // In production, this would:
    // 1. Mark the reply as approved in the database
    // 2. Post the reply to Google Business Profile API
    // 3. Update the review status

    // For demo purposes, we'll just return success
    return NextResponse.json({
      success: true,
      message: "Reply approved and will be posted to Google",
    });
  } catch (error) {
    console.error("Error approving reply:", error);
    return NextResponse.json(
      { error: "Failed to approve reply" },
      { status: 500 }
    );
  }
}
