"use client";

import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export default function Select(props: SelectProps) {
  return (
    <select
      {...props}
      className={`rounded-md border px-3 py-2 text-sm bg-white/80 focus:ring-2 focus:ring-slate-300 ${props.className ?? ""}`.trim()}
    />
  );
}
