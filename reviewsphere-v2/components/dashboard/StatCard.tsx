"use client";

import React from "react";

export default function StatCard({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl p-6 border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="text-xs tracking-wide text-slate-500 uppercase">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-slate-900">{value}</div>
    </div>
  );
}
