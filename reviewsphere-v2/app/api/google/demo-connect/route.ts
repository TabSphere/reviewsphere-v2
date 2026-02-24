import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Create demo Google Business Account
    const { data: businessAccount, error: accountError } = await supabaseAdmin
      .from("google_business_accounts")
      .upsert({
        user_id: user.id,
        account_name: "Demo Business (Sample Data)",
        location_id: "demo_12345",
        location_name: "Demo Coffee Shop",
        access_token: "demo_token_" + user.id,
        is_active: true,
      })
      .select()
      .single();

    if (accountError) throw accountError;

    // Create sample reviews
    const sampleReviews = [
      {
        user_id: user.id,
        google_business_account_id: businessAccount.id,
        review_id: "demo_review_1",
        reviewer_name: "Sarah Johnson",
        rating: 5,
        comment: "Amazing coffee and the staff made me feel so welcome! Best cappuccino in town. 🎉",
        review_url: "https://google.com/reviews/1",
        reviewed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      },
      {
        user_id: user.id,
        google_business_account_id: businessAccount.id,
        review_id: "demo_review_2",
        reviewer_name: "Marcus Chen",
        rating: 4,
        comment: "Great atmosphere and good food. Only wish the WiFi was faster for working.",
        review_url: "https://google.com/reviews/2",
        reviewed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      {
        user_id: user.id,
        google_business_account_id: businessAccount.id,
        review_id: "demo_review_3",
        reviewer_name: "Emma Rodriguez",
        rating: 3,
        comment: "Food was good but service was a bit slow during lunch rush. Waited 20 mins for our order.",
        review_url: "https://google.com/reviews/3",
        reviewed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
    ];

    const { error: reviewError } = await supabaseAdmin
      .from("google_reviews")
      .upsert(sampleReviews);

    if (reviewError) throw reviewError;

    console.log("✅ Demo mode enabled with sample reviews for user:", user.id);
    return NextResponse.json({ success: true, message: "Demo mode enabled with 3 sample reviews" });
  } catch (error) {
    console.error("Demo connect error:", error);
    return NextResponse.json(
      { error: "Failed to enable demo mode: " + String(error) },
      { status: 500 }
    );
  }
}
