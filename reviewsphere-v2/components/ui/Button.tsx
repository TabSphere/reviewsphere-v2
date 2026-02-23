"use client";

import React from "react";

type Variant = "primary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-shadow focus:outline-none";

  const variants: Record<Variant, string> = {
    primary: "bg-slate-900 text-white hover:shadow-lg",
    ghost: "bg-white border text-slate-900 hover:shadow-sm",
    danger: "bg-rose-600 text-white hover:brightness-95",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
