"use client";

import { useState, useEffect } from "react";

type TourStep = {
  id: string;
  target: string; // CSS selector
  title: string;
  description: string;
  position?: "top" | "bottom" | "left" | "right";
};

type GuidedTourProps = {
  steps: TourStep[];
  onComplete?: () => void;
};

export default function GuidedTour({ steps, onComplete }: GuidedTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  // Load tour state from localStorage on mount
  useEffect(() => {
    const tourStarted = localStorage.getItem("reviewsphere-tour-started");
    if (!tourStarted && steps.length > 0) {
      setIsVisible(true);
      localStorage.setItem("reviewsphere-tour-started", "true");
    }
  }, [steps]);

  // Update position when step changes
  useEffect(() => {
    if (!isVisible || steps.length === 0) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.target);

    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollTop = window.scrollY;
      const scrollLeft = window.scrollX;

      let top = rect.top + scrollTop + rect.height + 16;
      let left = rect.left + scrollLeft + rect.width / 2 - 150;

      // Handle different positions
      if (step.position === "top") {
        top = rect.top + scrollTop - 200;
      } else if (step.position === "left") {
        left = rect.left + scrollLeft - 320;
        top = rect.top + scrollTop + rect.height / 2 - 50;
      } else if (step.position === "right") {
        left = rect.left + scrollLeft + rect.width + 16;
        top = rect.top + scrollTop + rect.height / 2 - 50;
      }

      setPosition({ top: Math.max(20, top), left: Math.max(20, left) });
    }
  }, [currentStep, isVisible, steps]);

  // Highlight current step's target element
  useEffect(() => {
    // Clear previous highlights
    document.querySelectorAll(".tour-highlight").forEach((el) => {
      el.classList.remove("tour-highlight");
    });

    if (!isVisible || steps.length === 0) return;

    const step = steps[currentStep];
    const element = document.querySelector(step.target);
    if (element) {
      element.classList.add("tour-highlight");

      // Scroll element into view
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [currentStep, isVisible, steps]);

  if (!isVisible || steps.length === 0) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <>
      <style>{`
        .tour-highlight {
          position: relative;
          z-index: 998;
          box-shadow: 0 0 0 3px rgba(0, 191, 166, 0.3), 0 0 0 6px rgba(0, 191, 166, 0.1);
          border-radius: 8px;
          animation: tourPulse 2s infinite;
        }

        @keyframes tourPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(0, 191, 166, 0.3), 0 0 0 6px rgba(0, 191, 166, 0.1); }
          50% { box-shadow: 0 0 0 3px rgba(0, 191, 166, 0.5), 0 0 0 10px rgba(0, 191, 166, 0.05); }
        }

        .tour-tooltip {
          position: fixed;
          z-index: 999;
          max-width: 300px;
          animation: tourFadeIn 0.3s ease;
        }

        @keyframes tourFadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }

        .tour-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.3);
          z-index: 997;
          backdrop-filter: blur(2px);
        }
      `}</style>

      {/* Overlay */}
      <div className="tour-overlay" onClick={() => setIsVisible(false)} />

      {/* Tooltip */}
      <div className="tour-tooltip" style={{ top: position.top, left: position.left }}>
        <div
          className="rounded-2xl p-6 shadow-2xl border"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%)",
            borderColor: "rgba(0, 191, 166, 0.3)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Step counter */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex gap-1">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className="h-1.5 rounded-full transition-all"
                  style={{
                    width: idx === currentStep ? "16px" : "6px",
                    background:
                      idx <= currentStep
                        ? "linear-gradient(90deg, #00BFA6 0%, #5C6AC4 100%)"
                        : "rgba(0, 0, 0, 0.1)",
                  }}
                />
              ))}
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-slate-500 hover:text-slate-700 text-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Title */}
          <h3 className="font-black text-slate-900 text-lg mb-2">{step.title}</h3>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed mb-5">
            {step.description}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
              >
                ← Back
              </button>
            )}
            {!isLast && (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all"
                style={{ background: "linear-gradient(90deg, #00BFA6 0%, #5C6AC4 100%)" }}
              >
                Next →
              </button>
            )}
            {isLast && (
              <button
                onClick={() => {
                  setIsVisible(false);
                  onComplete?.();
                }}
                className="px-4 py-2 rounded-lg text-sm font-bold text-white transition-all"
                style={{ background: "linear-gradient(90deg, #00BFA6 0%, #5C6AC4 100%)" }}
              >
                Let's go! 🚀
              </button>
            )}
          </div>

          {/* Progress text */}
          <div className="text-xs text-slate-500 mt-3 text-center">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>
    </>
  );
}
