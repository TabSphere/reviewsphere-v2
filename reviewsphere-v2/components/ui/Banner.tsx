"use client";

import React from "react";

export default function Banner({
  children,
  variant = "info",
}: React.PropsWithChildren<{ variant?: "info" | "error" | "success" }>) {
  const base = "rounded-md p-3 text-sm font-semibold";
  const classes = {
    info: "bg-slate-50 text-slate-700 border border-slate-100",
    error: "bg-rose-50 text-rose-700 border border-rose-100",
    success: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  } as const;

  return <div className={`${base} ${classes[variant]}`}>{children}</div>;
}
