"use client";

import { useState } from "react";
import StatCardEnhanced from "./StatCardEnhanced";

type StatItem = {
  title: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  trend?: number;
  color?: "teal" | "indigo" | "purple";
};

type DashboardStatsProps = {
  stats: StatItem[];
};

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const [mobileIndex, setMobileIndex] = useState(0);

  // Icons for each stat type
  const icons: Record<string, React.ReactNode> = {
    Plan: "📋",
    Used: "✏️",
    Remaining: "🎯",
  };

  return (
    <>
      <style>{`
        @media (max-width: 640px) {
          .stats-carousel {
            scroll-behavior: smooth;
            scroll-snap-type: x mandatory;
          }
          .stats-carousel > * {
            scroll-snap-align: start;
          }
        }
      `}</style>

      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => (
          <StatCardEnhanced
            key={idx}
            title={stat.title}
            value={stat.value}
            icon={icons[stat.title] || stat.icon}
            trend={stat.trend}
            color={stat.color || (idx === 0 ? "teal" : idx === 1 ? "indigo" : "purple")}
          />
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <div
          className="stats-carousel flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="flex-shrink-0 w-full sm:w-80">
              <StatCardEnhanced
                title={stat.title}
                value={stat.value}
                icon={icons[stat.title] || stat.icon}
                trend={stat.trend}
                color={stat.color || (idx === 0 ? "teal" : idx === 1 ? "indigo" : "purple")}
              />
            </div>
          ))}
        </div>

        {/* Carousel indicators */}
        <div className="flex justify-center gap-2 mt-2">
          {stats.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setMobileIndex(idx)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: mobileIndex === idx ? "24px" : "8px",
                background:
                  mobileIndex === idx
                    ? "linear-gradient(90deg, #00BFA6 0%, #5C6AC4 100%)"
                    : "rgba(0, 0, 0, 0.1)",
              }}
            />
          ))}
        </div>

        {/* Info text */}
        <p className="text-xs text-slate-600 text-center mt-3">
          Slide for more stats • {mobileIndex + 1} of {stats.length}
        </p>
      </div>
    </>
  );
}
