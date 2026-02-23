"use client";

import React, { useMemo, useState } from "react";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import Spinner from "@/components/dashboard/Spinner";
import { supabaseBrowser } from "@/lib/supabase/client";

type GenerationItem = {
  id: string;
  created_at: string;
  review_text: string;
  tone: string;
  generated_reply: string;
};

export default function GeneratePanel({
  initialUsed,
  limit,
  initialHistory = [],
  onNewItem,
}: {
  initialUsed: number;
  limit: number;
  initialHistory?: GenerationItem[];
  onNewItem?: (item: GenerationItem) => void;
}) {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);

  const remaining = useMemo(() => Math.max(limit - initialUsed, 0), [limit, initialUsed]);

  async function handleGenerate() {
    setLoading(true);
    try {
      const { data } = await supabaseBrowser.auth.getSession();
      const token = data?.session?.access_token;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ review_text: text, tone }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Generation failed");

      // API returns `reply` (server) — map to local `generated_reply`
      const replyText = json.reply ?? json.generated_reply ?? "";
      setOutput(replyText);

      const newItem: GenerationItem = {
        id: json.id ?? `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        review_text: text,
        tone,
        generated_reply: replyText,
      };

      onNewItem?.(newItem);
      setText("");
      // Optionally update remaining/used UI if API returned new counts
      // (not wired into parent yet)
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  const charCount = text.length;

  return (
    <div className="rounded-2xl border border-slate-200/70 p-8 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-slate-900">Generate Review Reply</h3>
        <p className="text-sm text-slate-600 mt-2 font-medium">Enter the customer review and select your preferred tone.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <label className="text-sm font-black text-slate-700 block mb-3 uppercase tracking-wider">Customer Review</label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-[140px] rounded-xl border-slate-200/70 bg-white/60 focus:bg-white" placeholder="Paste the customer review here..." />
          <div className="flex justify-end text-xs text-slate-500 mt-2 font-semibold">{charCount} / 2000 characters</div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-4">
          <div>
            <label className="text-sm font-black text-slate-700 block mb-3 uppercase tracking-wider">Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-xxl border border-slate-200/70 bg-white/60 px-4 py-2.5 text-sm font-medium focus:bg-white focus:border-blue-400 outline-none transition-all">
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="concise">Concise</option>
              <option value="empathetic">Empathetic</option>
              <option value="seo">SEO Local</option>
            </select>
          </div>

          <div className="mt-auto">
            <Button
              onClick={handleGenerate}
              disabled={loading || !text || remaining <= 0}
              className={`w-full text-white font-black py-3 rounded-xl hover:shadow-lg ${loading ? "opacity-70" : ""}`}
              style={{ background: 'linear-gradient(90deg, #00BFA6 0%, #5C6AC4 100%)' }}
            >
              {loading ? <div className="flex items-center gap-2 justify-center"><Spinner size={16} /> Generating...</div> : "Generate"}
            </Button>
          </div>

          {remaining <= 5 && remaining > 0 && (
            <div className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200/50 rounded-lg p-2 text-center">
              {remaining} left this month
            </div>
          )}
        </div>
      </div>

      {remaining <= 0 && (
        <div className="mt-6 rounded-xl p-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-black text-amber-900">Plan limit reached</div>
              <p className="text-sm text-amber-700 mt-1">Upgrade to continue generating replies</p>
            </div>
            <a href="/upgrade" className="px-4 py-2 rounded-lg bg-amber-600 text-white font-bold hover:bg-amber-700">Upgrade</a>
          </div>
        </div>
      )}

      {output && (
        <div className="mt-8 rounded-xl border border-teal-200/50 p-6 bg-gradient-to-br from-teal-50/50 to-indigo-50/50">
          <div className="font-black text-slate-900 mb-3 text-lg">✨ Generated Reply</div>
          <div className="whitespace-pre-wrap text-sm text-slate-700 leading-relaxed mb-4 bg-white/60 p-4 rounded-lg border border-slate-200/50">{output}</div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigator.clipboard.writeText(output)} className="flex-1 border border-slate-200/70 text-slate-700 font-bold hover:bg-white/50">
              📋 Copy
            </Button>
            <Button className="flex-1 px-4 py-2 font-bold">👍 Use This Reply</Button>
          </div>
        </div>
      )}
    </div>
  );
}
