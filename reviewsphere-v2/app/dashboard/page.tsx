import { createSupabaseServer } from "@/lib/supabase/server";
import DashboardStats from "@/components/dashboard/DashboardStats";
import OverviewPanel from "@/components/dashboard/OverviewPanel";
import GoogleBusinessConnect from "@/components/dashboard/GoogleBusinessConnect";
import ReviewManagement from "@/components/dashboard/ReviewManagement";
import ImageCarousel from "@/components/layout/ImageCarousel";

export default async function DashboardPage() {
  const supabase = await createSupabaseServer();

  // Get current user session and profile
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // no session - render minimal UI (middleware should redirect normally)
    return <div className="text-center p-8">Please sign in.</div>;
  }

  const { data: profile } = await supabase.from("profiles").select("id, email, plan, used_count, generation_limit, credits_balance, full_name").eq("id", user.id).single();

  // Check if Google Business is linked
  const { data: googleBusiness } = await supabase
    .from("google_business_accounts")
    .select("location_name, is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  const used = profile?.used_count ?? 0;
  const limit = profile?.generation_limit ?? 0;

  return (
    <div className="relative min-h-screen">
      {/* Background Carousel */}
      <div className="fixed inset-0 z-0 opacity-30">
        <ImageCarousel />
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-6 animate-subtle">
        {/* Welcome Header */}
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl border-2 border-white/50 p-6 shadow-xl">
          <h1 className="text-3xl font-black text-slate-900 mb-2">
            Welcome back, {profile?.full_name || "there"}! 👋
          </h1>
          <p className="text-slate-600 font-semibold">
            Manage your Google reviews and generate AI-powered replies automatically.
          </p>
        </div>

        {/* Stats Overview */}
        <section>
          <DashboardStats
            stats={[
              { title: "Plan", value: profile?.plan ?? "Starter", color: "teal" },
              { title: "Replies Used", value: used, color: "indigo", trend: 12 },
              { title: "Remaining", value: Math.max(limit - used, 0), color: "purple" },
            ]}
          />
        </section>

        {/* Google Business Connection */}
        <section className="bg-white/95 backdrop-blur-xl rounded-2xl border-2 border-white/50 p-6 shadow-xl">
          <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <span>🔗</span> Google Business Profile
          </h2>
          <GoogleBusinessConnect
            isLinked={!!googleBusiness}
            businessName={googleBusiness?.location_name}
          />
        </section>

        {/* Review Management */}
        {googleBusiness && (
          <section className="bg-white/95 backdrop-blur-xl rounded-2xl border-2 border-white/50 p-6 shadow-xl">
            <h2 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
              <span>⭐</span> Review Management
            </h2>
            <ReviewManagement />
          </section>
        )}

        {/* Business Profile (if not linked, show alternative content) */}
        {!googleBusiness && (
          <section id="overview-panel">
            <OverviewPanel profile={profile ?? null} />
          </section>
        )}
      </div>
    </div>
  );
}