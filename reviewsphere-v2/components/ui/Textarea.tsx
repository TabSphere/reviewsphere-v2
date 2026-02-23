"use client";

import React from "react";

export default function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-md border px-3 py-2 text-sm bg-white/80 focus:ring-2 focus:ring-slate-300 min-h-[120px] ${props.className ?? ""}`.trim()}
    />
  );
}
