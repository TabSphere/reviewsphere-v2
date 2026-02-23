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
    <div className="rounded-xl border p-4 bg-white shadow-sm">
      <div className="mb-3 text-lg font-medium">Recent generations</div>
      <ul className="space-y-3">
        {items.map((it) => (
          <li key={it.id} className="flex items-start justify-between gap-4 p-3 rounded-md hover:bg-slate-50 transition-all duration-200">
            <div className="flex-1">
              <div className="text-xs text-slate-500">{new Date(it.created_at).toLocaleString()} — {it.tone}</div>
              <div className="mt-1 text-sm text-slate-700 truncate">{it.review_text}</div>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="ghost" onClick={() => navigator.clipboard.writeText(it.generated_reply)}>Copy reply</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
