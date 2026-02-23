"use client";

import React from "react";

type Variant = "primary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export default function Button({ variant = "primary", className = "", children, style, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold transition-shadow focus:outline-none";

  const variantClasses: Record<Variant, string> = {
    primary: "text-white hover:shadow-lg",
    ghost: "bg-white border text-slate-900 hover:shadow-sm",
    danger: "bg-rose-600 text-white hover:brightness-95",
  };

  // Primary uses CSS variables for a theme-aware gradient with sensible fallbacks
  const primaryStyle: React.CSSProperties = {
    background: 'linear-gradient(90deg, var(--primary, #00BFA6) 0%, var(--primary2, #5C6AC4) 100%)',
  };

  const mergedStyle = variant === "primary" ? { ...primaryStyle, ...(style as React.CSSProperties) } : style;

  return (
    <button className={`${base} ${variantClasses[variant]} ${className}`.trim()} style={mergedStyle} {...props}>
      {children}
    </button>
  );
}
