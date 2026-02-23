"use client";

import React from "react";

type StatCardEnhancedProps = {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: number;
  color?: "teal" | "indigo" | "purple";
};

export default function StatCardEnhanced({
  title,
  value,
  icon,
  trend,
  color = "teal",
}: StatCardEnhancedProps) {
  const colorMap = {
    teal: { primary: "#00BFA6", light: "rgba(0, 191, 166, 0.08)" },
    indigo: { primary: "#5C6AC4", light: "rgba(92, 106, 196, 0.08)" },
    purple: { primary: "#A855F7", light: "rgba(168, 85, 247, 0.08)" },
  };

  const { primary, light } = colorMap[color];

  return (
    <div
      className="rounded-2xl p-6 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer group"
      style={{
        background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)",
        borderColor: `${color === "teal" ? "rgba(0,191,166,0.2)" : color === "indigo" ? "rgba(92,106,196,0.2)" : "rgba(168,85,247,0.2)"}`,
        backdropFilter: "blur(8px)",
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="text-xs tracking-widest font-black text-slate-600 uppercase">
            {title}
          </div>
          {trend !== undefined && (
            <div className="mt-2 flex items-center gap-1">
              <span
                className="text-xs font-bold"
                style={{ color: trend > 0 ? primary : "#EF4444" }}
              >
                {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className="p-3 rounded-lg group-hover:scale-110 transition-transform duration-300"
            style={{ background: light, color: primary }}
          >
            {icon}
          </div>
        )}
      </div>

      <div
        className="text-5xl font-black transition-all duration-300"
        style={{
          background: `linear-gradient(90deg, ${primary} 0%, ${
            color === "teal" ? "#5C6AC4" : color === "indigo" ? "#A855F7" : "#EC4899"
          } 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {value}
      </div>
    </div>
  );
}
