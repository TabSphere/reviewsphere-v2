"use client";

import React from "react";

export default function StatCard({ title, value }: { title: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-6 border border-slate-200/70 bg-white/70 backdrop-blur-md shadow-sm transition-all duration-200 hover:shadow-lg hover:bg-white/80 hover:border-slate-300/70">
      <div className="text-xs tracking-widest font-black text-slate-600 uppercase">{title}</div>
      <div className="mt-4 text-5xl font-black" style={{ background: 'linear-gradient(90deg, #00BFA6 0%, #5C6AC4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', color: '#00BFA6' }}>{value}</div>
    </div>
  );
}
