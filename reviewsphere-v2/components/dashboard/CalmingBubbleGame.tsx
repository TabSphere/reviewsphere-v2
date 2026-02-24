"use client";

import { useState, useEffect } from "react";

type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speedY: number;
};

const COLORS = [
  "from-pink-400 to-rose-500",
  "from-blue-400 to-cyan-500",
  "from-purple-400 to-indigo-500",
  "from-green-400 to-emerald-500",
  "from-yellow-400 to-orange-500",
  "from-teal-400 to-cyan-500",
];

export default function CalmingBubbleGame({ isVisible }: { isVisible: boolean }) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [nextId, setNextId] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    // Generate bubbles periodically
    const bubbleInterval = setInterval(() => {
      const newBubble: Bubble = {
        id: nextId,
        x: Math.random() * 90, // 0-90% width
        y: 100, // Start from bottom
        size: 40 + Math.random() * 40, // 40-80px
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speedY: 0.5 + Math.random() * 1, // Float up speed
      };
      setBubbles((prev) => [...prev, newBubble]);
      setNextId((id) => id + 1);
    }, 1200);

    // Animate bubbles moving up
    const animationInterval = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((bubble) => ({
            ...bubble,
            y: bubble.y - bubble.speedY,
          }))
          .filter((bubble) => bubble.y > -20) // Remove bubbles that float off screen
      );
    }, 50);

    return () => {
      clearInterval(bubbleInterval);
      clearInterval(animationInterval);
    };
  }, [isVisible, nextId]);

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    setScore((s) => s + 1);
  };

  if (!isVisible) return null;

  return (
    <div className="relative w-full h-[400px] bg-gradient-to-b from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200/50 overflow-hidden shadow-inner">
      {/* Header */}
      <div className="absolute top-4 left-0 right-0 z-10 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg border border-indigo-200/50">
          <span className="text-2xl">🎈</span>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-600 uppercase tracking-wide">Bubbles Popped</div>
            <div className="text-2xl font-black bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text text-transparent">
              {score}
            </div>
          </div>
        </div>
      </div>

      {/* Instruction */}
      {score === 0 && (
        <div className="absolute top-24 left-0 right-0 text-center animate-pulse">
          <p className="text-sm font-bold text-slate-600">Click the bubbles to relax while waiting! 💆‍♀️</p>
        </div>
      )}

      {/* Bubbles */}
      {bubbles.map((bubble) => (
        <button
          key={bubble.id}
          onClick={() => popBubble(bubble.id)}
          className={`absolute cursor-pointer transition-transform hover:scale-110 active:scale-0 rounded-full shadow-lg bg-gradient-to-br ${bubble.color} animate-pulse`}
          style={{
            left: `${bubble.x}%`,
            bottom: `${100 - bubble.y}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            transform: "translateX(-50%)",
          }}
          aria-label="Pop bubble"
        >
          <div className="absolute inset-0 rounded-full bg-white/30 blur-sm"></div>
          <span className="absolute inset-0 flex items-center justify-center text-2xl opacity-70">💫</span>
        </button>
      ))}

      {/* Motivational messages */}
      {score > 0 && score % 10 === 0 && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-subtle">
          <div className="text-4xl font-black text-transparent bg-gradient-to-r from-teal-500 to-indigo-600 bg-clip-text">
            Great job! 🎉
          </div>
        </div>
      )}
    </div>
  );
}
