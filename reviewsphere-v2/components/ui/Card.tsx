"use client";

import React from "react";

export default function Card({ children, className = "" }: React.PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`rounded-lg border p-4 bg-white/60 shadow-sm ${className}`.trim()}>{children}</div>
  );
}
