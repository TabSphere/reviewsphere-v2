import { createSupabaseServer } from "@/lib/supabase/server";
import DashboardStats from "@/components/dashboard/DashboardStats";
import GeneratePanel from "@/components/dashboard/GeneratePanel";
import HistoryList from "@/components/dashboard/HistoryList";
import OverviewPanel from "@/components/dashboard/OverviewPanel";
import GuidedTour from "@/components/layout/GuidedTour";

type GenerationItem = {
  id: string;
  created_at: string;
  review_text: string;
  tone: string;
  generated_reply: string;
};

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

  const { data: history } = await supabase
    .from("generations")
    .select("id, review_text, generated_reply, tone, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const used = profile?.used_count ?? 0;
  const limit = profile?.generation_limit ?? 0;

  const historyItems: GenerationItem[] = (history ?? []).map((h: any) => ({
    id: h.id,
    created_at: h.created_at,
    review_text: h.review_text,
    tone: h.tone,
    generated_reply: h.generated_reply,
  }));

  // Define tour steps
  const tourSteps = [
    {
      id: "overview",
      target: "#overview-panel",
      title: "Welcome to ReviewSphere! 👋",
      description:
        "Upload your logo and link your Google Business account to get started. This is your business profile.",
      position: "bottom" as const,
    },
    {
      id: "stats",
      target: "#overview",
      title: "Track Your Progress",
      description:
        "See your current plan, how many replies you've used, and how many remain this month.",
      position: "bottom" as const,
    },
    {
      id: "generate",
      target: "#generate",
      title: "Generate Review Replies",
      description:
        "Select a review tone and let AI generate a professional response. Copy or use it directly!",
      position: "top" as const,
    },
    {
      id: "history",
      target: "#history",
      title: "View Your History",
      description:
        "All your generated replies are saved here. Track what you've created and refine your tone preferences.",
      position: "top" as const,
    },
  ];

  return (
    <div>
      <GuidedTour steps={tourSteps} onComplete={() => console.log("Tour completed")} />
      <div className="space-y-6 animate-subtle">
        <section id="overview-panel">
          <OverviewPanel profile={profile ?? null} />
        </section>
        <section id="overview">
          <DashboardStats
            stats={[
              { title: "Plan", value: profile?.plan ?? "Starter", color: "teal" },
              { title: "Used", value: used, color: "indigo", trend: 12 },
              { title: "Remaining", value: Math.max(limit - used, 0), color: "purple" },
            ]}
          />
        </section>

        <section id="generate">
          <GeneratePanel initialUsed={used} limit={limit} initialHistory={historyItems} />
        </section>

        <section id="history">
          <HistoryList items={historyItems} />
        </section>
      </div>
    </div>
  );
}