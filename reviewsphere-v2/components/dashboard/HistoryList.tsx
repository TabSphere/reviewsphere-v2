"use client";

import React from "react";
import Button from "@/components/ui/Button";

type Item = {
  id: string;
  created_at: string;
  review_text: string;
  tone: string;
  generated_reply: string;
};

export default function HistoryList({ items }: { items: Item[] }) {
  return (
    <div className="rounded-2xl border border-slate-200/70 p-8 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-black text-slate-900">📜 Generation History</h3>
        <p className="text-sm text-slate-600 mt-2 font-medium">Your last 10 generated replies</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">✨</div>
          <p className="text-slate-600 font-semibold">No generations yet</p>
          <p className="text-sm text-slate-500 mt-1">Generate your first review reply above to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <div key={it.id} className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/50 border border-slate-200/50 hover:bg-white/70 hover:border-slate-300/50 transition-all duration-200">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-black text-slate-500 uppercase bg-slate-100/80 px-2 py-1 rounded-md">{it.tone}</span>
                  <span className="text-xs text-slate-400 font-medium">{new Date(it.created_at).toLocaleDateString()} {new Date(it.created_at).toLocaleTimeString()}</span>
                </div>
                <div className="text-sm text-slate-700 font-medium line-clamp-2 mb-2">"{it.review_text}"</div>
                <div className="text-xs text-slate-600 italic bg-blue-50/50 border border-blue-100/50 rounded-lg p-2">💬 {it.generated_reply.substring(0, 100)}...</div>
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <Button 
                  variant="ghost" 
                  onClick={() => navigator.clipboard.writeText(it.generated_reply)}
                  className="text-xs font-bold px-3 py-2 rounded-lg border border-slate-200/70 hover:bg-white/50 whitespace-nowrap"
                >
                  📋 Copy
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
