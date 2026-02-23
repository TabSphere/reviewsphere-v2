"use client";

import React from "react";
import { usePathname } from "next/navigation";

const items = [
  { id: "overview", label: "Overview", href: "#overview" },
  { id: "generate", label: "Generate Review", href: "#generate" },
  { id: "history", label: "History", href: "#history" },
  { id: "billing", label: "Billing", href: "#billing" },
  { id: "settings", label: "Settings", href: "#settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-72 hidden md:flex flex-col gap-4 p-6 border-r border-slate-200/50 bg-white/40 backdrop-blur-md sticky top-0 h-screen">
      <div className="pb-4 border-b border-slate-200/50">
        <div className="text-lg font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ReviewSphere</div>
        <div className="text-xs text-slate-500 mt-1 font-medium">AI Review Replies</div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        {items.map((it) => (
          <a
            key={it.id}
            href={it.href}
            className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ease-in-out text-sm font-medium ${
              pathname?.includes(it.id) ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-900 border-l-2 border-blue-600" : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
            }`}
          >
            <span className="truncate">{it.label}</span>
          </a>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-200/50 text-xs text-slate-500 font-medium">© 2026 ReviewSphere</div>
    </nav>
  );
}
