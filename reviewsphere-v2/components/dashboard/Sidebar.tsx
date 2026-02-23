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
    <nav className="w-72 hidden md:flex flex-col gap-4 p-6 border-r border-slate-200 bg-[var(--background)]">
      <div>
        <div className="text-lg font-semibold">ReviewSphere</div>
        <div className="text-xs text-slate-500 mt-1">Professional replies</div>
      </div>

      <div className="mt-6 flex flex-col gap-1">
        {items.map((it) => (
          <a
            key={it.id}
            href={it.href}
            className={`group flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ease-in-out text-sm ${
              pathname?.includes(it.id) ? "bg-slate-50 border-l-2 border-slate-900 pl-2" : "hover:bg-slate-50"
            }`}
          >
            <span className="truncate">{it.label}</span>
          </a>
        ))}
      </div>

      <div className="mt-auto text-xs text-slate-500">© ReviewSphere</div>
    </nav>
  );
}
