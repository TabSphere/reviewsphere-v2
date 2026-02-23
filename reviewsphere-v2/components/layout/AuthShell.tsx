"use client";

import React from "react";

export default function AuthShell({ children }: React.PropsWithChildren) {
  return (
    <div className="min-h-screen grid place-items-center bg-[var(--background)] p-6">
      <div className="max-w-md w-full">
        <div className="rounded-xl border p-6 bg-white/60 shadow-md">{children}</div>
      </div>
    </div>
  );
}
