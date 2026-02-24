import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const supabase = await createSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user has linked Google Business account
    const { data: business } = await supabase
      .from("google_business_accounts")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true)
      .single();

    if (!business) {
      return NextResponse.json({ reviews: [], message: "No Google Business account linked" });
    }

    // In production, this would call Google Business Profile API
    // For now, return mock data for demonstration
    const mockReviews = [
      {
        id: "review_1",
        reviewer_name: "Sarah Johnson",
        reviewer_photo_url: null,
        rating: 5,
        review_text: "Absolutely amazing service! The team went above and beyond to help me. Highly recommend!",
        review_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        reply_status: "pending",
      },
      {
        id: "review_2",
        reviewer_name: "Mike Chen",
        reviewer_photo_url: null,
        rating: 4,
        review_text: "Great experience overall. Fast and professional. Would use again.",
        review_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        reply_status: "pending",
      },
      {
        id: "review_3",
        reviewer_name: "Emily Rodriguez",
        reviewer_photo_url: null,
        rating: 3,
        review_text: "Good service but took longer than expected. Staff was friendly though.",
        review_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        reply_status: "pending",
      },
    ];

    return NextResponse.json({ reviews: mockReviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}
