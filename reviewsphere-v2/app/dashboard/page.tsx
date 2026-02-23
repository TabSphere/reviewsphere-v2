import { createSupabaseServer } from "@/lib/supabase/server";
import StatCard from "@/components/dashboard/StatCard";
import GeneratePanel from "@/components/dashboard/GeneratePanel";
import HistoryList from "@/components/dashboard/HistoryList";

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

  return (
    <div className="space-y-6 animate-subtle">
      <section id="overview">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard title="Plan" value={profile?.plan ?? "starter"} />
          <StatCard title="Used" value={used} />
          <StatCard title="Remaining" value={Math.max(limit - used, 0)} />
        </div>
      </section>

      <section id="generate">
        <GeneratePanel initialUsed={used} limit={limit} initialHistory={historyItems} />
      </section>

      <section id="history">
        <HistoryList items={historyItems} />
      </section>
    </div>
  );
}