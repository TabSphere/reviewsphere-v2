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

      setOutput(json.generated_reply ?? "");

      const newItem: GenerationItem = {
        id: json.id ?? `local-${Date.now()}`,
        created_at: new Date().toISOString(),
        review_text: text,
        tone,
        generated_reply: json.generated_reply ?? "",
      };

      onNewItem?.(newItem);
      setText("");
    } catch (e: any) {
      console.error(e);
      alert(e?.message ?? String(e));
    } finally {
      setLoading(false);
    }
  }

  const charCount = text.length;

  return (
    <div className="rounded-xl border p-6 bg-white shadow-sm">
      <div className="mb-4">
        <div className="text-lg font-medium">Generate review reply</div>
        <div className="text-sm text-slate-600 mt-1">Provide business context and tone for the reply.</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <label className="text-sm font-medium mb-2 block">Business Context</label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} />
          <div className="flex justify-end text-xs text-slate-500 mt-2">{charCount} characters</div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium mb-2 block">Tone</label>
            <select value={tone} onChange={(e) => setTone(e.target.value)} className="w-full rounded-md border px-3 py-2">
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="concise">Concise</option>
            </select>
          </div>

          <div className="mt-auto">
            <Button
              onClick={handleGenerate}
              disabled={loading || !text || remaining <= 0}
              className={`w-full ${loading ? "opacity-70" : ""}`}
            >
              {loading ? <div className="flex items-center gap-2 justify-center"><Spinner size={16} /> Generating...</div> : "Generate"}
            </Button>
          </div>
        </div>
      </div>

      {remaining <= 0 && (
        <div className="mt-4 rounded-md p-3 bg-amber-50 border border-amber-100 text-amber-800">
          You have reached your plan limit. <a href="/upgrade" className="font-semibold text-amber-900">Upgrade Plan</a>
        </div>
      )}

      {output && (
        <div className="mt-6 rounded-md border p-4 bg-slate-50">
          <div className="font-medium mb-2">Generated Reply</div>
          <div className="whitespace-pre-wrap text-sm text-slate-700">{output}</div>
          <div className="mt-3">
            <Button variant="ghost" onClick={() => navigator.clipboard.writeText(output)}>Copy</Button>
          </div>
        </div>
      )}
    </div>
  );
}
